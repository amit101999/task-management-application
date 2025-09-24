import express from "express";
import {
  addtaskToProject,
  createProject,
  deleteProject,
  getAllProject,
  getAllProjectByUser,
  getProjectByID,
} from "../Controller/projectController.js";
import { userAuth } from "../midleware/userAuth.js";
import { checkAdmin } from "../midleware/checkAdmin.js";

const route = express.Router();

// admin only routes
route.post("/createProject", userAuth, checkAdmin, createProject);
route.delete("/deleteProject", userAuth, checkAdmin, deleteProject);
route.put("/updateProject/:id", userAuth, checkAdmin, addtaskToProject);

// protected routes - need authentication
route.get("/getAllProject", userAuth, getAllProject);
route.get("/getProject/:id", userAuth, getProjectByID);
route.get("/user/:id", userAuth, getAllProjectByUser);

export default route;
