import httpStatus from "http-status";
import catchAsync from "../../../utils/catchAsync";
import sendResponse from "../../../utils/sendResponse";
import { pick } from "../../../utils/pick";
import { subscriberService } from "./subscriber.service";

const createSubscriber = catchAsync(async (req, res) => {
  const result = await subscriberService.createSubscriber(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Subscriber is created successfully",
    data: result,
  });
});
const getAllSubscriber = catchAsync(async (req, res) => {
  const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);
  const { data, meta } = await subscriberService.getAllSubscriber(options);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Subscriber are retrieved  successfully",
    data: data,
    meta,
  });
});

export const subscriberController = {
  createSubscriber,
  getAllSubscriber,
};
