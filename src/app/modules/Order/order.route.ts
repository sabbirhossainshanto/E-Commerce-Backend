import { Router } from "express";
import auth from "../../../utils/auth";
import { Role } from "@prisma/client";
import { orderController } from "./order.controller";

const router = Router();

router.post("/create-order", auth(Role.USER), orderController.createOrder);

router.get("/my-order", auth(Role.USER), orderController.getMyOrders);

router.delete(
  "/my-order/:orderId",
  auth(Role.USER),
  orderController.deleteMyOrder
);

export const orderRoutes = router;
