import "dotenv/config";
import express, { urlencoded } from "express";
import authRouter from "./Routes/auth-routes.js";
import { connectToDB } from "./utils/db.js";
import userRouter from "./Routes/user-routes.js";
import messageRouter from "./Routes/message-routes.js";
import { Server } from "socket.io";
import http from "http";
import cors from "cors";
import cookieParser from "cookie-parser";
import { transporter } from "./utils/nodemailer.js";
import friendshipRoute from "./Routes/friendship-routes.js";
import groupRouter from "./Routes/group-routes.js";

//Dot-env

//Initialize App
const app = express();
const server = http.createServer(app);

// Middlewares
const allowedOrigins = [
  "http://localhost:5173",
  "https://quickchatpro.netlify.app",
];

// CORS configuration
app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Cookie parser should come before routes
app.use(cookieParser());

// Body parsers
app.use(express.json({ limit: "4mb" }));
app.use(urlencoded({ extended: true, limit: "4mb" }));

// Socket.IO with matching CORS
export const io = new Server(server, {
  cors: {
    origin: allowedOrigins, // Match Express CORS
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    credentials: true,
  },
});

// Store online users in server -> local variable
export const userSocketMap = {};

// Socket.io connection handler
io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;
  // console.log("user connected ", userId);
  if (userId) userSocketMap[userId] = socket.id;

  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    // console.log("user disconnected ", userId);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });

  socket.on("joinMultipleGroups", ({ groupIds, username }) => {
    groupIds.forEach((groupId) => {
      socket.join(groupId);
    });
    // console.log(`${username} joined groups:`, groupIds);
  });

  socket.on("leaveMultipleGroups", ({ groupIds, username }) => {
    groupIds.forEach((groupId) => {
      socket.leave(groupId);
    });
    // console.log(`${username} left groups:`, groupIds);
  });
});

// ROUTES
app.use(express.static("./public"));
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/message", messageRouter);
app.use("/api/v1/friendship", friendshipRoute);
app.use("/api/v1/groups", groupRouter);

// Central Error Middleware
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Something went wrong!";
  return res.status(statusCode).json({
    message: message,
    success: false,
    errors: err.errors || [],
  });
});

// PORT
const PORT = process.env.PORT || 7000;

// Listen
await connectToDB(process.env.MONGODB_URI);
server.listen(PORT, async () => {
  console.log(`Server started at PORT ${PORT}`);
});
