import express from "express";
import ValidateRequest from "../../middlewares/validateRequest";
import { AuthValidation } from "./auth.validation";
import { authControllers } from "./auth.controller";
const router = express.Router()


router.post("/login", ValidateRequest(AuthValidation.loginValidationSchema), authControllers.loginUser)

router.post("/refresh-token", ValidateRequest(AuthValidation.refreshTokenValidationSchema), authControllers.refreshToken)


export const AuthRoutes = router; 