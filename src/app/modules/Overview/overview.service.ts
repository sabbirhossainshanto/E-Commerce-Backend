import { ShopStatus, UserStatus } from "@prisma/client";
import prisma from "../../helpers/prisma";
import { IUser } from "../User/user.interface";

const getOverview = async () => {
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const totalUser = await prisma.user.count();
  const activeUser = await prisma.user.count({
    where: {
      status: UserStatus.ACTIVE,
    },
  });
  const blockedUser = await prisma.user.count({
    where: {
      status: UserStatus.BLOCKED,
    },
  });
  const totalShop = await prisma.shop.count();
  const activeShop = await prisma.shop.count({
    where: {
      status: ShopStatus.ACTIVE,
    },
  });
  const blockedShop = await prisma.shop.count({
    where: {
      status: ShopStatus.BLOCKED,
    },
  });
  const totalOrder = await prisma.order.count();

  // Orders grouped by month
  const ordersByMonth = await prisma.order.groupBy({
    by: ["createdAt"],
    _sum: {
      discountedPrice: true,
    },
    _count: {
      id: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  // Users grouped by month
  const usersByMonth = await prisma.user.groupBy({
    by: ["createdAt"],
    _count: {
      id: true,
    },
    where: {
      role: "USER",
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  // Vendors grouped by month
  const vendorsByMonth = await prisma.user.groupBy({
    by: ["createdAt"],
    _count: {
      id: true,
    },
    where: {
      role: "VENDOR",
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  // Initialize stats for all months
  const monthlyStats = monthNames.map((name) => ({
    month: name,
    orderCount: 0,
    totalMoney: 0,
    totalUsers: 0,
    totalVendors: 0,
  }));

  // Aggregate order data into monthlyStats
  ordersByMonth.forEach((order) => {
    const orderMonth = order.createdAt.getMonth(); // 0-indexed
    monthlyStats[orderMonth].orderCount += order._count.id;
    monthlyStats[orderMonth].totalMoney += order._sum.discountedPrice || 0;
  });

  // Aggregate user data into monthlyStats
  usersByMonth.forEach((user) => {
    const userMonth = user.createdAt.getMonth(); // 0-indexed
    monthlyStats[userMonth].totalUsers += user._count.id;
  });

  // Aggregate vendor data into monthlyStats
  vendorsByMonth.forEach((vendor) => {
    const vendorMonth = vendor.createdAt.getMonth(); // 0-indexed
    monthlyStats[vendorMonth].totalVendors += vendor._count.id;
  });

  return {
    totalUser,
    activeUser,
    blockedUser,
    totalShop,
    activeShop,
    blockedShop,
    totalOrder,
    monthlyStats,
  };
};

export const overviewService = {
  getOverview,
};
