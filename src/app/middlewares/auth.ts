/* eslint-disable @typescript-eslint/no-explicit-any */
import jwt, { JwtPayload } from "jsonwebtoken";
import { NextFunction, Request, Response } from "express"
import catchAsync from "../utils/catchAsync"
import { AppError } from "../Error/AppError";
import httpStatus from "http-status";
import config from "../config";
import { User } from "../modules/user/user.model";
import { TUserRoll } from "../modules/user/user.interface";

export const auth = (...requiredRoles: TUserRoll[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const token = req?.headers?.authorization;

    if (!token) {
      throw new AppError(httpStatus.UNAUTHORIZED, "Your not authorized")
    }

    let decoded;
    try {
      decoded = jwt.verify(
        token as string,
        config.jwt_access_secret as string,
      ) as JwtPayload;
    } catch (error: any) {
      throw new AppError(httpStatus.UNAUTHORIZED, error.message);
    }
    req.user = decoded;
    const { email, role, exp } = decoded;
    const currentTime = Math.floor(Date.now() / 1000);

    if (exp === undefined) {
      throw new AppError(httpStatus.UNAUTHORIZED, "Token does not have an expiration claim");
    }

    if (currentTime >= exp) {
      throw new AppError(httpStatus.UNAUTHORIZED, "Token has expired");
    }
    const user = await User.findOne({ email })

    if (!user) {
      throw new AppError(httpStatus.NOT_FOUND, "This user is not found")
    }

    if (user.isDeleted) {
      throw new AppError(httpStatus.FORBIDDEN, "This user is deleted")
    }
    if (user.role !== role) {
      throw new AppError(httpStatus.UNAUTHORIZED, "You are not authorized")
    }
    if (requiredRoles && !requiredRoles.includes(role)) {
      throw new AppError(
        httpStatus.UNAUTHORIZED,
        "You are not authorized",
      );
    }

    next();
  })
}