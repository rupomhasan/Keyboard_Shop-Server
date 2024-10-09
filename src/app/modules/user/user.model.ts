import mongoose, { Types, Schema } from "mongoose";
import { TUser } from "./user.interface";
import bcrypt from "bcryptjs"
import config from "../../config";
import { Order } from "../order/order.model";
const UserSchema = new Schema<TUser>({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    select: false

  },
  order: [{
    type: Types.ObjectId,
    ref: Order
  }],
  photoUrl: {
    type: String,
  },
  role: {
    type: String,
    enum: ["Admin", "Customer"],
    default: "Customer"
  },
  isDeleted: {
    type: Boolean,
  }


}, {
  timestamps: true
});



UserSchema.pre("save", async function (next) {
  this.password = await bcrypt.hash(this.password, Number(config.bcrypt_salt_rounds))
  next()
})



export const User = mongoose.model("User", UserSchema); 