import express, { NextFunction, Request, Response } from "express";
import { productsControllers } from "./products.controllers";
import { upload } from "../../utils/sendImageToCloudinary";
import ValidateRequest from "../../middlewares/validateRequest";
import { ProductsValidations } from "./products.validation";
import { auth } from "../../middlewares/auth";
import { USER_ROLE } from "../user/utils/user.constant";
const router = express.Router();



router.get("/", productsControllers.getAllProducts)

router.get("/:id", productsControllers.getSingleProduct)


router.post("/", auth(USER_ROLE.Admin), upload.single("file"), (req: Request, res: Response, next: NextFunction) => {

  req.body = JSON.parse(req.body.data)
  next()
}, ValidateRequest(ProductsValidations.createProductValidation), productsControllers.crateNewProducts)

router.patch("/:id", auth(USER_ROLE.Admin), upload.single("file"), (req: Request, res: Response, next: NextFunction) => {
  req.body = JSON.parse(req.body.data)
  next()
}, ValidateRequest(ProductsValidations.updateProductValidation), productsControllers.updateProducts)

router.delete("/:id", auth(USER_ROLE.Admin), productsControllers.deleteProduct)


export const ProductsRoutes = router; 