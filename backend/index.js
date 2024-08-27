import express, { urlencoded } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import connectDB from "./utilis/db.js";
dotenv.config({});
import userRoute from "./routes/user.js";
import postRoute from "./routes/post.js";
import messageRoute from "./routes/message.js";
import { app, server } from "./socket/socket.js";
import path from "path";
const PORT = process.env.PORT || 5000;

const __dirname = path.resolve();
// console.log(__dirname);

//middlewares
app.use(express.json());
app.use(cookieParser());
app.use(urlencoded({ extended: true }));
const corsOption = {
  origin: "http://localhost:5173",
  credentials: true,
};
app.use(cors(corsOption));

//get api
app.use("/api/v1/user", userRoute);
app.use("/api/v1/post", postRoute);
app.use("/api/v1/message", messageRoute);

app.use(express.static(path.join(__dirname, "/frontend/dist")));
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
});
//listen port
server.listen(PORT, () => {
  connectDB();
  console.log(`server running at Port ${PORT}`);
});
