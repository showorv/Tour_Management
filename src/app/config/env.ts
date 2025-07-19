import dotenv from "dotenv"

dotenv.config()

export const envVars = {
    PORT : process.env.PORT,
    MONGODB_URI: process.env.MONGODB_URI,
    NODE_ENV: process.env.NODE_ENV,
    JWT_SECRET: process.env.JWT_SECRET,
    JWR_EXPIRED: process.env.JWR_EXPIRED,
    HASH_SALT: process.env.HASH_SALT,
    SUPER_ADMIN_EMAIL: process.env.SUPER_ADMIN_EMAIL,
    SUPER_ADMIN_PASSWORD: process.env.SUPER_ADMIN_PASSWORD ,
    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
    JWT_REFRESH_EXPIRED: process.env.JWT_REFRESH_EXPIRED,
    GOOGLE_CLIENT_ID:process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET:process.env.GOOGLE_CLIENT_SECRET,
    FRONTEND_URL:process.env.FRONTEND_URL,
    EXPRESS_SESSION_SECRET:process.env.EXPRESS_SESSION_SECRET,
    GOOGLE_CALLBACK_URL:process.env.GOOGLE_CALLBACK_URL,

}