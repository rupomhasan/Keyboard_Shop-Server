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
exports.UserService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = require("../../Error/AppError");
const user_model_1 = require("./user.model");
const createCustomerIntoDB = (data) => __awaiter(void 0, void 0, void 0, function* () {
  const isUserExist = yield user_model_1.User.findOne({ email: data.email });
  if (isUserExist) {
    if (isUserExist.isDeleted) {
      throw new AppError_1.AppError(http_status_1.default.FORBIDDEN, "user is deleted");
    }
    throw new AppError_1.AppError(http_status_1.default.BAD_REQUEST, "user already exists");
  }
  data.isDeleted = false;
  const result = yield user_model_1.User.create(data);
  return result;
});
const createAdminIntoDB = (data) => __awaiter(void 0, void 0, void 0, function* () {
  const isUserExist = yield user_model_1.User.findOne({ email: data.email });
  let result;
  if (isUserExist) {
    if (isUserExist.role === "Admin") {
      throw new AppError_1.AppError(http_status_1.default.BAD_REQUEST, "this user is already admin");
    }
    result = yield user_model_1.User.findOneAndUpdate({ email: isUserExist.email }, {
      role: "Admin"
    });
  }
  data.role = "Admin";
  data.isDeleted = false;
  result = yield user_model_1.User.create(data);
  return result;
});
const getUserByIdFromDB = (_id) => __awaiter(void 0, void 0, void 0, function* () {
  const result = yield user_model_1.User.findById(_id);
  if (!result) {
    throw new AppError_1.AppError(http_status_1.default.NOT_FOUND, "no user available with this account");
  }
  return result;
});
const deleteUserByIdFromDB = (_id) => __awaiter(void 0, void 0, void 0, function* () {
  const isUserExist = yield user_model_1.User.findById(_id);
  if (!isUserExist) {
    throw new AppError_1.AppError(http_status_1.default.NOT_FOUND, "user is not found");
  }
  if (isUserExist.isDeleted) {
    throw new AppError_1.AppError(http_status_1.default.BAD_REQUEST, "this user is deleted");
  }
  const result = yield user_model_1.User.findByIdAndUpdate(_id, { isDeleted: true });
  if (!result) {
    throw new AppError_1.AppError(http_status_1.default.BAD_REQUEST, "no user available with this account");
  }
  return result;
});
exports.UserService = {
  createCustomerIntoDB,
  createAdminIntoDB,
  getUserByIdFromDB,
  deleteUserByIdFromDB
};
