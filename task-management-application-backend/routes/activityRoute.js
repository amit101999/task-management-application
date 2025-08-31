import express from "express";
import { getActivityByUser } from "../Controller/ActivityController.js";
import { userAuth } from "../midleware/userAuth.js";


const route = express.Router();

// addd middleware that only the admin can do this things also check it user is log in or not 
route.get("/getActivity/:id", userAuth, getActivityByUser)
export default route