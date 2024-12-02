import { Shop, UserStatus } from "@prisma/client";
import prisma from "../../helpers/prisma";
import { AppError } from "../../errors/AppError";
import httpStatus from "http-status";
import { IFile } from "../../interfaces/file";
import { fileUploader } from "../../../utils/fileUploader";
import { IUser } from "../User/user.interface";

const createShop = async (file: Express.Multer.File, payload: Shop) => {
  const user = await prisma.user.findUnique({
    where: {
      id: payload.userId,
      isDeleted: false,
      status: UserStatus.ACTIVE,
    },
  });
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User is not found");
  }
  const shop = await prisma.shop.findUnique({
    where: {
      userId: payload.userId,
    },
  });
  if (shop) {
    throw new AppError(httpStatus.BAD_REQUEST, "Already you have a shop");
  }

  if (file) {
    const { secure_url } = await fileUploader.uploadToCloudinary(file);
    payload.shopLogo = secure_url;
  }

  const result = await prisma.shop.create({
    data: payload,
  });
  return result;
};

const getAllShop = async () => {
  return await prisma.shop.findMany();
};

const getMyShop = async (user: IUser) => {
  const userData = await prisma.user.findUnique({
    where: {
      email: user.email,
    },
  });

  const shop = await prisma.shop.findUnique({
    where: {
      userId: userData?.id,
    },
  });

  return shop;
};

const updateMyShop = async (
  user: IUser,
  file: Express.Multer.File,
  payload: Partial<Shop>
) => {
  const userData = await prisma.user.findUnique({
    where: {
      email: user.email,
      isDeleted: false,
      status: UserStatus.ACTIVE,
    },
  });

  if (!userData) {
    throw new AppError(httpStatus.NOT_FOUND, "User is not found");
  }
  const shop = await prisma.shop.findUnique({
    where: {
      userId: userData?.id,
    },
  });
  if (!shop) {
    throw new AppError(httpStatus.BAD_REQUEST, "Shop is not found");
  }

  if (file) {
    const { secure_url } = await fileUploader.uploadToCloudinary(file);
    payload.shopLogo = secure_url;
  }

  const result = await prisma.shop.update({
    where: {
      userId: userData?.id,
    },
    data: payload,
  });
  return result;
};

const deleteMyShop = async (user: IUser) => {
  const userData = await prisma.user.findUnique({
    where: {
      email: user.email,
      isDeleted: false,
      status: UserStatus.ACTIVE,
    },
  });

  if (!userData) {
    throw new AppError(httpStatus.NOT_FOUND, "User is not found");
  }
  const shop = await prisma.shop.findUnique({
    where: {
      userId: userData?.id,
    },
  });
  if (!shop) {
    throw new AppError(httpStatus.BAD_REQUEST, "Shop is not found");
  }

  const result = await prisma.shop.delete({
    where: {
      userId: userData?.id,
    },
  });
  return result;
};

export const shopService = {
  createShop,
  getAllShop,
  getMyShop,
  updateMyShop,
  deleteMyShop,
};
