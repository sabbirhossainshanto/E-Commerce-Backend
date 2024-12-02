import { Router } from "express";
import { authRoutes } from "../modules/Auth/auth.route";
import { userRoutes } from "../modules/User/user.route";

const router = Router();

const moduleRoutes = [
  {
    path: "/auth",
    route: authRoutes,
  },
  {
    path: "/users",
    route: userRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
