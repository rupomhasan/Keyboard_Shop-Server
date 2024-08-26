import { NextFunction, Request, Response, Router } from "express";
import ValidateRequest from "../../middlewares/validateRequest";
import { brandValidation } from "./brand.validation";
import { brandControllers } from "./brand.controller";
import { upload } from "../../utils/sendImageToCloudinary";

const router = Router()

router.get("/", brandControllers.AllBrands)
router.get("/:id", brandControllers.getSingleBrand)

router.post("/", upload.single("file"), (req: Request, res: Response, next: NextFunction) => {
  req.body = JSON.parse(req.body.data);
  next();
}, ValidateRequest(brandValidation.createBrandSchema), brandControllers.createBrand)




router.delete("/:id", brandControllers.deleteBrand)


export const brandRoutes = router;