import prisma from "../config/prisma.config.js";

export const createProject = async (req, res) => {
  let { projectName, description, startDate, endDate } = req.body;
  const currentDate = new Date();
  let Status = "ACTIVE"
  if (startDate > currentDate.toLocaleDateString("en-CA")) {
    Status = "UPCOMING"
    console.log(Status)
  } else {
    console.log(Status)
  }

  try {
    const project = await prisma.project.create({
      data: {
        projectName: projectName, description, endDate: new Date(endDate).toISOString()
        , startDate: new Date(startDate).toISOString(), status: Status
      }
    })

    res.status(200).json({
      data: { ...project, users: [], tasks: [] },
      msg: "project created successfully"
    })
    // res.status(200)
  } catch (err) {
    console.log("Error in creating project ", err)
    throw new Error("Error in creating project")
  }
};

export const getAllProject = async (req, res) => {
  try {
    const project = await prisma.project.findMany({
      include: {
        tasks: true,
        users: true
      }
    })
    res.status(200).json({
      message: "All project fetched successfully",
      data: project
    })
  } catch (err) {
    console.log(err)
    throw new Error("Error in getting all project")
  }
};

export const getProjectByID = async (req, res) => {
  try {
    const id = req.params.id

    const project = await prisma.project.findUnique({
      where: {
        id: id
      },
      include: {
        tasks: {
          include: {
            assignedTo: {
              select :{
                name: true
              }
            }
          }
        },
        users: {
          include :{
            tasks: true
          }
        },
      },
    })
    if (!project) {
      return res.status(404).json({
        message: "project not found"
      })
    }
    res.status(200).json({
      message: "project fetched successfully",
      data: project
    })
  } catch (err) {
    console.log(err)
    throw new Error("Error in getting project by id")
  }
};

export const deleteProject = async (req, res) => {
  const id = req.params

  try {
    await prisma.project.delete({
      where: {
        id
      }
    })

    res.status(200).json({
      msg: "project deleted successfully"
    })
  } catch (err) {
    console.log("Error in deleting project ", err)
    throw new Error("Error in deleting project")
  }
};

// add new member  to project

// delete member from project

// add task to proect
export const addtaskToProject = async (req, res) => {
  const projectId = req.params.id;
  const taskId = req.body.taskId;
  try {
    const project = await prisma.project.findUnique({
      where: {
        id: projectId,
      },
    });
    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    // now this will update the tasks list and also the project task list
    const updateTask = await prisma.task.update({
      where: {
        id: taskId,
      },
      data: {
        project: {
          connect: {
            id: projectId
          },
        },
      },
    })


    res.status(200).json({
      message: "task added to project successfully",
      data: project,
    })
  } catch (err) {
    console.log("Error in adding task to project", err);
    res.status(400).json({
      err: err,
      msg: "error is adding Task to project"
    })
    throw new Error("Error in adding task to project");
  }
};

export const getAllProjectByUser = async (req,res)=>{
  const id = req.params.id

  const user = await prisma.user.findUnique({
    where: {
      id: id,
    },
  });
  if (!user) {
    return res.status(404).json({ 
      message: "User not found",
    });
  }

  const projects = await prisma.project.findMany({
    where: {
      users:{
        some: {
          id: id
        }
      }
    },
    include: {
      tasks: true,
      users: true
    }
  });
  res.status(200).json({
    message: "User project fetched successfully",
    data: projects
  });

} 


// delete task from project
