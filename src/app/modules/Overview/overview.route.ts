import { Router } from "express";
import auth from "../../../utils/auth";
import { Role } from "@prisma/client";
import { overviewController } from "./overview.controller";

const router = Router();

router.get("/", auth(Role.ADMIN), overviewController.getOverview);

export const overviewRoutes = router;
