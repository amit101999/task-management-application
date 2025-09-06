import prisma from "../config/prisma.config.js";


export const getActivityByUser = async (req, res) => {
    try {
        const id = req.params.id
        const activity = await prisma.activity.findMany(({
            where: {
                userid: id
            },
            take: 5,
            orderBy: {
                createdAt: "asc"
            }
        }))
        res.status(200).json({ msg: "New Activity send", data: activity })
    } catch (err) {
        res.status(200).json({ msg: "Error in sending Activity" })
    }

}