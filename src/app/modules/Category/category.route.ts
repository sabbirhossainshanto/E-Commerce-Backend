import { Router } from "express";
import auth from "../../../utils/auth";
import { Role } from "@prisma/client";
import validateRequest from "../../../utils/validateRequest";
import { categoryValidation } from "./category.validation";
import { categoryController } from "./category.controller";

const router = Router();

router.post(
  "/create-category",
  auth(Role.ADMIN),
  validateRequest(categoryValidation.createCategory),
  categoryController.createCategory
);

router.get(
  "/",
  auth(Role.ADMIN, Role.VENDOR, Role.USER),
  categoryController.getAllCategories
);

router.get(
  "/:categoryId",
  auth(Role.ADMIN, Role.VENDOR, Role.USER),
  categoryController.getSingleCategory
);
router.patch(
  "/:categoryId",
  auth(Role.ADMIN),
  validateRequest(categoryValidation.updateCategory),
  categoryController.updateSingleCategory
);
router.delete(
  "/:categoryId",
  auth(Role.ADMIN),
  categoryController.deleteSingleCategory
);

export const categoryRoutes = router;
