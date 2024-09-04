import { TOrder } from "../modules/order/order.interface";
import { TUser } from "../modules/user/user.interface";



export const generateMailContent = (user: TUser, order: TOrder) => {
  let subject = "";
  let message = "";


  switch (order.orderStatus) {

  case "pending":
    subject = "Order Received - Pending Confirmation";
    message = `Dear ${user.name},\n\nThank you for placing an order with us! Your order is currently pending confirmation. The total amount is ${order.totalPrice} Taka.\n\nWe will notify you once your order is processed.\n\nBest regards,\nTechWorld`;
    break;


  case "shipped":
    subject = "Your #Order  is on the Way!";
    message = `Dear ${user.name},\n\nGreat news! Your order has been shipped. You can expect delivery within the next few days.\n\nThank you for shopping with us!\n\nBest regards,\nTechWorld`;
    break;

  case "delivered":
    subject = "Order Delivered Successfully!";
    message = `Dear ${user.name},\n\nWe're happy to inform you that your order has been delivered successfully to ${order.shippedAddress}.\n\nWe hope you enjoy your purchase! If you have any questions or concerns, please don't hesitate to contact us.\n\nThank you for choosing us!\n\nBest regards,\nTechWorld`;
    break;

  case "canceled":
    subject = "Order Has Been Canceled";
    message = `Dear ${user.name},\n\nWe regret to inform you that your order with ID has been canceled.\n\nIf you have any questions, feel free to contact our support team.\n\nWe apologize for any inconvenience caused.\n\nBest regards,\nYour Company Name`;
    break;

  default:
    subject = "Update on Your Order";
    message = `Dear ${user.name},\n\nThis is to inform you that your order has been updated to the orderStatus: ${order.orderStatus}.\n\nThank you for your understanding.\n\nBest regards,\nTechWorld`;
  }
  return {
    subject, message
  }
};

