
import nodemailer from "nodemailer"
import { TUser } from "../modules/user/user.interface";
import { TOrder } from "../modules/order/order.interface";
import { generateMailContent } from "./generateMailContent";
import config from "../config";
export const sendMail = async (user: TUser, order: TOrder) => {


  const mailContent = generateMailContent(user, order)

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // Use `true` for port 465, `false` for all other ports
    auth: {
      user: "rupom.hasan607299@gmail.com",
      pass: config.gmail_passkey,
    },
  });

  await transporter.sendMail({
    from: "rupom.hasan607299@gmail.com",
    to: user.email, // list of receivers
    subject: `${mailContent.subject} ✔`, // Subject line
    text: mailContent.message, // plain text body
  })


}