import { Router } from "express";
import { userController } from "./user.controller";
import { fileUploader } from "../../../utils/fileUploader";
import parseRequest from "../../../utils/parseRequest";
import validateRequest from "../../../utils/validateRequest";
import { userValidation } from "./user.validation";
import auth from "../../../utils/auth";
import { Role } from "@prisma/client";

const router = Router();

router.get("/", auth(Role.ADMIN), userController.getAllUser);

router.post(
  "/create-user",
  fileUploader.upload.single("file"),
  parseRequest,
  validateRequest(userValidation.createUser),
  userController.createUser
);

router.patch(
  "/update/:userId",
  auth(Role.ADMIN),
  validateRequest(userValidation.updateUserRoleStatus),
  userController.updateUserRoleStatus
);

export const userRoutes = router;
