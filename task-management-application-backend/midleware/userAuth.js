import jwt from "jsonwebtoken"

export const userAuth = async (req, res, next) => {
    try {
        const token = req.cookies.token
        if (!token) {
            return res.status(401).json({ message: "Unauthorized user, no token" });
        }

        // Verify token
        const jwtToken = jwt.verify(token, process.env.JWT_SCREET_KEY)

        req.user = jwtToken.data
        next()
    } catch (err) {
        if (err.name === "TokenExpiredError") {
            return res.status(401).json({ message: "Token expired, please login again" })
        }
        return res.status(401).json({ message: "Invalid token" })
    }
}
