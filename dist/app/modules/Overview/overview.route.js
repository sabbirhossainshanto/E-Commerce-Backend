"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.overviewRoutes = void 0;
const express_1 = require("express");
const auth_1 = __importDefault(require("../../../utils/auth"));
const client_1 = require("@prisma/client");
const overview_controller_1 = require("./overview.controller");
const router = (0, express_1.Router)();
router.get("/", (0, auth_1.default)(client_1.Role.ADMIN), overview_controller_1.overviewController.getOverview);
exports.overviewRoutes = router;
