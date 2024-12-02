import { Router } from "express";
import { userController } from "./user.controller";
import { fileUploader } from "../../../utils/fileUploader";
import parseRequest from "../../../utils/parseRequest";
import validateRequest from "../../../utils/validateRequest";
import { userValidation } from "./user.validation";

const router = Router();

router.post(
  "/create-user",
  fileUploader.upload.single("file"),
  parseRequest,
  validateRequest(userValidation.createUser),
  userController.createUser
);

export const userRoutes = router;
