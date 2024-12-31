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
exports.subscriberService = void 0;
const prisma_1 = __importDefault(require("../../helpers/prisma"));
const AppError_1 = require("../../errors/AppError");
const http_status_1 = __importDefault(require("http-status"));
const paginationHelper_1 = require("../../helpers/paginationHelper");
const createSubscriber = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = yield prisma_1.default.subscriber.findUnique({
        where: {
            userEmail: payload.email,
        },
    });
    console.log(userData);
    if (userData) {
        throw new AppError_1.AppError(http_status_1.default.NOT_FOUND, "You have subscribed already");
    }
    const result = yield prisma_1.default.subscriber.create({
        data: {
            userEmail: payload === null || payload === void 0 ? void 0 : payload.email,
        },
    });
    return result;
});
const getAllSubscriber = (options) => __awaiter(void 0, void 0, void 0, function* () {
    const { limit, page, skip } = paginationHelper_1.paginationHelper.calculatePagination(options);
    const result = yield prisma_1.default.subscriber.findMany({
        skip,
        take: limit,
        orderBy: options.sortBy && options.sortOrder
            ? { [options.sortBy]: options.sortOrder }
            : { createdAt: "desc" },
    });
    const total = yield prisma_1.default.subscriber.count();
    return {
        meta: {
            total,
            page,
            limit,
        },
        data: result,
    };
});
exports.subscriberService = {
    createSubscriber,
    getAllSubscriber,
};
