/* eslint-disable @typescript-eslint/no-explicit-any */

import express from "express";
import ValidateRequest from "../../middlewares/validateRequest";

import { UserControllers } from "./user.controllers";
import { UserValidationSchema } from "./user.validation";
import { upload } from "../../utils/sendImageToCloudinary";
import { auth } from "../../middlewares/auth";
import { USER_ROLE } from "./utils/user.constant";
import { AppError } from "../../Error/AppError";
import httpStatus from "http-status";
const router = express.Router();

router.get("/", auth(USER_ROLE.Admin), UserControllers.getAllUser)

router.get("/myProfile", auth(USER_ROLE.Admin, USER_ROLE.Customer), UserControllers.myProfile)

router.get("/:id", auth(USER_ROLE.Admin), UserControllers.getSingleUser)

router.post(
  "/signup",
  upload.single("file"),
  (req, res, next) => {
    try {
      req.body = JSON.parse(req.body.data);
      next();
    } catch (error: any) {
      throw new AppError(httpStatus.NOT_FOUND, error.message)
    }
  },
  ValidateRequest(UserValidationSchema.CreateUserValidationSchema),
  UserControllers.createCustomer
);

router.patch("/createAdmin", auth(USER_ROLE.Admin), upload.single("file"), (req, res, next) => {
  req.body = JSON.parse(req.body.data);
  next()

}, ValidateRequest(UserValidationSchema.CreateAdminSchema), UserControllers.createAdmin)

router.delete("/:id", auth(USER_ROLE.Admin), UserControllers.deleteSingleUser)


export const UserRoutes = router;