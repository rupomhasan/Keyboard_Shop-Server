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
exports.authService = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = require("../../Error/AppError");
const user_model_1 = require("../user/user.model");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../../config"));
const loginUser = (_a) => __awaiter(void 0, [_a], void 0, function* ({ email, password }) {
    const user = yield user_model_1.User.findOne({ email: email }, { new: true }).select("+password role isDeleted");
    if (!user) {
        throw new AppError_1.AppError(http_status_1.default.NOT_FOUND, `${email} is not found , No account associated with this email address`);
    }
    const isPasswordMatch = yield bcryptjs_1.default.compare(password, user.password);
    if (!isPasswordMatch) {
        throw new AppError_1.AppError(http_status_1.default.BAD_REQUEST, "Your password is wrong");
    }
    if (user.isDeleted) {
        throw new AppError_1.AppError(http_status_1.default.FORBIDDEN, "You are blocked by Admin");
    }
    const jwtPayload = {
        email,
        role: user.role
    };
    const accessToken = jsonwebtoken_1.default.sign(jwtPayload, config_1.default.jwt_access_secret, { expiresIn: config_1.default.accessTokenExpiresIn });
    const refreshToken = jsonwebtoken_1.default.sign(jwtPayload, config_1.default.jwt_refresh_secret, { expiresIn: config_1.default.refreshTokenExpiresIn });
    return { accessToken, refreshToken };
});
const refreshToken = (token) => __awaiter(void 0, void 0, void 0, function* () {
    if (!token) {
        throw new AppError_1.AppError(http_status_1.default.UNAUTHORIZED, "Your not authorized");
    }
    let decoded;
    try {
        decoded = jsonwebtoken_1.default.verify(token, config_1.default.jwt_refresh_secret);
    }
    catch (error) {
        throw new AppError_1.AppError(http_status_1.default.UNAUTHORIZED, error.message);
    }
    const { email, role } = decoded;
    const user = yield user_model_1.User.findOne({ email });
    if (!user) {
        throw new AppError_1.AppError(http_status_1.default.NOT_FOUND, "This user is not found");
    }
    if (user.isDeleted) {
        throw new AppError_1.AppError(http_status_1.default.FORBIDDEN, "This user is deleted");
    }
    if (user.role !== role) {
        throw new AppError_1.AppError(http_status_1.default.UNAUTHORIZED, "You are not authorized");
    }
    const jwtPayload = {
        email: user.email,
        role: user.role
    };
    const accessToken = jsonwebtoken_1.default.sign({
        jwtPayload
    }, config_1.default.jwt_access_secret, { expiresIn: config_1.default.accessTokenExpiresIn });
    return accessToken;
});
exports.authService = {
    loginUser, refreshToken
};
