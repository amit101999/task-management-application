import { Queue } from "bullmq";
import { connection } from "./connection.js";

export const queue = new Queue("email_queue" , {connection}) ;