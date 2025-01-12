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
exports.overviewService = void 0;
const client_1 = require("@prisma/client");
const prisma_1 = __importDefault(require("../../helpers/prisma"));
const getOverview = () => __awaiter(void 0, void 0, void 0, function* () {
    const monthNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ];
    const totalUser = yield prisma_1.default.user.count();
    const activeUser = yield prisma_1.default.user.count({
        where: {
            status: client_1.UserStatus.ACTIVE,
        },
    });
    const blockedUser = yield prisma_1.default.user.count({
        where: {
            status: client_1.UserStatus.BLOCKED,
        },
    });
    const totalShop = yield prisma_1.default.shop.count();
    const activeShop = yield prisma_1.default.shop.count({
        where: {
            status: client_1.ShopStatus.ACTIVE,
        },
    });
    const blockedShop = yield prisma_1.default.shop.count({
        where: {
            status: client_1.ShopStatus.BLOCKED,
        },
    });
    const totalOrder = yield prisma_1.default.order.count();
    // Orders grouped by month
    const ordersByMonth = yield prisma_1.default.order.groupBy({
        by: ["createdAt"],
        _sum: {
            discountedPrice: true,
        },
        _count: {
            id: true,
        },
        orderBy: {
            createdAt: "asc",
        },
    });
    // Users grouped by month
    const usersByMonth = yield prisma_1.default.user.groupBy({
        by: ["createdAt"],
        _count: {
            id: true,
        },
        where: {
            role: "USER",
        },
        orderBy: {
            createdAt: "asc",
        },
    });
    // Vendors grouped by month
    const vendorsByMonth = yield prisma_1.default.user.groupBy({
        by: ["createdAt"],
        _count: {
            id: true,
        },
        where: {
            role: "VENDOR",
        },
        orderBy: {
            createdAt: "asc",
        },
    });
    // Initialize stats for all months
    const monthlyStats = monthNames.map((name) => ({
        month: name,
        orderCount: 0,
        totalMoney: 0,
        totalUsers: 0,
        totalVendors: 0,
    }));
    // Aggregate order data into monthlyStats
    ordersByMonth.forEach((order) => {
        const orderMonth = order.createdAt.getMonth(); // 0-indexed
        monthlyStats[orderMonth].orderCount += order._count.id;
        monthlyStats[orderMonth].totalMoney += order._sum.discountedPrice || 0;
    });
    // Aggregate user data into monthlyStats
    usersByMonth.forEach((user) => {
        const userMonth = user.createdAt.getMonth(); // 0-indexed
        monthlyStats[userMonth].totalUsers += user._count.id;
    });
    // Aggregate vendor data into monthlyStats
    vendorsByMonth.forEach((vendor) => {
        const vendorMonth = vendor.createdAt.getMonth(); // 0-indexed
        monthlyStats[vendorMonth].totalVendors += vendor._count.id;
    });
    return {
        totalUser,
        activeUser,
        blockedUser,
        totalShop,
        activeShop,
        blockedShop,
        totalOrder,
        monthlyStats,
    };
});
exports.overviewService = {
    getOverview,
};
