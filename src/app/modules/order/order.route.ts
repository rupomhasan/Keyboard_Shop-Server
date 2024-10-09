import { USER_ROLE } from "./../user/utils/user.constant";
import express from "express";
import ValidateRequest from "../../middlewares/validateRequest";
import { orderStatusSchema, OrderValidationSchema } from "./order.validation";
import { orderControllers } from "./order.controller";
import { auth } from "../../middlewares/auth";
const router = express.Router()

router.post("/create-order", auth(USER_ROLE.Admin, USER_ROLE.Customer), ValidateRequest(OrderValidationSchema), orderControllers.createNewOrder)

router.get("/", auth(USER_ROLE.Admin), orderControllers.getAllOrder)


router.get("/:id", orderControllers.getOrderById)

router.get("/my-order", auth(USER_ROLE.Customer), orderControllers.getMyOrder)

router.patch("/cancel-my-order/:id", auth(USER_ROLE.Customer), orderControllers.canceledMyOrder)


router.patch("/:id", auth(USER_ROLE.Admin), ValidateRequest(orderStatusSchema), orderControllers.updateOrderById)

router.delete("/:id", auth(USER_ROLE.Admin), orderControllers.deleteOrderById)


export const OrderRoutes = router;