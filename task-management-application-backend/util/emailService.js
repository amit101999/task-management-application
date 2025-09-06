import nodemailer from "nodemailer";
import { google } from "googleapis";
const OAuth2 = google.auth.OAuth2;
import dotenv from "dotenv";
dotenv.config();
console.log("refresh token :", process.env.OAUTH_REFRESH_TOKEN);

const oauth2Client = new OAuth2(
  process.env.OAUTH_CLIENT_ID,
  process.env.OAUTH_CLIENT_SECRET,
  "https://developers.google.com/oauthplayground"
);

oauth2Client.setCredentials({
  refresh_token: process.env.OAUTH_REFRESH_TOKEN,
});

console.log(process.env.OAUTH_REFRESH_TOKEN);

export const sendMail = async ({ email, text }) => {
  const accessToken = await oauth2Client.getAccessToken();

  if (!accessToken?.token) {
    console.error("❌ Access token is undefined");
    throw new Error("OAuth2 token missing");
  }

  console.log("📨 Sending to:", email);

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: "atulthakur10sep@gmail.com", // Must match OAuth user
      clientId: process.env.OAUTH_CLIENT_ID,
      clientSecret: process.env.OAUTH_CLIENT_SECRET,
      refreshToken: process.env.OAUTH_REFRESH_TOKEN,
      accessToken: accessToken.token,
    },
  });

  await transporter.sendMail({
    from: "atulthakur10sep@gmail.com",
    to: email,
    subject: "New Task Assigned",
    text,
  });

  console.log("✅ Email sent");
};
