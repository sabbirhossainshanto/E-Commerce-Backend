import prisma from "../../helpers/prisma";
import { AppError } from "../../errors/AppError";
import httpStatus from "http-status";
import { IPaginationOptions } from "../../interfaces/pagination";
import { paginationHelper } from "../../helpers/paginationHelper";

const createSubscriber = async (payload: { email: string }) => {
  const userData = await prisma.subscriber.findUnique({
    where: {
      userEmail: payload.email,
    },
  });
  console.log(userData);
  if (userData) {
    throw new AppError(httpStatus.NOT_FOUND, "You have subscribed already");
  }

  const result = await prisma.subscriber.create({
    data: {
      userEmail: payload?.email,
    },
  });
  return result;
};

const getAllSubscriber = async (options: IPaginationOptions) => {
  const { limit, page, skip } = paginationHelper.calculatePagination(options);
  const result = await prisma.subscriber.findMany({
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? { [options.sortBy]: options.sortOrder }
        : { createdAt: "desc" },
  });
  const total = await prisma.subscriber.count();

  return {
    meta: {
      total,
      page,
      limit,
    },
    data: result,
  };
};

export const subscriberService = {
  createSubscriber,
  getAllSubscriber,
};
