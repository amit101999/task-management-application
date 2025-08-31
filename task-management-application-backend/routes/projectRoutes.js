import express from "express";
import { addtaskToProject, createProject, deleteProject, getAllProject, getAllProjectByUser, getProjectByID } from "../Controller/projectController.js";


const route = express.Router();

// addd middleware that only the admin can do this things also check it user is log in or not 
route.post("/createProject" , createProject)
route.get("/getAllProject" , getAllProject)
route.get("/getProject/:id" , getProjectByID)
route.delete("/deleteProject" , deleteProject)
route.put("/updateProject/:id" , addtaskToProject)
route.get("/user/:id" , getAllProjectByUser)

export default route