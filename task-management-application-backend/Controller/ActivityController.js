import prisma from "../config/prisma.config.js";

export const getActivityByUser = async (req, res) => {
  try {
    const id = req.params.id;
    const page = req.query.page || 1;
    const limit = req.query.limit || 10;
    const activityType = req.query.activityType || '';
    
    const skip = (page - 1) * limit;
    
    // simple where clause
    let whereClause = {
      userid: id
    };
    
    if (activityType) {
      whereClause.activityType = activityType;
    }

    const activities = await prisma.activity.findMany({
      where: whereClause,
      skip: parseInt(skip),
      take: parseInt(limit),
      select: {
        id: true,
        description: true,
        activityType: true,
        createdAt: true,
        // get basic user info
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
            department: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // get total count
    const totalCount = await prisma.activity.count({ where: whereClause });

    res.status(200).json({ 
      message: "Activities fetched successfully", 
      data: activities,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit)
      }
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error in getting activities" });
  }
};

// get all activities (for admin)
export const getAllActivities = async (req, res) => {
  try {
    const page = req.query.page || 1;
    const limit = req.query.limit || 20;
    const activityType = req.query.activityType || '';
    const userId = req.query.userId || '';
    const search = req.query.search || '';
    
    const skip = (page - 1) * limit;
    
    // simple where clause
    let whereClause = {};
    
    if (activityType) {
      whereClause.activityType = activityType;
    }
    
    if (userId) {
      whereClause.userid = userId;
    }
    
    if (search) {
      whereClause.OR = [
        { description: { contains: search } },
        { activityType: { contains: search } }
      ];
    }

    const activities = await prisma.activity.findMany({
      where: whereClause,
      skip: parseInt(skip),
      take: parseInt(limit),
      select: {
        id: true,
        description: true,
        activityType: true,
        createdAt: true,
        // get basic user info
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
            department: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // get total count
    const totalCount = await prisma.activity.count({ where: whereClause });

    res.status(200).json({ 
      message: "All activities fetched successfully", 
      data: activities,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit)
      }
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error in getting all activities" });
  }
};

// create activity
export const createActivity = async (req, res) => {
  try {
    const { userid, description, activityType } = req.body;

    const activity = await prisma.activity.create({
      data: {
        userid,
        description,
        activityType
      },
      select: {
        id: true,
        description: true,
        activityType: true,
        createdAt: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
            department: true
          }
        }
      }
    });

    res.status(201).json({ 
      message: "Activity created successfully", 
      data: activity 
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error in creating activity" });
  }
};