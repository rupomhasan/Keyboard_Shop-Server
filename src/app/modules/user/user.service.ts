import jwt, { JwtPayload } from "jsonwebtoken";
/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from "http-status";
import { AppError } from "../../Error/AppError";
import { TJwtPayload, TUser } from "./user.interface"
import { User } from "./user.model"
import { sendImageToCloudinary } from "../../utils/sendImageToCloudinary";
import { handleExistingUser } from "./utils/handleExistingUser";
import { createNewAdminUser } from "./utils/createNewAdmin";
;
import config from "../../config";


const myProfile = async (user: JwtPayload) => {

  const myData = await User.findOne({ email: user.email }).populate("order")

  if (!myData) {
    throw new AppError(httpStatus.NOT_FOUND, "Your not authorized your")
  }
  if (myData.isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, "Your  nor authorized")
  }

  return myData

}


const createCustomerIntoDB = async (file: any, payload: TUser) => {
  const isUserExist = await User.findOne({ email: payload.email });

  if (isUserExist) {
    if (isUserExist.isDeleted) {
      throw new AppError(httpStatus.FORBIDDEN, "user is deleted");
    }

    throw new AppError(httpStatus.BAD_REQUEST, "user already exists");
  }

  if (file) {
    const { secure_url } = await sendImageToCloudinary(payload.name, file?.path);
    payload.photoUrl = secure_url
  }


  payload.isDeleted = false
  const result = (await User.create(payload));
  result.password = ""

  const jwtPayload: TJwtPayload = {
    email: result.email,
    role: result.role
  };

  const accessToken = jwt.sign(jwtPayload, config.jwt_access_secret as string, { expiresIn: config.accessTokenExpiresIn });

  const refreshToken = jwt.sign(jwtPayload, config.jwt_refresh_secret as string, { expiresIn: config.refreshTokenExpiresIn });




  return { result, accessToken, refreshToken };
};

const createOrUpdateAdminInDB = async (file: any, payload: Partial<TUser>): Promise<TUser> => {
  const existingUser = await User.findOne({ email: payload.email });

  if (existingUser) {
    return await handleExistingUser(existingUser, file, payload);
  } else {
    return await createNewAdminUser(payload, file);
  }
};
const getUserByIdFromDB = async (_id: string) => {

  const result = await User.findById(_id).select("-password");
  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, "no user available with this account")
  }
  return result
}
const deleteUserByIdFromDB = async (_id: string) => {


  const isUserExist = await User.findById(_id);

  if (!isUserExist) {
    throw new AppError(httpStatus.NOT_FOUND, "user is not found")
  }

  if (isUserExist.isDeleted) {
    throw new AppError(httpStatus.BAD_REQUEST, "this user is deleted")
  }


  const result = await User.findByIdAndUpdate(_id, { isDeleted: true });
  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, "no user available with this account")
  }
  return result
}
export const UserService = {
  myProfile,
  createCustomerIntoDB,
  createOrUpdateAdminInDB,
  getUserByIdFromDB,
  deleteUserByIdFromDB
} 