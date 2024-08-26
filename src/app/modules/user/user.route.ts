
import express from "express";
import ValidateRequest from "../../middlewares/validateRequest";

import { UserControllers } from "./user.controllers";
import { UserValidationSchema } from "./user.validation";
import { upload } from "../../utils/sendImageToCloudinary";
const router = express.Router();

router.get("/:id", UserControllers.getSingleUser)


router.post("/signup", upload.single("file"), (req, res, next) => {
  req.body = JSON.parse(req.body.data);
  next()

}, ValidateRequest(UserValidationSchema.CreateUserValidationSchema), UserControllers.createCustomer)


router.patch("/createAdmin", upload.single("file"), (req, res, next) => {
  req.body = JSON.parse(req.body.data);
  next()

}, ValidateRequest(UserValidationSchema.CreateAdminSchema), UserControllers.createAdmin)

router.delete("/:id", UserControllers.deleteSingleUser)


export const UserRoutes = router;