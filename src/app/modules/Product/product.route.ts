import { Router } from "express";
import auth from "../../../utils/auth";
import { Role } from "@prisma/client";
import { productController } from "./product.controller";
import { fileUploader } from "../../../utils/fileUploader";
import parseRequest from "../../../utils/parseRequest";
import validateRequest from "../../../utils/validateRequest";
import { productValidation } from "./product.validation";

const router = Router();

router.post(
  "/create-product",
  auth(Role.VENDOR),
  fileUploader.upload.single("file"),
  parseRequest,
  validateRequest(productValidation.createProduct),
  productController.createProduct
);

router.get("/", productController.getAllProduct);
router.get("/:productId", productController.getSingleProduct);

router.patch(
  "/:productId",
  auth(Role.VENDOR),
  fileUploader.upload.single("file"),
  parseRequest,
  validateRequest(productValidation.updateProduct),
  productController.updateSingleProduct
);
router.delete(
  "/:productId",
  auth(Role.VENDOR),
  productController.deleteSingleProduct
);

export const productRoute = router;
