import "dotenv/config";

export const MONGODB_SERVER = process.env.MONGODB_SERVER || "";
export const MONGODB_USER = process.env.MONGODB_USER || "";
export const MONGODB_PASSWORD = process.env.MONGODB_PASSWORD || "";
export const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || "";
export const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || "";
