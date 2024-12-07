"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderRoutes = void 0;
const express_1 = require("express");
const auth_1 = __importDefault(require("../../../utils/auth"));
const client_1 = require("@prisma/client");
const order_controller_1 = require("./order.controller");
const validateRequest_1 = __importDefault(require("../../../utils/validateRequest"));
const order_validation_1 = require("./order.validation");
const router = (0, express_1.Router)();
router.post("/create-order", (0, auth_1.default)(client_1.Role.USER), order_controller_1.orderController.createOrder);
router.get("/my-order", (0, auth_1.default)(client_1.Role.USER), order_controller_1.orderController.getMyOrders);
router.get("/", (0, auth_1.default)(client_1.Role.ADMIN), order_controller_1.orderController.getAllOrders);
router.delete("/my-order/:orderId", (0, auth_1.default)(client_1.Role.USER), order_controller_1.orderController.deleteMyOrder);
router.patch("/:orderId", (0, auth_1.default)(client_1.Role.ADMIN), (0, validateRequest_1.default)(order_validation_1.orderValidation.updateOrder), order_controller_1.orderController.updateOrderStatus);
exports.orderRoutes = router;
