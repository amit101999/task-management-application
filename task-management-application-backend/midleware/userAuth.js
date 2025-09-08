import jwt from "jsonwebtoken";

export const userAuth = async (req, res, next) => {
  try {
    const token = req.headers["authorization"]?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Unauthorized user, no token" });
    }

    // console.log("Token:", token); // Debugging line to check the token value
    // Verify token
    const jwtToken = jwt.verify(token, process.env.JWT_SCREET_KEY);

    req.user = jwtToken.data;
    console.log("Authenticated User:", req.user);
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res
        .status(401)
        .json({ message: "Token expired, please login again" });
    }
    return res.status(401).json({ message: "Invalid token" });
  }
};
