import mongoose, { Schema } from "mongoose";
import { TOrder } from "./order.interface";
import { TItems, TShippedAddress } from "./utils.types";
import { OrderStatus } from "./order.constant";

const ItemsSchema = new Schema<TItems>({
  productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  total: { type: Number, required: true }
});

const ShippedAddressSchema = new Schema<TShippedAddress>({
  customerName: { type: String, required: true },
  states: { type: String, required: true },
  contactNo: { type: String, required: true },
  zipCode: { type: Number, required: true },
  address: { type: String, required: true },
  note: { type: String, required: false }
});

const OrderSchema = new Schema<TOrder>({
  email: { type: String },
  items: { type: [ItemsSchema], required: true },
  subTotal: { type: Number },
  totalPrice: { type: Number },
  shippedAddress: { type: ShippedAddressSchema, required: true },
  paymentId: { type: Schema.Types.ObjectId, ref: "paymentId", required: true },
  deliveryCharge: { type: Number },
  orderStatus: { type: String, enum: OrderStatus, default: "pending" },
  isDeleted: { type: Boolean, default: false }
});




export const Order = mongoose.model("Order", OrderSchema)