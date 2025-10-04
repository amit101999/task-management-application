import { google } from "googleapis";
import prisma from "../../config/prisma.config.js";
import jwt from "jsonwebtoken";

const oauth2Client = new google.auth.OAuth2(
  process.env.LOGIN_OAUTH_ID,
  process.env.LOGIN_OAUTH_SCERET_KEY,
  "https://task-management-application-opal.vercel.app"
);

export const googleLogin = async (req, res) => {
  try {
    const code = req.query.code;
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    const auth = google.oauth2({
      auth: oauth2Client,
      version: "v2",
    });

    const data = await auth.userinfo.get();
    const googleUser = data.data;
    // now storing  the user the name and email in the database and

    const User = await prisma.user.findUnique({
      where: {
        email: googleUser.email,
      },
    });
    let newUser = null;
    // if user already present login direclty otherwise create and login
    if (User != null) {
      newUser = User;
      console.log("user alreeady persent :", newUser);
    } else {
      newUser = await prisma.user.create({
        data: {
          name: googleUser.name,
          email: googleUser.email,
        },
      });
    }

    const token = jwt.sign(
      { data: { id: newUser.id, role: newUser.role, name: newUser.name } },
      process.env.JWT_SCREET_KEY,
      {
        expiresIn: "1d",
      }
    );

    // res.cookie("token", token, {
    //   httpOnly: true,
    //   sameSite: "none",
    //   secure: true,
    //   maxAge: 1 * 24 * 60 * 60 * 1000,
    // });
    res
      .status(200)
      .json({ message: "Google Login Success", user: newUser, token: token });
  } catch (err) {
    console.log("errro in google login ", err);
    res.status(500).json({ message: "Error in google login : " + err.message });
  }
};
