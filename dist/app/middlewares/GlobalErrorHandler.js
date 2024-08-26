"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
  return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GlobalErrorHandler = void 0;
/* eslint-disable @typescript-eslint/no-unused-vars */
const zod_1 = require("zod");
const handleCastError_1 = __importDefault(require("../Error/handleCastError"));
const AppError_1 = require("../Error/AppError");
const handleZodError_1 = __importDefault(require("../Error/handleZodError"));
const handleValidationError_1 = __importDefault(require("../Error/handleValidationError"));
const handleDuplicateError_1 = __importDefault(require("../Error/handleDuplicateError"));
const GlobalErrorHandler = (err, req, res, next) => {
  let statusCode = 500;
  let message = "Something went wrong";
  let errorSources = [
    {
      path: "",
      message: "Something went wrong",
    }
  ];
  if (err instanceof zod_1.ZodError) {
    const simplifiedError = (0, handleZodError_1.default)(err);
    statusCode = simplifiedError === null || simplifiedError === void 0 ? void 0 : simplifiedError.statusCode;
    message = simplifiedError === null || simplifiedError === void 0 ? void 0 : simplifiedError.message;
    errorSources = simplifiedError === null || simplifiedError === void 0 ? void 0 : simplifiedError.errorSources;
  }
  else if ((err === null || err === void 0 ? void 0 : err.name) === "ValidationError") {
    const simplifiedError = (0, handleValidationError_1.default)(err);
    statusCode = simplifiedError === null || simplifiedError === void 0 ? void 0 : simplifiedError.statusCode;
    message = simplifiedError === null || simplifiedError === void 0 ? void 0 : simplifiedError.message;
    errorSources = simplifiedError === null || simplifiedError === void 0 ? void 0 : simplifiedError.errorSources;
  }
  else if ((err === null || err === void 0 ? void 0 : err.name) === "CastError") {
    const simplifiedError = (0, handleCastError_1.default)(err);
    statusCode = simplifiedError === null || simplifiedError === void 0 ? void 0 : simplifiedError.statusCode;
    message = simplifiedError === null || simplifiedError === void 0 ? void 0 : simplifiedError.message;
    errorSources = simplifiedError === null || simplifiedError === void 0 ? void 0 : simplifiedError.errorSources;
  }
  else if ((err === null || err === void 0 ? void 0 : err.code) === 11000) {
    const simplifiedError = (0, handleDuplicateError_1.default)(err);
    statusCode = simplifiedError === null || simplifiedError === void 0 ? void 0 : simplifiedError.statusCode;
    message = simplifiedError === null || simplifiedError === void 0 ? void 0 : simplifiedError.message;
    errorSources = simplifiedError === null || simplifiedError === void 0 ? void 0 : simplifiedError.errorSources;
  }
  else if (err instanceof AppError_1.AppError) {
    statusCode = err === null || err === void 0 ? void 0 : err.statusCode;
    message = err.message;
    errorSources = [
      {
        path: "",
        message: err === null || err === void 0 ? void 0 : err.message,
      },
    ];
  }
  else if (err instanceof Error) {
    message = err.message;
    errorSources = [
      {
        path: "",
        message: err === null || err === void 0 ? void 0 : err.message,
      },
    ];
  }
  //ultimate return
  return res.status(statusCode).json({
    success: false,
    message,
    errorSources,
    err,
  });
};
exports.GlobalErrorHandler = GlobalErrorHandler;
