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

    // res.cookie("token", token, {
    //   httpOnly: true,
    //   sameSite: "none", // required for cross-origin
    //   secure: false, // because your EC2 is running on plain HTTP
    //   maxAge: 24 * 60 * 60 * 1000,
    // });
    res.status(200).json({
      message: "user created successfully",
      data: newUser,
      token: token,
    });
  } catch (err) {
    console.log(err);
    throw new Error("Error in creating user");
  }
};

export const userLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    // get user without all the relations first
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
      select: {
        id: true,
        name: true,
        password: true,
        role: true,
        avatar: true,
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

    // update last login
    // await prisma.user.update({
    //   where: { id: user.id },
    //   data: { lastLogin: new Date() },
    // });

    // remove password from response
    const userData = {
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
    };

    // create token
    const token = jwt.sign(
      { data: { id: user.id, role: user.role, name: user.name } },
      process.env.JWT_SCREET_KEY,
      {
        expiresIn: "1d",
      }
    );

    res.status(200).json({
      message: "User logged in successfully",
      data: userData,
      token: token,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error in login user" });
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
    const page = req.query.page || 1;
    const limit = req.query.limit || 20;
    const search = req.query.search || "";
    const department = req.query.department || "";

    const skip = (page - 1) * limit;

    // simple where clause
    let whereClause = {};
    if (search) {
      whereClause.OR = [
        { name: { contains: search } },
        { email: { contains: search } },
      ];
    }
    if (department) {
      whereClause.department = department;
    }

    // get users with only needed fields
    const users = await prisma.user.findMany({
      where: whereClause,
      skip: parseInt(skip),
      take: parseInt(limit),
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatar: true,
        phone: true,
        department: true,
        createdAt: true,
        lastLogin: true,
        _count: {
          select: {
            tasks: true,
            projects: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // get total count
    const totalCount = await prisma.user.count({ where: whereClause });

    res.status(200).json({
      message: "All users fetched successfully",
      data: users,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit),
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error in getting all users" });
  }
};

export const getUserByID = async (req, res) => {
  try {
    const id = req.params.id;

    const user = await prisma.user.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatar: true,
        phone: true,
        department: true,
        createdAt: true,
        lastLogin: true,
        // get only recent tasks with basic info
        tasks: {
          select: {
            id: true,
            title: true,
            taskStatus: true,
            dueDate: true,
            priority: true,
            project: {
              select: {
                id: true,
                projectName: true,
              },
            },
          },
          take: 10,
          orderBy: {
            createdAt: "desc",
          },
        },
        // get only recent projects with basic info
        projects: {
          select: {
            id: true,
            projectName: true,
            status: true,
            startDate: true,
            endDate: true,
            _count: {
              select: {
                tasks: true,
              },
            },
          },
          take: 10,
          orderBy: {
            createdAt: "desc",
          },
        },
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
    res.status(500).json({ message: "Error in getting user by id" });
  }
};
