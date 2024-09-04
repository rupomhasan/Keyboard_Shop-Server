/* eslint-disable @typescript-eslint/no-explicit-any */
import bcrypt from "bcryptjs";
import httpStatus from "http-status"
import { AppError } from "../../Error/AppError"
import { User } from "../user/user.model"
import { TLoginUser } from "./auth.interface"
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../../config";
import { TJwtPayload } from "../user/user.interface";

const loginUser = async ({ email, password }: TLoginUser) => {

  const user = await User.findOne({ email: email }).select("+password")


  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, `${email} is not found , No account associated with this email address`)
  }

  const isPasswordMatch = await bcrypt.compare(password, user.password)


  if (!isPasswordMatch) {
    throw new AppError(httpStatus.BAD_REQUEST, "Your password is wrong")
  }

  if (user?.isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, `${email} is deleted`)
  }



  const jwtPayload: TJwtPayload = {
    email: user.email,
    role: user.role
  };

  const accessToken = jwt.sign(jwtPayload, config.jwt_access_secret as string, { expiresIn: config.accessTokenExpiresIn });

  const refreshToken = jwt.sign(jwtPayload, config.jwt_refresh_secret as string, { expiresIn: config.refreshTokenExpiresIn });



  return { accessToken, refreshToken };
}


const refreshToken = async (token: string) => {

  if (!token) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Your not authorized")
  }

  let decoded;
  try {
    decoded = jwt.verify(
      token as string,
      config.jwt_refresh_secret as string,
    ) as JwtPayload;
  } catch (error: any) {
    throw new AppError(httpStatus.UNAUTHORIZED, error.message);
  }
  const { email, role } = decoded;

  console.log(decoded)

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

  const jwtPayload: TJwtPayload = {
    email: user.email,
    role: user.role
  }
  const accessToken = jwt.sign({
    jwtPayload
  }, config.jwt_access_secret as string, { expiresIn: config.accessTokenExpiresIn })


  return accessToken


}

export const authService = {
  loginUser, refreshToken
}