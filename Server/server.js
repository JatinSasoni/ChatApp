import express, { urlencoded } from "express";
import { configDotenv } from "dotenv";
import authRouter from "./Routes/auth-routes.js";
import { connectToDB } from "./utils/db.js";
import userRouter from "./Routes/user-routes.js";
import messageRouter from "./Routes/message-routes.js";
import { Server } from "socket.io";
import http from "http";
import cors from "cors";

//Dot-env
configDotenv();

//Initialize App
const app = express();
const server = http.createServer(app);

//SOCKET.io
export const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

//Store online users in server -> local variable
export const userSocketMap = {}; // object containing {userID:SocketID}

//Socket.io connection handler
io.on("connection", (socket) => {
  //socket is client from frontend
  const userId = socket.handshake.query.userId; //provided via frontend
  console.log("user connected ", userId);
  if (userId) userSocketMap[userId] = socket.id;

  //Emit currently online users to all connected clients
  io.emit("getOnlineUsers", Object.keys(userSocketMap)); // keys are mongoose object id

  socket.on("disconnect", () => {
    console.log("user disconnected ", userId);
    //DELETE FROM SERVER
    delete userSocketMap[userId];

    //EMIT OTHERS ABOUT DISCONNECTED OR OFFLINE USER
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

//Middlewares
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(urlencoded({ extended: true }));

//ROUTES
app.use(express.static("./public"));
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/message", messageRouter);

//Central Error Middleware
app.use((err, req, res, next) => {
  // Determine status code and message
  const statusCode = err.statusCode || 500;
  const message = err.message || "Something went wrong!";
  return res.status(statusCode).json({
    message: message,
    success: false,
    errors: err.errors || [],
  });
});

//PORT
const PORT = process.env.PORT || 7000;

//Listen
await connectToDB(process.env.MONGODB_URI);
server.listen(PORT, () => {
  console.log(`Server started at PORT ${PORT}`);
});
