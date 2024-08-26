import mongoose, { Schema } from "mongoose";
import { TBrand } from "./brand.interface";

const brandSchema = new Schema<TBrand>({

  brandName: {
    type: String,
    required: true
  },
  logo: {
    type: String,
  }
})




export const Brand = mongoose.model("brand", brandSchema)