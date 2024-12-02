import httpStatus from "http-status";
import catchAsync from "../../../utils/catchAsync";
import sendResponse from "../../../utils/sendResponse";
import { productService } from "./product.service";
import { IFile } from "../../interfaces/file";

const createProduct = catchAsync(async (req, res) => {
  const result = await productService.createProduct(
    req.file as IFile,
    req.body
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Product created successfully",
    data: result,
  });
});
const getAllProduct = catchAsync(async (req, res) => {
  const result = await productService.getAllProduct();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Product are retrieved successfully",
    data: result,
  });
});
const getSingleProduct = catchAsync(async (req, res) => {
  const { productId } = req.params;
  const result = await productService.getSingleProduct(productId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Product id retrieved successfully",
    data: result,
  });
});
const updateSingleProduct = catchAsync(async (req, res) => {
  const { productId } = req.params;
  const result = await productService.updateSingleProduct(
    productId,
    req.file as IFile,
    req.body
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Product is updated successfully",
    data: result,
  });
});
const deleteSingleProduct = catchAsync(async (req, res) => {
  const { productId } = req.params;
  const result = await productService.deleteSingleProduct(productId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Product is deleted successfully",
    data: result,
  });
});

export const productController = {
  createProduct,
  getAllProduct,
  getSingleProduct,
  updateSingleProduct,
  deleteSingleProduct,
};
