import httpStatus from "http-status";
import catchAsync from "../../../utils/catchAsync";
import sendResponse from "../../../utils/sendResponse";
import { reviewService } from "./review.service";

const addReviewToProduct = catchAsync(async (req, res) => {
  const result = await reviewService.addReviewToProduct(req.user, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Review created successfully",
    data: result,
  });
});
const getSingleProductReview = catchAsync(async (req, res) => {
  const { productId } = req.params;
  const result = await reviewService.getSingleProductReview(productId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Review are retrieved successfully",
    data: result,
  });
});

export const reviewController = {
  addReviewToProduct,
  getSingleProductReview,
};
