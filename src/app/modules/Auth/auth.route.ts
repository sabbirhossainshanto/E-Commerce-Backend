import { Router } from "express";
import { authController } from "./auth.controller";
import auth from "../../../utils/auth";
import { Role } from "@prisma/client";

const router = Router();

router.post("/login", authController.loginUser);
router.post("/refreshToken", authController.refreshToken);
router.post(
  "/change-password",
  auth(Role.ADMIN, Role.VENDOR, Role.USER),
  authController.changePassword
);
router.post("/forgot-password", authController.forgotPassword);
router.post("/reset-password", authController.resetPassword);

export const authRoutes = router;
