import { User, UserStatus } from "@prisma/client";
import { IFile } from "../../interfaces/file";
import { fileUploader } from "../../../utils/fileUploader";
import bcrypt from "bcrypt";
import prisma from "../../helpers/prisma";
import config from "../../config";
import { AppError } from "../../errors/AppError";
import httpStatus from "http-status";
import { IUserRoleStatus } from "./user.interface";

const createUser = async (file: IFile, payload: User, password: string) => {
  if (file) {
    const { secure_url } = await fileUploader.uploadToCloudinary(file);
    payload.profilePhoto = secure_url;
  }
  const hashedPassword = await bcrypt.hash(
    password,
    Number(config.bcrypt_salt_round)
  );
  const userData: User = {
    ...payload,
    password: hashedPassword,
  };
  const result = await prisma.user.create({
    data: userData,
  });
  return result;
};

const updateUserRoleStatus = async (id: string, payload: IUserRoleStatus) => {
  const user = await prisma.user.findUnique({
    where: {
      id,
      isDeleted: false,
      status: UserStatus.ACTIVE,
    },
  });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User is not found!");
  }

  const result = await prisma.user.update({
    where: {
      id: user.id,
    },
    data: payload,
  });

  return result;
};

const getAllUser = async () => {
  const result = await prisma.user.findMany();
  return result;
};

export const userService = {
  createUser,
  updateUserRoleStatus,
  getAllUser,
};
