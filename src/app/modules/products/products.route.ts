import express from "express";
import { productsControllers } from "./products.controllers";
import ValidateRequest from "../../middlewares/validateRequest";

import { auth } from "../../middlewares/auth";
import { USER_ROLE } from "../user/utils/user.constant";
import { createProductValidation, updateProductValidation } from "./products.validation";
const router = express.Router();



router.get("/", productsControllers.getAllProducts)

router.get("/:id", productsControllers.getSingleProduct)


router.post("/", auth(USER_ROLE.Admin), ValidateRequest(createProductValidation), productsControllers.crateNewProducts)

router.patch("/:id",  auth(USER_ROLE.Admin), ValidateRequest(updateProductValidation), productsControllers.updateProducts)

router.delete("/:id", auth(USER_ROLE.Admin), productsControllers.deleteProduct)


export const ProductsRoutes = router; 