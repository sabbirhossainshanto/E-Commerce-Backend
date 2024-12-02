import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });

export default {
  port: process.env.PORT,
  jwt_access_secret: process.env.JWT_ACCESS_SECRET,
  bcrypt_salt_round: process.env.BCRYPT_SALT_ROUND,
};
