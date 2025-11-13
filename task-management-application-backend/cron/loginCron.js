import axios from "axios";
import cron from "node-cron";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Configuration
const SERVER_URL = process.env.SERVER_URL || "http://localhost:6500";
const LOGIN_EMAIL = process.env.CRON_LOGIN_EMAIL || "sakshi@gmail.com";
const LOGIN_PASSWORD = process.env.CRON_LOGIN_PASSWORD || "sakshi";
const LOGIN_ENDPOINT = `${SERVER_URL}/api/user/login`;

// Function to make login request
const makeLoginRequest = async () => {
  try {
    console.log(`[${new Date().toISOString()}] Making login request...`);
    
    const response = await axios.post(LOGIN_ENDPOINT, {
      email: LOGIN_EMAIL,
      password: LOGIN_PASSWORD,
    });

    if (response.status === 200) {
      console.log(`[${new Date().toISOString()}] ✅ Login successful`);
      console.log(`[${new Date().toISOString()}] User: ${response.data.data?.name || "Unknown"}`);
    } else {
      console.log(`[${new Date().toISOString()}] ⚠️  Login returned status: ${response.status}`);
    }
  } catch (error) {
    if (error.response) {
      console.error(`[${new Date().toISOString()}] ❌ Login failed: ${error.response.data?.message || error.message}`);
      console.error(`[${new Date().toISOString()}] Status: ${error.response.status}`);
    } else if (error.request) {
      console.error(`[${new Date().toISOString()}] ❌ No response from server. Is the server running?`);
    } else {
      console.error(`[${new Date().toISOString()}] ❌ Error: ${error.message}`);
    }
  }
};

// Schedule cron job to run every 5 minutes
// Cron format: '*/5 * * * *' means every 5 minutes
console.log("🚀 Starting login cron job...");
console.log(`📅 Schedule: Every 5 minutes`);
console.log(`🌐 Server URL: ${SERVER_URL}`);
console.log(`📧 Login Email: ${LOGIN_EMAIL}`);
console.log("");

// Run immediately on start
makeLoginRequest();

// Schedule to run every 5 minutes
cron.schedule("*/5 * * * *", () => {
  makeLoginRequest();
});

console.log("✅ Cron job scheduled successfully!");
console.log("Press Ctrl+C to stop the cron job.\n");

