"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.wishlistRoutes = void 0;
const express_1 = require("express");
const auth_1 = __importDefault(require("../../../utils/auth"));
const client_1 = require("@prisma/client");
const validateRequest_1 = __importDefault(require("../../../utils/validateRequest"));
const wishlist_validation_1 = require("./wishlist.validation");
const wishlist_controller_1 = require("./wishlist.controller");
const router = (0, express_1.Router)();
router.post("/add-to-wishlist", (0, auth_1.default)(client_1.Role.USER), (0, validateRequest_1.default)(wishlist_validation_1.wishlistValidation.addToWishlist), wishlist_controller_1.wishlistController.addToWishlist);
router.get("/my-wishlist", (0, auth_1.default)(client_1.Role.USER), wishlist_controller_1.wishlistController.getMyWishlistProducts);
router.delete("/:wishlistId", (0, auth_1.default)(client_1.Role.USER), wishlist_controller_1.wishlistController.deleteMyWishlistProducts);
router.patch("/", (0, auth_1.default)(client_1.Role.USER), wishlist_controller_1.wishlistController.updateWishlistProductQuantity);
exports.wishlistRoutes = router;
