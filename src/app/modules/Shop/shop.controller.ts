import httpStatus from "http-status";
import catchAsync from "../../../utils/catchAsync";
import sendResponse from "../../../utils/sendResponse";
import { shopService } from "./shop.service";
import { IFile } from "../../interfaces/file";

const createShop = catchAsync(async (req, res) => {
  const result = await shopService.createShop(req.file as IFile, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Shop is created successfully",
    data: result,
  });
});
const getAllShop = catchAsync(async (req, res) => {
  const result = await shopService.getAllShop();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Shops are retrieved created successfully",
    data: result,
  });
});
const getMyShop = catchAsync(async (req, res) => {
  const result = await shopService.getMyShop(req.user);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Shops is retrieved successfully",
    data: result,
  });
});

const updateMyShop = catchAsync(async (req, res) => {
  const result = await shopService.updateMyShop(
    req.user,
    req.file as IFile,
    req.body
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Shops is updated successfully",
    data: result,
  });
});
const deleteMyShop = catchAsync(async (req, res) => {
  const result = await shopService.deleteMyShop(req.user);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Shops is deleted successfully",
    data: result,
  });
});

export const shopController = {
  createShop,
  getAllShop,
  getMyShop,
  updateMyShop,
  deleteMyShop,
};
