"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const user_route_1 = require("../modules/user/user.route");
const brand_route_1 = require("../modules/brand/brand.route");
exports.router = (0, express_1.Router)();
const moduleRoutes = [
  {
    path: "/user",
    route: user_route_1.UserRoutes,
  },
  {
    path: "/brand",
    route: brand_route_1.brandRoutes
  }
];
moduleRoutes.forEach((moduleRoute) => exports.router.use(moduleRoute.path, moduleRoute.route));
