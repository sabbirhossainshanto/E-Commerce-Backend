import httpStatus from "http-status";
import catchAsync from "../../../utils/catchAsync";
import sendResponse from "../../../utils/sendResponse";
import { wishlistService } from "./wishlist.service";

const addToWishlist = catchAsync(async (req, res) => {
  const result = await wishlistService.addToWishlist(req.user, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Product added to wishlist  successfully",
    data: result,
  });
});
const getMyWishlistProducts = catchAsync(async (req, res) => {
  const result = await wishlistService.getMyWishlistProduct(req.user);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Wishlist Product are retrieved  successfully",
    data: result,
  });
});
const deleteMyWishlistProducts = catchAsync(async (req, res) => {
  const { wishlistId } = req.params;
  const result = await wishlistService.deleteMyWishlistProduct(
    req.user,
    wishlistId
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Wishlist Product is deleted  successfully",
    data: result,
  });
});
const updateWishlistProductQuantity = catchAsync(async (req, res) => {
  const result = await wishlistService.updateWishlistProductQuantity(
    req.user,
    req.body
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Wishlist Product is updated  successfully",
    data: result,
  });
});

export const wishlistController = {
  addToWishlist,
  getMyWishlistProducts,
  deleteMyWishlistProducts,
  updateWishlistProductQuantity,
};
