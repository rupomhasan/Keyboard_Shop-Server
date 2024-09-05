"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
exports.app = (0, express_1.default)();
const cors_1 = __importDefault(require("cors"));
const routes_1 = require("./app/routes");
const NotFoundRoute_1 = require("./app/middlewares/NotFoundRoute");
const GlobalErrorHandler_1 = require("./app/middlewares/GlobalErrorHandler");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
exports.app.use(express_1.default.json());
exports.app.use((0, cookie_parser_1.default)());
exports.app.use((0, cors_1.default)());
exports.app.get("/", (req, res) => {
    res.send("Welcome to Assignment-4");
});
exports.app.use("/api", routes_1.router);
exports.app.use(GlobalErrorHandler_1.GlobalErrorHandler);
exports.app.use(NotFoundRoute_1.NotFoundRoute);
