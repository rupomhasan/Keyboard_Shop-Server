import { ObjectId } from "mongoose";

export type TUser = {
  name: string,
  email: string,
  password: string,
  role: "Admin" | "Customer"
  order?: ObjectId[],
  photoUrl?: string,
  isDeleted?: boolean
}