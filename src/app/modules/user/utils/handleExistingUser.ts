/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from "http-status";
import { AppError } from "../../../Error/AppError";
import { TUser } from "../user.interface";
import { User } from "../user.model";
import { uploadUserPhoto } from "./uploadUserPhoto";

export const handleExistingUser = async (user: TUser, file: any, payload: Partial<TUser>): Promise<TUser> => {

  if (user.role) {
    if (payload.role === user.role) {
      throw new AppError(httpStatus.BAD_REQUEST, `This user is already ${user.role}.`);
    }
  }
  if (file) {
    user.photoUrl = await uploadUserPhoto(user.name, file);
  }

  user.role = payload.role || "Admin";

  const updatedUser = await User.findOneAndUpdate(
    { email: user.email },
    { $set: user },
    { new: true }
  ).select("-password");

  if (!updatedUser) {
    throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, "Failed to update the user.");
  }

  return updatedUser;
};
