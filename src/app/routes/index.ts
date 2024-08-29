import { Router } from "express";
import { UserRoutes } from "../modules/user/user.route";
import { brandRoutes } from "../modules/brand/brand.route";
import { ProductsRoutes } from "../modules/products/products.route";




export const router = Router();


const moduleRoutes = [
  {
    path: "/user",
    route: UserRoutes,
  },
  {
    path: "/brand",
    route: brandRoutes
  },
  {
    path: "/products",
    route: ProductsRoutes
  }
];


moduleRoutes.forEach((moduleRoute) =>
  router.use(moduleRoute.path, moduleRoute.route),
);
