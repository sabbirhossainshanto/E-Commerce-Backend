"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderService = void 0;
const prisma_1 = __importDefault(require("../../helpers/prisma"));
const AppError_1 = require("../../errors/AppError");
const http_status_1 = __importDefault(require("http-status"));
const payment_utils_1 = require("../payment/payment.utils");
const createOrder = (user, payload) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const userData = yield prisma_1.default.user.findUnique({
        where: { id: user.id },
    });
    if (!userData) {
        throw new AppError_1.AppError(http_status_1.default.NOT_FOUND, "User is not found");
    }
    let discount = null;
    let discountType = null;
    if ((_a = payload === null || payload === void 0 ? void 0 : payload[0]) === null || _a === void 0 ? void 0 : _a.coupon) {
        const coupon = yield prisma_1.default.coupon.findUnique({
            where: {
                code: (_b = payload === null || payload === void 0 ? void 0 : payload[0]) === null || _b === void 0 ? void 0 : _b.coupon,
            },
        });
        if (!coupon) {
            throw new AppError_1.AppError(http_status_1.default.NOT_FOUND, "Coupon code is not found");
        }
        discount = coupon.discount;
        discountType = coupon.discountType;
    }
    const productIds = payload.map((item) => item.productId);
    const products = yield prisma_1.default.product.findMany({
        where: { id: { in: productIds } },
    });
    if (products.length !== payload.length) {
        throw new AppError_1.AppError(http_status_1.default.NOT_FOUND, "Some products are not found");
    }
    let totalAmount = 0;
    let discountedPrice = 0;
    for (const item of payload) {
        const product = products.find((p) => p.id === item.productId);
        if (!product) {
            throw new AppError_1.AppError(http_status_1.default.NOT_FOUND, `Product with ID ${item.productId} is not found`);
        }
        if (product.inventory < item.quantity) {
            throw new AppError_1.AppError(http_status_1.default.BAD_REQUEST, `Insufficient quantity for product ${product.name}`);
        }
        if (discount && discountType) {
            if (discountType === "PERCENTAGE") {
                totalAmount += product.price * item.quantity * (1 - discount / 100);
            }
            else {
                totalAmount += product.price * item.quantity - discount;
            }
        }
        else {
            totalAmount += product.price * item.quantity;
        }
    }
    const transactionId = `TXN-${Date.now()}`;
    const orders = [];
    for (const item of payload) {
        const product = products.find((p) => p.id === item.productId);
        yield prisma_1.default.product.update({
            where: { id: product.id },
            data: { inventory: product.inventory - item.quantity },
        });
        if (discount && discountType) {
            if (discountType === "PERCENTAGE") {
                discountedPrice += product.price * (1 - discount / 100);
            }
            else {
                discountedPrice += product.price - discount;
            }
        }
        // Create an order entry
        const order = {
            transactionId,
            discountedPrice,
            quantity: item.quantity,
            userId: user.id,
            shopId: product.shopId,
            productId: product.id,
        };
        orders.push(order);
    }
    yield prisma_1.default.order.createMany({
        data: orders,
    });
    const paymentData = {
        transactionId,
        amount: totalAmount,
        customerName: userData === null || userData === void 0 ? void 0 : userData.name,
        customerAddress: "N/A",
        customerEmail: userData === null || userData === void 0 ? void 0 : userData.email,
        customerPhone: "N/A",
    };
    const paymentSession = yield (0, payment_utils_1.initiatePayment)(paymentData);
    return paymentSession;
});
const getAllOrders = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const orders = yield prisma_1.default.order.findMany({
        include: {
            product: true,
            shop: true,
        },
    });
    return orders;
});
const getMyOrders = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const orders = yield prisma_1.default.order.findMany({
        where: {
            userId: user === null || user === void 0 ? void 0 : user.id,
        },
        include: {
            product: true,
            shop: true,
        },
    });
    return orders;
});
const deleteMyOrders = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const isOrderExist = yield prisma_1.default.order.findUnique({
        where: { id },
    });
    if (!isOrderExist) {
        throw new AppError_1.AppError(http_status_1.default.NOT_FOUND, "Order is not found");
    }
    const orders = yield prisma_1.default.order.delete({
        where: {
            id,
        },
    });
    return orders;
});
const updateOrderStatus = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isOrderExist = yield prisma_1.default.order.findUnique({
        where: { id },
    });
    if (!isOrderExist) {
        throw new AppError_1.AppError(http_status_1.default.NOT_FOUND, "Order is not found");
    }
    const orders = yield prisma_1.default.order.update({
        where: {
            id,
        },
        data: payload,
    });
    return orders;
});
exports.orderService = {
    createOrder,
    getMyOrders,
    deleteMyOrders,
    getAllOrders,
    updateOrderStatus,
};
