import { Category } from "@prisma/client";
import prisma from "../../helpers/prisma";
import { AppError } from "../../errors/AppError";
import httpStatus from "http-status";

const createCategory = async (payload: Category) => {
  const result = await prisma.category.create({
    data: payload,
  });
  return result;
};
const getAllCategories = async () => {
  const result = await prisma.category.findMany();
  return result;
};
const getSingleCategory = async (id: string) => {
  return await prisma.category.findUnique({
    where: {
      id,
    },
  });
};
const updateSingleCategory = async (id: string, payload: { name: string }) => {
  const category = await prisma.category.findUnique({
    where: {
      id,
    },
  });

  if (!category) {
    throw new AppError(httpStatus.NOT_FOUND, "Category is not found!");
  }
  return await prisma.category.update({
    where: {
      id,
    },
    data: payload,
  });
};

const deleteSingleCategory = async (id: string) => {
  const category = await prisma.category.findUnique({
    where: {
      id,
    },
  });

  if (!category) {
    throw new AppError(httpStatus.NOT_FOUND, "Category is not found!");
  }
  return await prisma.category.delete({
    where: {
      id,
    },
  });
};

export const categoryService = {
  createCategory,
  getAllCategories,
  getSingleCategory,
  updateSingleCategory,
  deleteSingleCategory,
};
