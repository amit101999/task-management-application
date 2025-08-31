import { Worker } from "bullmq";
import { connection } from "./connection.js";
import { sendMail } from "../util/emailService.js";
import dotenv from "dotenv"


const emailWorker = new Worker(
  "email_queue",
  async (job) => {
    console.log("📥 Job received in worker:", job.id);
    const { email, text } = job.data;

    try {
      console.log("📤 Calling sendMail for:", email);
      await sendMail({ email, text });
    } catch (error) {
      console.error("❌ sendMail failed:", error.message);
      throw error; // So it goes to `failed` event
    }
  },
  { connection }
);


emailWorker.on("completed" , (job)=>{
    console.log("email sent successfully")
})

emailWorker.on("failed" , (job,err)=>{
    console.log("email not sent" , err.message)
})