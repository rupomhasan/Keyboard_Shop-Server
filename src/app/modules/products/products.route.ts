import express, { NextFunction, Request, Response } from "express";
import { productsControllers } from "./products.controllers";
import { upload } from "../../utils/sendImageToCloudinary";
import ValidateRequest from "../../middlewares/validateRequest";
import { ProductsValidations } from "./products.validation";
const router = express.Router();



router.get("/", productsControllers.getAllProducts)

router.get("/:id", productsControllers.getSingleProduct)


router.post("/", upload.single("file"), (req: Request, res: Response, next: NextFunction) => {

  req.body = JSON.parse(req.body.data)
  next()
}, ValidateRequest(ProductsValidations.createProductValidation), productsControllers.crateNewProducts)

router.patch("/:id", upload.single("file"), (req: Request, res: Response, next: NextFunction) => {
  req.body = JSON.parse(req.body.data)
  next()
}, ValidateRequest(ProductsValidations.updateProductValidation), productsControllers.updateProducts)

router.delete("/:id", productsControllers.deleteProduct)


export const ProductsRoutes = router; 