"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.subscriberRoutes = void 0;
const express_1 = require("express");
const auth_1 = __importDefault(require("../../../utils/auth"));
const client_1 = require("@prisma/client");
const subscriber_controller_1 = require("./subscriber.controller");
const router = (0, express_1.Router)();
router.post("/create-subscriber", subscriber_controller_1.subscriberController.createSubscriber);
router.get("/", (0, auth_1.default)(client_1.Role.ADMIN), subscriber_controller_1.subscriberController.getAllSubscriber);
exports.subscriberRoutes = router;
