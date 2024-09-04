import { ObjectId } from "mongoose";
import { USER_ROLE } from "./utils/user.constant";
export type TJwtPayload = {
  email: string,
  role: "Admin" | "Customer"
}
export type TUser = {
  name: string,
  email: string,
  password: string,
  role: "Admin" | "Customer"
  order?: ObjectId[],
  photoUrl?: string,
  isDeleted?: boolean
}

export type TUserRoll = keyof typeof USER_ROLE