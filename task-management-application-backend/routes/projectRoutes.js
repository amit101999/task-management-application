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

// addd middleware that only the admin can do this things also check it user is log in or not
route.post("/createProject", userAuth, checkAdmin, createProject);
route.get("/getAllProject", userAuth, getAllProject);
route.get("/getProject/:id", userAuth, getProjectByID);
route.delete("/deleteProject", userAuth, checkAdmin, deleteProject);
route.put("/updateProject/:id", userAuth, addtaskToProject);
route.get("/user/:id", userAuth, getAllProjectByUser);

export default route;
