export const checkAdmin = (req ,res,next) =>{
    const user = req.user;
    if(user.role !== "ADMIN") {
        return res.status(401).json({message : "Only admin can access this route"});
    }
    next()
}