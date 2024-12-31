import httpStatus from "http-status";
import catchAsync from "../../../utils/catchAsync";
import sendResponse from "../../../utils/sendResponse";
import { overviewService } from "./overview.service";

const getOverview = catchAsync(async (req, res) => {
  const result = await overviewService.getOverview();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Overview are retrieved successfully",
    data: result,
  });
});

export const overviewController = {
  getOverview,
};
