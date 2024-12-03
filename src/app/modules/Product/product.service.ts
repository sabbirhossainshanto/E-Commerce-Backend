import { Product } from "@prisma/client";
import prisma from "../../helpers/prisma";
import { AppError } from "../../errors/AppError";
import httpStatus from "http-status";
import { fileUploader } from "../../../utils/fileUploader";
import { IUser } from "../User/user.interface";

const createProduct = async (
  files: Express.Multer.File[],
  payload: Product
) => {
  const category = await prisma.category.findUnique({
    where: {
      id: payload.categoryId,
    },
  });
  if (!category) {
    throw new AppError(httpStatus.NOT_FOUND, "Category is not found");
  }
  const shop = await prisma.shop.findUnique({
    where: {
      id: payload.shopId,
    },
  });
  if (!shop) {
    throw new AppError(httpStatus.NOT_FOUND, "Shop is not found");
  }

  if (files?.length > 0) {
    const imageUrls = await fileUploader.uploadMultipleToCloudinary(files);
    payload.images = imageUrls;
  }

  const result = await prisma.product.create({
    data: payload,
  });

  return result;
};

const getAllProduct = async () => {
  return await prisma.product.findMany();
};
const getMyProducts = async (user: IUser) => {
  const userData = await prisma.user.findUnique({
    where: {
      email: user.email,
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
    throw new AppError(httpStatus.NOT_FOUND, "Shop is not found");
  }

  const product = await prisma.product.findMany({
    where: {
      shopId: shop.id,
    },
    include: {
      category: true,
      shop: true,
      reviews: true,
    },
  });
  return product;
};
const getSingleProduct = async (id: string) => {
  const product = await prisma.product.findUnique({
    where: {
      id,
    },
  });
  if (!product) {
    throw new AppError(httpStatus.NOT_FOUND, "Product is not found");
  }
  return product;
};

const updateSingleProduct = async (
  id: string,
  files: Express.Multer.File[],
  payload: Partial<Product>
) => {
  const product = await prisma.product.findUnique({
    where: {
      id: id,
    },
  });
  if (!product) {
    throw new AppError(httpStatus.NOT_FOUND, "Product is not found");
  }

  if (files?.length > 0) {
    const imageUrl = await fileUploader.uploadMultipleToCloudinary(files);
    payload.images = imageUrl;
  }

  const result = await prisma.product.update({
    where: {
      id,
    },
    data: payload,
  });

  return result;
};
const deleteSingleProduct = async (id: string) => {
  const product = await prisma.product.findUnique({
    where: {
      id: id,
    },
  });
  if (!product) {
    throw new AppError(httpStatus.NOT_FOUND, "Product is not found");
  }

  const result = await prisma.product.delete({
    where: {
      id,
    },
  });

  return result;
};

export const productService = {
  createProduct,
  getAllProduct,
  getSingleProduct,
  updateSingleProduct,
  deleteSingleProduct,
  getMyProducts,
};
