"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const generateMailContent_1 = require("./generateMailContent");
const config_1 = __importDefault(require("../config"));
const sendMail = (user, order) => __awaiter(void 0, void 0, void 0, function* () {
    const mailContent = (0, generateMailContent_1.generateMailContent)(user, order);
    const transporter = nodemailer_1.default.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // Use `true` for port 465, `false` for all other ports
        auth: {
            user: "rupom.hasan607299@gmail.com",
            pass: config_1.default.gmail_passkey,
        },
    });
    yield transporter.sendMail({
        from: "rupom.hasan607299@gmail.com",
        to: user.email, // list of receivers
        subject: `${mailContent.subject} ✔`, // Subject line
        text: mailContent.message, // plain text body
    });
});
exports.sendMail = sendMail;
