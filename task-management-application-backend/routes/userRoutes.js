import express from "express"
import { createUser, getAllUsers, getUserByID, userLogin, userLogout } from "../Controller/userController.js"
import { userAuth } from "../midleware/userAuth.js";
import upload from "../config/cloudinary.js"
import { googleSignup } from "../login services/googleLogin/signup.js"
import { googleLogin } from "../login services/googleLogin/login.js";

const userRoute = express.Router();

userRoute.post("/createUser", upload.single("profileImage"), createUser)
userRoute.post("/login", userLogin)
userRoute.post("/signup-with-google", googleSignup)
userRoute.post("/login-with-google", googleLogin)

// add auth middleware to protected routes
userRoute.get("/getAllUsers", userAuth, getAllUsers)
userRoute.get("/getUser/:id", userAuth, getUserByID)
userRoute.get("/logoutUser", userAuth, userLogout)

export default userRoute