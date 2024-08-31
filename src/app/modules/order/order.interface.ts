import { Types } from "mongoose"
import { TItems, TShippedAddress } from "./utils.types"



export type TOrder = {
  user: Types.ObjectId,
  items: TItems[],
  deliveryCharge: 120 | 50,
  orderStatus: "pending" | "shipped" | "delivered" | "canceled",
  subTotal: number,
  totalPrice: number,
  shippedAddress: TShippedAddress,
  paymentId: Types.ObjectId,
}