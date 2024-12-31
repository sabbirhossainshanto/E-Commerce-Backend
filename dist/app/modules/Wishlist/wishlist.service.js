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
exports.wishlistService = void 0;
const prisma_1 = __importDefault(require("../../helpers/prisma"));
const AppError_1 = require("../../errors/AppError");
const http_status_1 = __importDefault(require("http-status"));
const addToWishlist = (user, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = yield prisma_1.default.user.findUnique({
        where: {
            email: user.email,
        },
    });
    if (!userData) {
        throw new AppError_1.AppError(http_status_1.default.NOT_FOUND, "user is not found");
    }
    const product = yield prisma_1.default.product.findUnique({
        where: {
            id: payload.productId,
        },
    });
    if (!product) {
        throw new AppError_1.AppError(http_status_1.default.NOT_FOUND, "Product is not found");
    }
    if (product.inventory === 0 || product.inventory < payload.quantity) {
        throw new AppError_1.AppError(http_status_1.default.NOT_FOUND, "insufficient  product quantity");
    }
    const isAddedToWishlist = yield prisma_1.default.wishlist.findUnique({
        where: {
            productId: payload === null || payload === void 0 ? void 0 : payload.productId,
        },
    });
    if (isAddedToWishlist) {
        throw new AppError_1.AppError(http_status_1.default.BAD_REQUEST, "This product is already in your Wishlist");
    }
    payload.userId = user === null || user === void 0 ? void 0 : user.id;
    const result = yield prisma_1.default.wishlist.create({
        data: payload,
        include: {
            product: {
                include: {
                    shop: true,
                },
            },
        },
    });
    return result;
});
const getMyWishlistProduct = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const WishlistProduct = yield prisma_1.default.wishlist.findMany({
        where: {
            userId: user === null || user === void 0 ? void 0 : user.id,
        },
        include: {
            product: true,
            user: true,
        },
    });
    return WishlistProduct;
});
const deleteMyWishlistProduct = (user, id) => __awaiter(void 0, void 0, void 0, function* () {
    const WishlistProduct = yield prisma_1.default.wishlist.findUnique({
        where: {
            userId: user === null || user === void 0 ? void 0 : user.id,
            id,
        },
    });
    if (!WishlistProduct) {
        throw new AppError_1.AppError(http_status_1.default.NOT_FOUND, "Wishlist product is not found!");
    }
    const result = yield prisma_1.default.wishlist.delete({
        where: {
            userId: user === null || user === void 0 ? void 0 : user.id,
            id,
        },
    });
    return result;
});
const updateWishlistProductQuantity = (user, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const WishlistProduct = yield prisma_1.default.wishlist.findUnique({
        where: {
            userId: user === null || user === void 0 ? void 0 : user.id,
            id: payload.productId,
        },
    });
    if (!WishlistProduct) {
        throw new AppError_1.AppError(http_status_1.default.NOT_FOUND, "Wishlist product is not found!");
    }
    const result = yield prisma_1.default.wishlist.update({
        where: {
            userId: user === null || user === void 0 ? void 0 : user.id,
            id: payload.productId,
        },
        data: {
            quantity: {
                [payload.type]: payload.quantity,
            },
        },
    });
    return result;
});
exports.wishlistService = {
    addToWishlist,
    getMyWishlistProduct,
    deleteMyWishlistProduct,
    updateWishlistProductQuantity,
};
