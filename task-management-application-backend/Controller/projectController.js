import prisma from "../config/prisma.config.js";
import redis from "../config/redis.js";

export const createProject = async (req, res) => {
  let { projectName, description, startDate, endDate } = req.body;
  const currentDate = new Date();
  let Status = "ACTIVE";
  if (startDate > currentDate.toLocaleDateString("en-CA")) {
    Status = "UPCOMING";
    console.log(Status);
  } else {
    console.log(Status);
  }

  try {
    const project = await prisma.project.create({
      data: {
        projectName: projectName,
        description,
        endDate: new Date(endDate).toISOString(),
        startDate: new Date(startDate).toISOString(),
        status: Status,
      },
    });

    res.status(200).json({
      data: { ...project, users: [], tasks: [] },
      msg: "project created successfully",
    });
    // res.status(200)
  } catch (err) {
    console.log("Error in creating project ", err);
    throw new Error("Error in creating project");
  }
};

export const getTotalProjectCount = async (req, res) => {
  const count = await prisma.project.count();
  res.status(200).json({ totalProjectCount: count });
};

export const getAllProjectCountByStatus = async (req, res) => {
  const count = await prisma.project.groupBy({
    by: ["status"],
    _count: true,
  });

  return res.status(200).json({
    message: "Project count by status fetched successfully",
    data: count,
  });
};

export const getAllProject = async (req, res) => {
  try {
    const page = req.query.page || 1;
    const limit = req.query.limit || 20;
    const status = req.query.status || "";
    const search = req.query.search || "";

    const skip = (page - 1) * limit;

    // simple where clause
    let whereClause = {};
    if (status) {
      whereClause.status = status;
    }
    if (search) {
      whereClause.OR = [
        { projectName: { contains: search } },
        { description: { contains: search } },
      ];
    }

    const chachedData = await redis.get("all_projects");

    console.log(JSON.parse(chachedData));
    if (chachedData) {
      console.log("Serving from cache");
    } else {
      console.log("Serving from database");
    }

    // get projects with only needed fields
    const projects = await prisma.project.findMany({
      where: whereClause,
      skip: parseInt(skip),
      take: parseInt(limit),
      select: {
        id: true,
        projectName: true,
        description: true,
        status: true,
        startDate: true,
        endDate: true,
        completedTask: true,
        // get counts instead of full relations
        _count: {
          select: {
            tasks: true,
            users: true,
          },
        },
      },
      orderBy: {
        startDate: "desc",
      },
    });

    // get total count
    const totalCount = await prisma.project.count({ where: whereClause });

    res.status(200).json({
      message: "All project fetched successfully",
      data: projects,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit),
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error in getting all project" });
  }
};

export const getProjectByID = async (req, res) => {
  try {
    const id = req.params.id;

    const project = await prisma.project.findUnique({
      where: {
        id: id,
      },
      select: {
        id: true,
        projectName: true,
        description: true,
        status: true,
        startDate: true,
        endDate: true,
        completedTask: true,
        // get recent tasks with basic info
        tasks: {
          select: {
            id: true,
            title: true,
            taskStatus: true,
            priority: true,
            dueDate: true,
            startDate: true,
            assignedTo: {
              select: {
                id: true,
                name: true,
                email: true,
                avatar: true,
                department: true,
              },
            },
          },
          take: 50,
          orderBy: {
            id: "desc",
          },
        },
        // get basic user info
        users: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
            department: true,
            role: true,
            _count: {
              select: {
                tasks: true,
              },
            },
          },
          take: 10,
          orderBy: {
            name: "asc",
          },
        },
      },
    });

    if (!project) {
      return res.status(404).json({
        message: "project not found",
      });
    }

    res.status(200).json({
      message: "project fetched successfully",
      data: project,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error in getting project by id" });
  }
};

export const deleteProject = async (req, res) => {
  const id = req.params;

  try {
    await prisma.project.delete({
      where: {
        id,
      },
    });

    res.status(200).json({
      msg: "project deleted successfully",
    });
  } catch (err) {
    console.log("Error in deleting project ", err);
    throw new Error("Error in deleting project");
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
            id: projectId,
          },
        },
      },
    });

    res.status(200).json({
      message: "task added to project successfully",
      data: project,
    });
  } catch (err) {
    console.log("Error in adding task to project", err);
    res.status(400).json({
      err: err,
      msg: "error is adding Task to project",
    });
    throw new Error("Error in adding task to project");
  }
};

export const getAllProjectByUser = async (req, res) => {
  try {
    const id = req.params.id;
    const page = req.query.page || 1;
    const limit = req.query.limit || 20;
    const status = req.query.status || "";

    const skip = (page - 1) * limit;

    // check if user exists
    const user = await prisma.user.findUnique({
      where: { id: id },
      select: { id: true, name: true },
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // simple where clause
    let whereClause = {
      users: {
        some: {
          id: id,
        },
      },
    };

    if (status) {
      whereClause.status = status;
    }

    const projects = await prisma.project.findMany({
      where: whereClause,
      skip: parseInt(skip),
      take: parseInt(limit),
      select: {
        id: true,
        projectName: true,
        description: true,
        status: true,
        startDate: true,
        endDate: true,
        completedTask: true,
        // get counts instead of full relations
        _count: {
          select: {
            tasks: true,
            users: true,
          },
        },
      },
      orderBy: {
        startDate: "desc",
      },
    });

    // get total count
    const totalCount = await prisma.project.count({ where: whereClause });

    res.status(200).json({
      message: "User project fetched successfully",
      data: projects,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit),
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error in getting user projects" });
  }
};

// delete task from project
