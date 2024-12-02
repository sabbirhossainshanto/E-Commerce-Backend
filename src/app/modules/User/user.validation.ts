import { z } from "zod";

const createUser = z.object({
  body: z.object({
    password: z.string({ required_error: "Password id required" }),
    user: z.object({
      name: z.string({ required_error: "Name is required" }),
      email: z.string({ required_error: "Email is required" }).email(),
    }),
  }),
});

export const userValidation = {
  createUser,
};
