import { google } from "googleapis";
import prisma from "../../config/prisma.config.js";
import jwt from "jsonwebtoken";

const oauth2Client = new google.auth.OAuth2(
  process.env.LOGIN_OAUTH_ID,
  process.env.LOGIN_OAUTH_SCERET_KEY,
  "http://localhost:5173"
);

export const googleSignup = async (req, res) => {
  try {
    console.log(req.query);
    const code = req.query.code;
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    const auth = google.oauth2({
      auth: oauth2Client,
      version: "v2",
    });

    const data = await auth.userinfo.get();
    const googleUser = data.data;
    console.log(googleUser);
    // now storing  the user the name and email in the database and

    const User = await prisma.user.findUnique({
      where: {
        email: googleUser.email,
      },
    });

    if (User) {
      return res
        .status(200)
        .json({ message: "User Already Exsist please sign in" });
    }

    const newUser = await prisma.user.create({
      data: {
        name: googleUser.name,
        email: googleUser.email,
      },
    });

    const token = jwt.sign({ data: newUser }, process.env.JWT_SCREET_KEY, {
      expiresIn: "1d",
    });

    // res.cookie("token", token, {
    //   httpOnly: true,
    // });

    res
      .status(200)
      .json({ message: "Google Signup Success", user: newUser, token: token });
  } catch (err) {
    console.log("errro in google login ", err);
    res.status(500).json({ message: "Error in google Signup" });
  }
};
