import { Redis } from "ioredis";
import dotenv from "dotenv";
dotenv.config();
export const connection = new Redis({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  maxRetriesPerRequest: null,
});
