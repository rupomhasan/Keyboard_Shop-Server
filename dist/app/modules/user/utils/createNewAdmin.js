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
exports.createNewAdminUser = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = require("../../../Error/AppError");
const user_model_1 = require("../user.model");
const uploadUserPhoto_1 = require("./uploadUserPhoto");
const createNewAdminUser = (payload, file) => __awaiter(void 0, void 0, void 0, function* () {
    if (file) {
        payload.photoUrl = yield (0, uploadUserPhoto_1.uploadUserPhoto)(payload.name, file);
    }
    payload.role = "Admin";
    payload.isDeleted = false;
    const newUser = yield user_model_1.User.create(payload);
    if (!newUser) {
        throw new AppError_1.AppError(http_status_1.default.INTERNAL_SERVER_ERROR, "Failed to create the user.");
    }
    return newUser;
});
exports.createNewAdminUser = createNewAdminUser;
