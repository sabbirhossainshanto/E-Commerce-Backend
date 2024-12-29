import { Wishlist } from "@prisma/client";
import { IUser } from "../User/user.interface";
import prisma from "../../helpers/prisma";
import { AppError } from "../../errors/AppError";
import httpStatus from "http-status";
import { IUpdateWishlistProduct } from "./wishlist.interface";

const addToWishlist = async (user: IUser, payload: Wishlist) => {
  const userData = await prisma.user.findUnique({
    where: {
      email: user.email,
    },
  });

  if (!userData) {
    throw new AppError(httpStatus.NOT_FOUND, "user is not found");
  }

  const product = await prisma.product.findUnique({
    where: {
      id: payload.productId,
    },
  });

  if (!product) {
    throw new AppError(httpStatus.NOT_FOUND, "Product is not found");
  }

  if (product.inventory === 0 || product.inventory < payload.quantity) {
    throw new AppError(httpStatus.NOT_FOUND, "insufficient  product quantity");
  }

  const isAddedToWishlist = await prisma.wishlist.findUnique({
    where: {
      productId: payload?.productId,
    },
  });
  if (isAddedToWishlist) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "This product is already in your Wishlist"
    );
  }

  payload.userId = user?.id;

  const result = await prisma.wishlist.create({
    data: payload,
    include: {
      product: {
        include: {
          shop: true,
        },
      },
    },
  });

  return result;
};

const getMyWishlistProduct = async (user: IUser) => {
  const WishlistProduct = await prisma.wishlist.findMany({
    where: {
      userId: user?.id,
    },
    include: {
      product: true,
      user: true,
    },
  });

  return WishlistProduct;
};

const deleteMyWishlistProduct = async (user: IUser, id: string) => {
  const WishlistProduct = await prisma.wishlist.findUnique({
    where: {
      userId: user?.id,
      id,
    },
  });

  if (!WishlistProduct) {
    throw new AppError(httpStatus.NOT_FOUND, "Wishlist product is not found!");
  }

  const result = await prisma.wishlist.delete({
    where: {
      userId: user?.id,
      id,
    },
  });

  return result;
};

const updateWishlistProductQuantity = async (
  user: IUser,
  payload: IUpdateWishlistProduct
) => {
  const WishlistProduct = await prisma.wishlist.findUnique({
    where: {
      userId: user?.id,
      id: payload.productId,
    },
  });

  if (!WishlistProduct) {
    throw new AppError(httpStatus.NOT_FOUND, "Wishlist product is not found!");
  }

  const result = await prisma.wishlist.update({
    where: {
      userId: user?.id,
      id: payload.productId,
    },
    data: {
      quantity: {
        [payload.type]: payload.quantity,
      },
    },
  });

  return result;
};

export const wishlistService = {
  addToWishlist,
  getMyWishlistProduct,
  deleteMyWishlistProduct,
  updateWishlistProductQuantity,
};
