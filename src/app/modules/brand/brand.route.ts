import { Router } from "express";
import ValidateRequest from "../../middlewares/validateRequest";
import { brandValidation } from "./brand.validation";
import { brandControllers } from "./brand.controller";

const router = Router()

router.get("/", brandControllers.AllBrands)
router.get("/:id", brandControllers.getSingleBrand)

router.post("/", ValidateRequest(brandValidation.createBrandSchema), brandControllers.createBrand)




router.delete("/:id", brandControllers.deleteBrand)


export const brandRoutes = router;