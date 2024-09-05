import { TItems, TShippedAddress } from "./utils.types"

export type TStatus = "pending" | "shipped" | "delivered" | "canceled"

export type TOrder = {
  // _id?: Types.ObjectId,
  items: TItems[],
  email: string,
  deliveryCharge: 120 | 50,
  orderStatus: TStatus,
  subTotal?: number,
  totalPrice?: number,
  shippedAddress: TShippedAddress,
  tranId?: string,
  paidStatus?: boolean,
  isDeleted?: boolean
}