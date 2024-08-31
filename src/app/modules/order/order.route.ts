import express from "express";
import ValidateRequest from "../../middlewares/validateRequest";
import { OrderValidationSchema } from "./order.validation";
import { orderControllers } from "./order.controller";
const router = express.Router()

router.post("/", ValidateRequest(OrderValidationSchema), orderControllers.createNewOrder)

export const OrderRoutes = router;