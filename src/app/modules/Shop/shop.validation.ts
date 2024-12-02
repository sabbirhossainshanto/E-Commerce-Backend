import { z } from "zod";

const createShop = z.object({
  body: z.object({
    shopName: z.string({ required_error: "Shop name is required" }),
    shopDetails: z
      .string({ required_error: "Shop details is required" })
      .optional(),
    userId: z.string({ required_error: "User id is required" }),
  }),
});
const updateShop = z.object({
  body: z.object({
    shopName: z.string({ required_error: "Shop name is required" }).optional(),
    shopDetails: z
      .string({ required_error: "Shop details is required" })
      .optional(),
  }),
});

export const shopValidation = {
  createShop,
  updateShop,
};
