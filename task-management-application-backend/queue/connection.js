import { Redis } from "ioredis";
import dotenv from "dotenv";
dotenv.config();
const redisUrl = process.env.REDIS_URL || process.env.REDIS_PUBLIC_URL;
export const connection = redisUrl ? new Redis(redisUrl, { maxRetriesPerRequest: null }) : new Redis({
  host: process.env.REDIS_HOST || '127.0.0.1',
  port: process.env.REDIS_PORT || 6379,
  maxRetriesPerRequest: null,
});
