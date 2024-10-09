"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config({ path: path_1.default.join((process.cwd(), ".env")) });
exports.default = {
    port: process.env.PORT,
    database_url: process.env.DATABASE_URL,
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
    bcrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS, jwt_access_secret: process.env.JWT_ACCESS_SECRET,
    jwt_refresh_secret: process.env.JWT_REFRESH_SECRET,
    accessTokenExpiresIn: process.env.JWT_ACCESS_EXPIRESIN,
    refreshTokenExpiresIn: process.env.JWT_REFRESH_EXPIRESIN,
    gmail_passkey: process.env.GMAIL_PASSKEY,
    store_id: process.env.STORE_ID,
    store_pass: process.env.STORE_PASS,
    is_live: process.env.IS_LIVE
};
