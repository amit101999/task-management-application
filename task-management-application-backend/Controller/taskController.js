
import prisma from "../config/prisma.config.js";
import { io } from "../index.js";
import { queue } from "../queue/emailQueue.js";

export const createtask = async (req, res) => {
  const { title, description, dueDate, projectName, assignedUser, userEmail } = req.body;

  try {

    io.to(assignedUser).emit("newActivity", { activityType: "New Task Added", description: title, createdAt: new Date() });
    const task = await prisma.task.create({
      data: {
        title,
        description,
        dueDate,
        assignedTo: {
          connect: {
            id: assignedUser,
          },
        },
        project: {
          connect: {
            id: projectName,
          },
        },
      },
      include: {
        assignedTo: true,
        project: true
      }
    });

    // updating the projet as the a new taks then it will also add a new user to the project

    await prisma.project.update({
      where: { id: projectName },
      data: {
        users: {
          connect: { id: assignedUser },
        },
      },
    });

    const newActivity = await prisma.activity.create({
      data: {
        userid: assignedUser,
        description: description,
        createdAt: new Date(),
        activityType: "New Task Added"
      }
    })

    // send email to user which is added to task
    // await queue.add("send-task-email", {
    //   email: userEmail,
    //   text: `Hi ${req.user.name} , You have been assigned a new task with id : ${title} ,
    //    please check your dashboard for more details`
    // })

    res.status(200).json({
      msg: "task Created successfully",
      data: task,
    });

  } catch (err) {
    console.log("Error in ceatingf task", err);
    throw new Error("Error in creating new task");
  }
};
// this will be chnage to get all task related to specific project
export const getAllTask = async (req, res) => {
  try {
    const task = await prisma.task.findMany({
      include: {
        assignedTo: true,
        project: true
      }
    });
    res.status(200).json({
      message: "All task fetched successfully",
      data: task,
    });
  } catch (err) {
    console.log(err);
    throw new Error("Error in getting all task");
  }
};

export const getTaskByID = async (req, res) => {
  try {
    const id = req.params.id;

    const task = await prisma.task.findUnique({
      where: {
        id: id,
      },
      include: {
        assignedTo: {
          select: {
            name: true,
          }
        },
        project: true
      }
    });
    if (!task) {
      return res.status(404).json({
        message: "task not found",
      });
    }
    res.status(200).json({
      message: "task fetched successfully",
      data: task,
    });
  } catch (err) {
    console.log(err);
    throw new Error("Error in getting task by id");
  }
};

export const deleteTask = async (req, res) => {
  const id = req.params.id;

  try {
    await prisma.task.delete({
      where: {
        id,
      },
    });

    res.status(200).json({
      msg: "Deleted Task successfully",
    });
  } catch (err) {
    console.log("Error in Task project ", err);
    throw new Error("Error in Task project");
  }
};

//update tasks status
export const updateTaskStatus = async (req, res) => {
  const id = req.params.id
  const status = req.body.data
  const username = req.user.name
  console.log("from task controller")

  io.to("ADMIN").emit("newActivity", { activityType: "Task Status Updated", description: `Task with id : ${id} has been updated by ${username} to ${status}`, createdAt: new Date() })

  const taskdata = await prisma.task.findUnique({
    where: {
      id: id
    }
  })

  if (!taskdata) {
    return res.status(404).json({
      message: "task not found"
    })
  }

  const tasks = await prisma.task.update({
    where: {
      id: id
    },
    data: {
      taskStatus: status
    }
  })

  const newActivity = await prisma.activity.create({
    data: {
      userid: "688f618c-5848-469e-b37e-23b745b5292a",
      description: `Task with id : ${id} has been updated by ${username} to ${status}`,
      createdAt: new Date(),
      activityType: "Task Status Updated"
    }
  })

  res.status(200).json({
    message: "task status updated successfully",
    data: tasks
  })

}

export const getALLTaskByUserID = async (req, res) => {
  const id = req.params.id
  console.log("from task controller")
  const user = await prisma.user.findUnique({
    where: {
      id: id,
    },
  });
  if (!user) {
    return res.status(404).json({
      message: "task not found",
    });
  }

  const task = await prisma.task.findMany({
    where: {
      assignedTo: {
        id: id,
      },
    },
    include: {
      project: true
    },
  });
  res.status(200).json({
    message: "User task fetched successfully",
    data: task,
  });
}

// add user to task
export const addUserToTask = async (req, res) => {
  const taskId = req.params.id;
  // const user = req.user
  // console.log(req.user.id)
  // console.log(user.dsa)
  try {
    const task = await prisma.task.findUnique({
      where: {
        id: taskId,
      },
    });
    if (!task) {
      return res.status(404).json({
        message: "task not found",
      });
    }
    const updateTask = await prisma.task.update({
      where: {
        id: taskId,
      },
      data: {
        assignedTo: {
          connect: {
            id: req.user.id,
          },
        },
      },
    });

    console.log("user added to task")
    await queue.add("send-task-email", {
      email: 'amitthakur10sep@gmail.com',
      text: `Hi ${req.user.name} , You have been assigned a new task with id : ${taskId} ,
       please check your dashboard for more details`
    })


    res.status(200).json({
      message: "User added to task successfully",
      data: updateTask,
    });
  } catch (err) {
    console.log("Error in adding user to task", err);
    res.status(400).json({
      err: err,
      msg: "error is adding user",
    });
    throw new Error("Error in adding user to task");
  }
};

// export const deleteUserFromTask = async (req, res) => {
//   const taskId = req.params.id;
//   const userId = req.body.userId;

//   try {
//     const task = prisma.task.findUnique({
//       where: {
//         id: taskId,
//       },
//     });
//     if (!task) {
//       return res.status(404).json({
//         message: "task not found",
//       });
//     }
//     const deleteUser = await prisma.task.update({
//       where: {
//         id: taskId,
//       },
//       data: {
//         assignedTo: {
//           disconnect: {
//             id: userId,
//           },
//         },
//       },
//     });
//     res.status(200).json({
//       message: "User deleted from task successfully",
//     });
//   } catch (err) {
//     console.log("Error in adding user to task", err);
//     throw new Error("Error in adding user to task");
//   }
// };
