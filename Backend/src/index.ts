import express from "express";
import dotenv from "dotenv";
dotenv.config();

import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import { UserRouter } from "./routes/userRouter";
import { JobRouter } from "./routes/jobRouter";
const app = express();

app.use(
  cors({
    origin: ["http://localhost:5173","https://jobportal-d2mf.onrender.com"],
    credentials: true,
  })
);
app.use(express.json());

app.use(cookieParser());


app.use("/api/v1/users", UserRouter);
app.use("/api/v1/job", JobRouter)

const MongoUrl1 = process.env.MongoUrl!;

async function Main() {
  await mongoose.connect(MongoUrl1);
  console.log("Connected to MongoDB");

  app.listen(process.env.PORT, () => {
    console.log(`Server started on port ${process.env.PORT}`);
  });
}

Main();
