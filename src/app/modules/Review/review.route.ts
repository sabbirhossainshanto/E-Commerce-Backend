import { Router } from "express";
import auth from "../../../utils/auth";
import { Role } from "@prisma/client";
import { reviewController } from "./review.controller";

const router = Router();

router.post(
  "/add-review",
  auth(Role.USER),
  reviewController.addReviewToProduct
);
router.get(
  "/:productId",
  auth(Role.VENDOR),
  reviewController.getSingleProductReview
);

export const reviewRoutes = router;
