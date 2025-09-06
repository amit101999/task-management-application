import express from "express"
import { userAuth } from "../midleware/userAuth.js";
import {  addUserToTask, createtask, deleteTask, getAllTask, getALLTaskByUserID, getTaskByID, updateTaskStatus } from "../Controller/taskController.js";
import { checkAdmin } from "../midleware/checkAdmin.js";
const route = express.Router();

route.post("/createTask" ,userAuth ,checkAdmin, createtask )
route.delete("/deleteTask/:id" , userAuth , checkAdmin , deleteTask)

route.post("/addUser/:id" ,userAuth , checkAdmin , addUserToTask )
// route.delete("/deleteUser/:id" ,userAuth , checkAdmin , deleteUserFromTask )

// route.get("/getAllTask" ,userAuth , checkAdmin , getAllTask)original
route.get("/getAllTask" , getAllTask)
// testing route above chnage in end

route.get("/getTask/:id", userAuth ,checkAdmin, getTaskByID )
route.put("/updateTaskStatus/:id", userAuth ,updateTaskStatus )
route.get("/user/:id", userAuth ,getALLTaskByUserID )

export default route