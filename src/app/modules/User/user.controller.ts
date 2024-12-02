import httpStatus from "http-status";
import catchAsync from "../../../utils/catchAsync";
import sendResponse from "../../../utils/sendResponse";
import { userService } from "./user.service";
import { IFile } from "../../interfaces/file";

const createUser = catchAsync(async (req, res) => {
  const { password, user } = req.body;
  const result = await userService.createUser(
    req.file as IFile,
    user,
    password
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User created successfully",
    data: result,
  });
});

const updateUserRoleStatus = catchAsync(async (req, res) => {
  const { userId } = req.params;
  const result = await userService.updateUserRoleStatus(userId, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User updated successfully",
    data: result,
  });
});
const getAllUser = catchAsync(async (req, res) => {
  const result = await userService.getAllUser();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Users are retrieved successfully",
    data: result,
  });
});

export const userController = {
  createUser,
  updateUserRoleStatus,
  getAllUser,
};
