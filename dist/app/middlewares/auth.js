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
exports.auth = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const AppError_1 = require("../Error/AppError");
const http_status_1 = __importDefault(require("http-status"));
const config_1 = __importDefault(require("../config"));
const user_model_1 = require("../modules/user/user.model");
const auth = (...requiredRoles) => {
    return (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const token = (_a = req === null || req === void 0 ? void 0 : req.headers) === null || _a === void 0 ? void 0 : _a.authorization;
        if (!token) {
            throw new AppError_1.AppError(http_status_1.default.UNAUTHORIZED, "Your not authorized");
        }
        let decoded;
        try {
            decoded = jsonwebtoken_1.default.verify(token, config_1.default.jwt_access_secret);
        }
        catch (error) {
            throw new AppError_1.AppError(http_status_1.default.UNAUTHORIZED, error.message);
        }
        req.user = decoded;
        const { email, role, exp } = decoded;
        const currentTime = Math.floor(Date.now() / 1000);
        if (exp === undefined) {
            throw new AppError_1.AppError(http_status_1.default.UNAUTHORIZED, "Token does not have an expiration claim");
        }
        if (currentTime >= exp) {
            throw new AppError_1.AppError(http_status_1.default.UNAUTHORIZED, "Token has expired");
        }
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
        if (requiredRoles && !requiredRoles.includes(role)) {
            throw new AppError_1.AppError(http_status_1.default.UNAUTHORIZED, "You are not authorized");
        }
        next();
    }));
};
exports.auth = auth;
