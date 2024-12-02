import bcrypt from "bcrypt";
import { JwtPayload } from "jsonwebtoken";
import httpStatus from "http-status";
import { AppError } from "../../errors/AppError";
import prisma from "../../helpers/prisma";
import { jwtHelper } from "../../helpers/jwtHelper";
import config from "../../config";
import sendEmail from "../../../utils/sendEmail";

const loginUser = async (payload: { email: string; password: string }) => {
  const user = await prisma.user.findUniqueOrThrow({
    where: {
      email: payload.email,
      isDeleted: false,
    },
  });

  const isPasswordMatched = await bcrypt.compare(
    payload.password,
    user.password
  );
  if (!isPasswordMatched) {
    throw new Error("Password incorrect!");
  }
  const accessToken = jwtHelper.generateToken(
    { email: user.email, role: user.role },
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string
  );
  const refreshToken = jwtHelper.generateToken(
    { email: user.email, role: user.role },
    config.jwt_refresh_secret as string,
    config.jwt_refresh_expires_in as string
  );

  return {
    accessToken,
    refreshToken,
  };
};

const refreshToken = async (token: string) => {
  let decodedData;
  try {
    decodedData = jwtHelper.verifyToken(token, "abcdefgh");
  } catch (error) {
    throw new Error("You are not authorized!");
  }
  const user = await prisma.user.findUniqueOrThrow({
    where: {
      email: decodedData.email,
      isDeleted: false,
    },
  });
  const accessToken = jwtHelper.generateToken(
    { email: user.email, role: user.role },
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string
  );

  return accessToken;
};

const changePassword = async (
  user: JwtPayload,
  payload: { oldPassword: string; newPassword: string }
) => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: user.email,
      isDeleted: false,
    },
  });

  const isPasswordMatched = await bcrypt.compare(
    payload.oldPassword,
    userData.password
  );
  if (!isPasswordMatched) {
    throw new Error("Password incorrect!");
  }

  const hashedPassword = await bcrypt.hash(payload.newPassword, 12);

  await prisma.user.update({
    where: {
      email: user.email,
    },
    data: {
      password: hashedPassword,
    },
  });
  return { message: "Password changed successfully!" };
};

const forgotPassword = async (payload: { email: string }) => {
  const user = await prisma.user.findUniqueOrThrow({
    where: {
      email: payload.email,
      isDeleted: false,
    },
  });

  const token = jwtHelper.generateToken(
    { email: user.email, role: user.role },
    config.reset_password_secret as string,
    config.reset_password_expires_in as string
  );

  const link = `${config.client_base_url}/reset-password?email=${user.email}&token=${token}`;
  await sendEmail(
    user.email,
    `
    <a href=${link}>Reset Password</a>
    
    `
  );
};

const resetPassword = async (
  token: string,
  payload: { password: string; email: string }
) => {
  if (!token) {
    throw new AppError(httpStatus.UNAUTHORIZED, "You are not authorized!");
  }
  const verifyToken = jwtHelper.verifyToken(
    token,
    config.reset_password_secret as string
  );
  if (verifyToken && verifyToken.email !== payload.email) {
    throw new AppError(httpStatus.UNAUTHORIZED, "You are not authorized!");
  }
  const user = await prisma.user.findUnique({
    where: {
      email: verifyToken.email,
      isDeleted: false,
    },
  });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found!");
  }

  const hashedPassword = await bcrypt.hash(payload.password, 12);
  await prisma.user.update({
    where: {
      email: verifyToken.email,
      isDeleted: false,
    },
    data: {
      password: hashedPassword,
    },
  });
};

export const authService = {
  loginUser,
  refreshToken,
  changePassword,
  forgotPassword,
  resetPassword,
};
