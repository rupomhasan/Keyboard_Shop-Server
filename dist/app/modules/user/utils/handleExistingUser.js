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
exports.handleExistingUser = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = require("../../../Error/AppError");
const user_model_1 = require("../user.model");
const uploadUserPhoto_1 = require("./uploadUserPhoto");
const handleExistingUser = (user, file, payload) => __awaiter(void 0, void 0, void 0, function* () {
    if (user.role) {
        if (payload.role === user.role) {
            throw new AppError_1.AppError(http_status_1.default.BAD_REQUEST, `This user is already ${user.role}.`);
        }
    }
    if (file) {
        user.photoUrl = yield (0, uploadUserPhoto_1.uploadUserPhoto)(user.name, file);
    }
    user.role = payload.role || "Admin";
    const updatedUser = yield user_model_1.User.findOneAndUpdate({ email: user.email }, { $set: user }, { new: true }).select("-password");
    if (!updatedUser) {
        throw new AppError_1.AppError(http_status_1.default.INTERNAL_SERVER_ERROR, "Failed to update the user.");
    }
    return updatedUser;
});
exports.handleExistingUser = handleExistingUser;
