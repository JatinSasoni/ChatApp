import express, { urlencoded } from "express";
import { configDotenv } from "dotenv";
import authRouter from "./Routes/auth-routes.js";
import { connectToDB } from "./utils/db.js";
import userRouter from "./Routes/user-routes.js";

//Dot-env
configDotenv();

//Initialize App
const app = express();

//Middlewares
app.use(express.json());
app.use(urlencoded({ extended: true }));

//ROUTES
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/user", userRouter);

//Central Error Middleware
app.use((err, req, res, next) => {
  // Determine status code and message
  const statusCode = err.statusCode || 500;
  const message = err.message || "Something went wrong!";
  return res.status(statusCode).json({
    message: message,
    success: false,
    errors: err.errors || err.message,
  });
});

//PORT
const PORT = process.env.PORT || 7000;

//Listen
await connectToDB(process.env.MONGODB_URI);
app.listen(PORT, () => {
  console.log(`Server started at PORT ${PORT}`);
});
