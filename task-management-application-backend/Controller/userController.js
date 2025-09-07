import prisma from "../config/prisma.config.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const createUser = async (req, res) => {
  let { name, email, password } = req.body;
  // default role is ADMIN if not provided
  const path = req.file?.path;
  try {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (user) {
      return res.status(400).json({
        message: "user already exist",
      });
    }

    // creating hashed password
    const hashpassword = await bcrypt.hash(password, 2);

    const newUser = await prisma.user.create({
      data: { name, email, password: hashpassword, avatar: path },
    });

    // creating jsonwebtoken
    const token = jwt.sign(
      { data: { id: newUser.id, role: newUser.role, name: newUser.name } },
      process.env.JWT_SCREET_KEY,
      {
        expiresIn: "1d",
      }
    );

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "none", // required for cross-origin
      secure: false, // because your EC2 is running on plain HTTP
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.status(200).json({
      message: "user created successfully",
      data: newUser,
    });
  } catch (err) {
    console.log(err);
    throw new Error("Error in creating user");
  }
};

export const userLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
      include: {
        tasks: {
          include: {
            project: {
              select: {
                projectName: true,
              },
            },
          },
        },
        projects: {
          include: {
            tasks: true,
          },
        },
      },
    });
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    // creating jsonwebtoken
    const token = jwt.sign(
      { data: { id: user.id, role: user.role, name: user.name } },
      process.env.JWT_SCREET_KEY,
      {
        expiresIn: "1d",
      }
    );

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "none", // required for cross-origin
      secure: false, // because your EC2 is running on plain HTTP
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      message: "User logged in successfully",
      data: user,
    });
  } catch (err) {
    console.log(err);
    throw new Error("Error in login user");
  }
};

export const userLogout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      sameSite: "None",
    });
    console.log("logout Success");
    res.status(200).json({ message: " logout success" });
  } catch (err) {
    console.log("error in logout  :", err);
    res.status(500).json({
      message: "Error logging out user",
    });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      include: {
        tasks: true,
        projects: true,
      },
    });
    res.status(200).json({
      message: "All users fetched successfully",
      data: users,
    });
  } catch (err) {
    console.log(err);
    throw new Error("Error in getting all users");
  }
};

export const getUserByID = async (req, res) => {
  try {
    const id = req.params.id;

    const user = await prisma.user.findUnique({
      where: {
        id,
      },
      include: {
        tasks: true,
        projects: true,
      },
    });
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }
    res.status(200).json({
      message: "User fetched successfully",
      data: user,
    });
  } catch (err) {
    console.log(err);
    throw new Error("Error in getting user by id");
  }
};
