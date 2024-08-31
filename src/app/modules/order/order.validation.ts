import mongoose from "mongoose";
import { z } from "zod";

const ItemsSchema = z.object({
  productId: z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
    message: "Invalid productId",
  }),
  quantity: z.number().min(1, "Quantity must be at least 1"),
});

const ShippedAddressSchema = z.object({
  customerName: z.string(),
  states: z.string(),
  contactNo: z.string(),
  zipCode: z.number().min(1000, "Zip code must be at least 4 digits"),
  address: z.string(),
  note: z.string().optional(),
});

const OrderValidationSchema = z.object(
  {
    body: z.object({
      user: z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
        message: "Invalid userId",
      }),
      items: z.array(ItemsSchema),

      shippedAddress: ShippedAddressSchema,
      paymentId: z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
        message: "Invalid paymentIdId",
      }),
    })
  }
);

export { OrderValidationSchema };
