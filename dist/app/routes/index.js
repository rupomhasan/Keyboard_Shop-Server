"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const user_route_1 = require("../modules/user/user.route");
const brand_route_1 = require("../modules/brand/brand.route");
const products_route_1 = require("../modules/products/products.route");
const order_route_1 = require("../modules/order/order.route");
const auth_route_1 = require("../modules/auth/auth.route");
const review_route_1 = require("../modules/review/review.route");
exports.router = (0, express_1.Router)();
const moduleRoutes = [
    {
        path: "/user",
        route: user_route_1.UserRoutes,
    },
    {
        path: "/brand",
        route: brand_route_1.brandRoutes
    },
    {
        path: "/products",
        route: products_route_1.ProductsRoutes
    },
    {
        path: "/orders",
        route: order_route_1.OrderRoutes
    },
    {
        path: "/auth",
        route: auth_route_1.AuthRoutes
    },
    {
        path: "/reviews",
        route: review_route_1.ReviewRoutes
    },
];
moduleRoutes.forEach((moduleRoute) => exports.router.use(moduleRoute.path, moduleRoute.route));
