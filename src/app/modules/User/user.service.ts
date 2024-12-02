import { User } from "@prisma/client";
import { IFile } from "../../interfaces/file";
import { fileUploader } from "../../../utils/fileUploader";
import bcrypt from "bcrypt";
import prisma from "../../helpers/prisma";
import config from "../../config";

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

export const userService = {
  createUser,
};
