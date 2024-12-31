"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.wishlistValidation = void 0;
const zod_1 = require("zod");
const addToWishlist = zod_1.z.object({
    body: zod_1.z.object({
        quantity: zod_1.z.number({ required_error: "quantity is required" }),
        productId: zod_1.z.string({ required_error: "Product id is required" }),
    }),
});
exports.wishlistValidation = {
    addToWishlist,
};
