import { NextFunction, Request, Response, Router } from "express";
import ValidateRequest from "../../middlewares/validateRequest";
import { brandValidation } from "./brand.validation";
import { brandControllers } from "./brand.controller";
import { upload } from "../../utils/sendImageToCloudinary";
import { auth } from "../../middlewares/auth";
import { USER_ROLE } from "../user/utils/user.constant";

const router = Router()

router.get("/", brandControllers.AllBrands)
router.get("/:id", brandControllers.getSingleBrand)

router.post("/", auth(USER_ROLE.Admin), upload.single("file"), (req: Request, res: Response, next: NextFunction) => {
  req.body = JSON.parse(req.body.data);
  next();
}, ValidateRequest(brandValidation.createBrandSchema), brandControllers.createBrand)
router.delete("/:id", auth(USER_ROLE.Admin), brandControllers.deleteBrand)


export const brandRoutes = router;