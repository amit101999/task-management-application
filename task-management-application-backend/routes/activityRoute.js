import express from "express";
import { getActivityByUser, getAllActivities, createActivity } from "../Controller/ActivityController.js";
import { userAuth } from "../midleware/userAuth.js";
import { checkAdmin } from "../midleware/checkAdmin.js";

const route = express.Router();

// admin only routes
route.post("/createActivity", userAuth, checkAdmin, createActivity);

// protected routes - need authentication
route.get("/getActivity/:id", userAuth, getActivityByUser);
route.get("/getAllActivities", userAuth, checkAdmin, getAllActivities);

export default route;