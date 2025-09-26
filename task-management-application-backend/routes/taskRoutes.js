import express from "express"
import { userAuth } from "../midleware/userAuth.js";
import {  addUserToTask, createtask, deleteTask, getAllTask, getALLTaskByUserID, getTaskByID, updateTaskStatus } from "../Controller/taskController.js";
import { checkAdmin } from "../midleware/checkAdmin.js";

const route = express.Router();

// admin only routes
route.post("/createTask", userAuth, checkAdmin, createtask)
route.delete("/deleteTask/:id", userAuth, checkAdmin, deleteTask)
route.post("/addUser/:id", userAuth, checkAdmin, addUserToTask)

// protected routes - need authentication
route.get("/getAllTask", userAuth, getAllTask)
route.get("/getTask/:id", userAuth, getTaskByID)
route.put("/updateTaskStatus/:id", userAuth, updateTaskStatus)
route.get("/user/:id", userAuth, getALLTaskByUserID)

export default route