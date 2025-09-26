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
    origin: "https://task-management-application-opal.vercel.app",
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
    origin: "https://task-management-application-opal.vercel.app",
    credentials: true,
  })
);

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

server.listen(process.env.PORT, () =>
  console.log(`server is running on port ${process.env.PORT}`)
);
