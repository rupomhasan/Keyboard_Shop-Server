import mongoose, { Types, Schema } from "mongoose";
import { TUser } from "./user.interface";

const UserSchema = new Schema<TUser>({
  name: {
    type: String,
  },
  email: {
    type: String,
    unique: true,
  },
  password: {
    type: String,
  },
  order: [{
    type: Types.ObjectId,
    ref: ""
  }],
  photoUrl: {
    type: String,
  },
  role: {
    type: String,
    enum: ["Admin", "Customer"]
  },
  isDeleted: {
    type: Boolean,
  }


}, {
  timestamps: true
});


export const User = mongoose.model("user", UserSchema); 