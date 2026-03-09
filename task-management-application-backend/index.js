import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import cookieParser from "cookie-parser";
// import  memberRoute from "./routes/memberRoutes"
import userRoutes from "./routes/userRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import activityRoutes from "./routes/activityRoute.js";
import { createServer } from "http";
import { Server } from "socket.io";

const app = express();

const server = createServer(app);
export const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || [
      "https://task-management-application-opal.vercel.app",
      "https://task-management-application-production-d5a1.up.railway.app",
      "http://localhost:5173",
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("join-admin", () => {
    socket.join("ADMIN");
    console.log("Admin joined room");
  });

  socket.on("join-user", (userId) => {
    socket.join(userId);
    console.log("User joined room:", userId);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

app.use(
  cors({
    origin: process.env.FRONTEND_URL || [
      "https://task-management-application-opal.vercel.app",
      "https://task-management-application-production-d5a1.up.railway.app",
      "http://localhost:5173",
    ],
    credentials: true,
  })
);
// app.options("*", cors());

app.use(cookieParser());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/api/user", userRoutes);

app.use("/api/task", taskRoutes);
app.use("/api/project", projectRoutes);
app.use("/api/activity", activityRoutes);

app.get("/check", (req, res) => {
  console.log("/check route is hit");
  res.send("server isas working fine");
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log("=========================================");
  console.log(`🚀 Server initialized and running on port ${PORT}`);
  console.log("✅ Express App Started");
  console.log("✅ Socket.IO Server Started");
  console.log("✅ CORS configured for frontend domains");
  console.log(`🔌 Redis URL configured: ${process.env.REDIS_URL ? "Yes" : "No"}`);
  console.log("=========================================");
});
