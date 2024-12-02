import { Router } from "express";
import { authRoutes } from "../modules/Auth/auth.route";
import { userRoutes } from "../modules/User/user.route";
import { categoryRoutes } from "../modules/Category/category.route";
import { shopRoutes } from "../modules/Shop/shop.route";

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
  {
    path: "/categories",
    route: categoryRoutes,
  },
  {
    path: "/shops",
    route: shopRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
