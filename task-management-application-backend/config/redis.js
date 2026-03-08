import Redis from "ioredis";
const redisUrl = process.env.REDIS_URL || process.env.REDIS_PUBLIC_URL;
const redis = redisUrl ? new Redis(redisUrl) : new Redis({
  host: process.env.REDIS_HOST || '127.0.0.1',
  port: process.env.REDIS_PORT || 6379,
});

redis.on("connect", () => {
  console.log("Connected to Redis server");
});

redis.on("error", (err) => {
  console.error("Redis connection error:", err);
});

export default redis;
