import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join((process.cwd(), ".env")) });

export default {
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
  is_live : process.env.IS_LIVE
};
