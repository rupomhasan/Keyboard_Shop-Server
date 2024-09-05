/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from "http-status";
import { AppError } from "../../Error/AppError";
import { Products } from "../products/products.model";
import { TOrder, TStatus } from "./order.interface"
import { totalPrice } from "./utils/totalPrice";
import { Order } from "./order.model";
import mongoose from "mongoose";
import { User } from "../user/user.model";
import { JwtPayload } from "jsonwebtoken";
import { sendMail } from "../../utils/sendMail";
import { ObjectId } from "mongodb";




const getAllOrderFormDB = async () => {

  const result = await Order.find({});


  return result;



}

const getMyOrderFromDB = async (user: JwtPayload) => {
  const myOrder = await Order.find({ email: user.email, isDeleted: false })


  return myOrder

}
const createNewOrderIntoDB = async (payload: TOrder, user: JwtPayload) => {
  const { items } = payload;
  const isUserExist = await User.findOne({ email: user.email })

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
    const tran_id = new ObjectId().toString();
    payload.subTotal = total;
    payload.deliveryCharge = 120;
    payload.totalPrice = total + 120;
    // payload.orderStatus = "pending";
    payload.email = user.email
    payload.tranId = tran_id


  
    const order = await Order.create([payload], { session });


    await User.findOneAndUpdate({ email: user.email }, {
      $push: { order: order[0]._id }
    }, {
      session
    })
    sendMail(isUserExist, order[0])

    await session.commitTransaction();
    await session.endSession();
    return order;
  } catch (error: any) {
    await session.abortTransaction();
    console.log(error)
    throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, error);
  }
};

const canceledMyOrderFormDB = async (user: JwtPayload, _id: string) => {

  const myOrder = await Order.findById(_id)

  if (myOrder?.email !== user.email) {
    throw new AppError(httpStatus.BAD_REQUEST, "Your not authorized to cancel this order")
  }
  if (myOrder?.orderStatus !== "pending") {
    throw new AppError(httpStatus.BAD_REQUEST, `Your cann't change this order status ${myOrder?.orderStatus} to canceled`)
  }

  const result = await Order.findByIdAndUpdate(_id, { orderStatus: "canceled" })



  return result


}

const updateOrderStatusFormDB = async (_id: string, status: TStatus) => {
  const myOrder = await Order.findById(_id);
  if (!myOrder) {
    throw new AppError(httpStatus.NOT_FOUND, "This order id does not exist");
  }
  if (myOrder.isDeleted) {
    throw new AppError(httpStatus.NOT_FOUND, "This order is deleted");
  }

  if (myOrder.orderStatus === "canceled") {
    throw new AppError(httpStatus.BAD_REQUEST, "You cannot change the status of a canceled order");
  }
  if (myOrder.orderStatus === status) {
    throw new AppError(httpStatus.BAD_REQUEST, `this order is already ${status}`)
  }

  if (myOrder.orderStatus === "delivered" && (status === "shipped" || status === "pending" || status === "canceled")) {
    throw new AppError(httpStatus.BAD_REQUEST, `You cannot change directly from ${myOrder.orderStatus} to ${status}`);
  }

  if (myOrder.orderStatus === "shipped" && status === "pending") {
    throw new AppError(httpStatus.BAD_REQUEST, `You cannot change directly from ${myOrder.orderStatus} to ${status}`);
  }

  const result = await Order.findByIdAndUpdate(
    _id,
    { orderStatus: status },
    { new: true }
  );

  const user = await User.findOne({ email: myOrder.email });
  if (!user) {
    throw new AppError(httpStatus.BAD_REQUEST, "User not found");
  }

  if (result?.orderStatus === status) {
    try {
      sendMail(user, result);
    } catch (error: any) {
      throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
    }
  }

  return result;
};




const deleteOrderByIdFormDB = async (_id: string) => {
  const order = await Order.findById(_id)

  if (!order) {
    throw new AppError(httpStatus.NOT_FOUND, "This order id is not exist")
  }
  if (order.isDeleted) {
    throw new AppError(httpStatus.NOT_FOUND, "This order is deleted")
  }

  if (order.orderStatus !== "canceled") {
    throw new AppError(httpStatus.BAD_REQUEST, `You can not delete  ${order.orderStatus} status  `)
  }

  const result = await Order.findByIdAndUpdate(_id, {
    isDeleted: true
  }, { new: true })

  return result?.isDeleted
}


export const orderService = {
  getAllOrderFormDB,
  getMyOrderFromDB,
  createNewOrderIntoDB,
  canceledMyOrderFormDB,
  updateOrderStatusFormDB,
  deleteOrderByIdFormDB
}