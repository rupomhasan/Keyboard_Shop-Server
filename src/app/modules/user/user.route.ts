
import express from "express";
import ValidateRequest from "../../middlewares/validateRequest";

import { UserControllers } from "./user.controllers";
import { UserValidationSchema } from "./user.validation";
const router = express.Router();

router.get("/:id", UserControllers.getSingleUser)


router.post("/signup", ValidateRequest(UserValidationSchema.CreateUserValidationSchema), UserControllers.createCustomer)


router.patch("/createAdmin", ValidateRequest(UserValidationSchema.CreateAdminSchema), UserControllers.createAdmin)

router.delete("/:id", UserControllers.deleteSingleUser)


export const UserRoutes = router;