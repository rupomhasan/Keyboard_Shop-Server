/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from "http-status";
import { AppError } from "../../Error/AppError";
import { Products } from "../products/products.model";
import { TOrder } from "./order.interface"
import { totalPrice } from "./utils/totalPrice";
import { Order } from "./order.model";
import mongoose from "mongoose";
import { User } from "../user/user.model";


const getAllOrderFormDB = () => {

}

const getMyOrderDB = async () => {

}
const createNewOrderIntoDB = async (payload: TOrder) => {
  const { items, paymentId, user: _id } = payload;

  const isUserExist = await User.findById(_id)

  if (!isUserExist) {
    throw new AppError(httpStatus.BAD_REQUEST, "User is not found ")
  }


  // Fetch the existing products from the database
  const isProductExist = await Products.find({
    _id: { $in: items.map(item => item.productId) }
  });

  // Validate each item against the available products
  for (let i = 0; i < items.length; i++) {
    let productFound = false;

    for (let r = 0; r < isProductExist.length; r++) {
      const isExist = (items[i].productId).toString() === (isProductExist[r]._id).toString();

      if (isExist) {
        productFound = true;

        if (isProductExist[r].availableQuantity === 0) {
          throw new AppError(httpStatus.CONFLICT, `The product '${isProductExist[r].name}' is currently out of stock.`);
        }

        if (isProductExist[r].availableQuantity < items[i].quantity) {
          throw new AppError(httpStatus.CONFLICT, `Insufficient quantity for '${isProductExist[r].name}'. Available: ${isProductExist[r].availableQuantity}, Requested: ${items[i].quantity}.`);
        }

        // Calculate the price and subTotal for the item
        items[i].price = isProductExist[r].price;
        items[i].total = Math.round(isProductExist[r].price * items[i].quantity)

        break;
      }
    }

    if (!productFound) {
      throw new AppError(httpStatus.NOT_FOUND, `Product with ID ${items[i].productId} not found.`);
    }
  }

  const total = totalPrice(items, isProductExist);
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    // Update the product quantities in the database
    for (const item of items) {
      await Products.findOneAndUpdate(
        { _id: item.productId },
        { $inc: { availableQuantity: -item.quantity } },
        { new: true, session }
      );
    }

    payload.subTotal = total;
    payload.deliveryCharge = 120;
    payload.totalPrice = total + 120;

    // Create the order in the database
    const order = await Order.create([payload], { session });

    // const order = orders[0]
    await User.findByIdAndUpdate(_id, {
      $push: { order: order[0]._id }
    }, {
      session
    })


    await session.commitTransaction();
    await session.endSession();
    return order;
  } catch (error: any) {
    await session.abortTransaction();
    console.log(error)
    throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
  }
};

const updateMyOrderFormDB = async () => {


}

const updateOrderByIdFormDB = async () => {

}


export const orderService = {
  getAllOrderFormDB,
  getMyOrderDB,
  createNewOrderIntoDB,
  updateMyOrderFormDB,
  updateOrderByIdFormDB
}