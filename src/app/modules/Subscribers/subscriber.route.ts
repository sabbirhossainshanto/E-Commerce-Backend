import { Router } from "express";
import auth from "../../../utils/auth";
import { Role } from "@prisma/client";
import { subscriberController } from "./subscriber.controller";

const router = Router();

router.post("/create-subscriber", subscriberController.createSubscriber);

router.get("/", auth(Role.ADMIN), subscriberController.getAllSubscriber);

export const subscriberRoutes = router;
