import { Router } from "express";
import { UserRoutes } from "../modules/user/user.route";
import { brandRoutes } from "../modules/brand/brand.route";




export const router = Router();


const moduleRoutes = [
  {
    path: "/user",
    route: UserRoutes,
  },
  {
    path: "/brand",
    route: brandRoutes
  }
];


moduleRoutes.forEach((moduleRoute) =>
  router.use(moduleRoute.path, moduleRoute.route),
);
