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
    SUPER_ADMIN_PASSWORD: process.env.SUPER_ADMIN_PASSWORD 
}