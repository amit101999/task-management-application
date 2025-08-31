import { Redis} from "ioredis"
import dotenv from "dotenv"
dotenv.config({path : "../.env"})
console.log("hello :" ,process.env.REDIS_HOST)
export const connection = new Redis ({
    host:process.env.REDIS_HOST,
    port:process.env.REDIS_PORT,
     maxRetriesPerRequest: null
})

