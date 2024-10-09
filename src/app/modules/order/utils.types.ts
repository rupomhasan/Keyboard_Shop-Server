import { Types } from "mongoose"





export type TItems = {
  productId: Types.ObjectId,
  quantity: number,
  price?: number,
  total?: number
}


export type TShippedAddress = {
  customerName: string,
  states: string,
  contactNo: string,
  zipCode: string,
  address: string,
  note: string,
}