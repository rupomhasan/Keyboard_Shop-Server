import { Types } from "mongoose"





export type TItems = {
  productId: Types.ObjectId,
  quantity: number,
  price: number,
  total: number
}


export type TShippedAddress = {
  customerName: string,
  states: string,
  contactNo: string,
  zipCode: number,
  address: string,
  note: string,
}