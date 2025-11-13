import Redis from "ioredis";
const redis = new Redis(
  "redis://default:6AQDmLgIT0QEOxvK3LyaGB5znTuscpEQ@redis-12572.crce182.ap-south-1-1.ec2.redns.redis-cloud.com:12572"
);

redis.on("connect", () => {
  console.log("Connected to Redis server");
});

redis.on("error", (err) => {
  console.error("Redis connection error:", err);
});

export default redis;
