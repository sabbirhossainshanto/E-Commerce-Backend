import { Product } from "@prisma/client";
import { IFile } from "../../interfaces/file";
import prisma from "../../helpers/prisma";
import { AppError } from "../../errors/AppError";
import httpStatus from "http-status";
import { fileUploader } from "../../../utils/fileUploader";

const createProduct = async (file: IFile, payload: Product) => {
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

  if (file) {
    const { secure_url } = await fileUploader.uploadToCloudinary(file);
    payload.images = [secure_url];
  }

  const result = await prisma.product.create({
    data: payload,
  });

  return result;
};

const getAllProduct = async () => {
  return await prisma.product.findMany();
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
  file: IFile,
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

  if (file) {
    const { secure_url } = await fileUploader.uploadToCloudinary(file);
    payload.images = [secure_url];
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
};
