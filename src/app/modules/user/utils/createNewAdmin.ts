/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from "http-status";
import { AppError } from "../../../Error/AppError";
import { TUser } from "../user.interface";
import { User } from "../user.model";
import { uploadUserPhoto } from "./uploadUserPhoto";

export const createNewAdminUser = async (payload: Partial<TUser>, file: any): Promise<TUser> => {
  if (file) {
    payload.photoUrl = await uploadUserPhoto(payload.name as string, file);
  }

  payload.role = "Admin";
  payload.isDeleted = false;

  const newUser = await User.create(payload);

  if (!newUser) {
    throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, "Failed to create the user.");
  }

  return newUser;
};
