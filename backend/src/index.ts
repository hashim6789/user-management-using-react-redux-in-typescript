// import { Dog } from "./Dog.js";
import express from "express";
import { sampleRouter } from "./routes/sampleRouter.js";
import morgan from "morgan";
import { connectDB } from "./config/db";
import userRouter from "./routes/userRoutes.js";
import authRouter from "./routes/authRoutes.js";
import dotenv from "dotenv";
import cors from "cors";
dotenv.config();

const hostname = process.env.HOST_NAME;
const port = process.env.PORT;
const corsOption: cors.CorsOptions = {
  origin: ["http://localhost:5173"],
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

const app = express();

connectDB();

app.use(cors(corsOption));

app.use(express.urlencoded());
app.use(express.json());

app.use(morgan("dev"));

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);

app.listen(3000, () => {
  console.log(`server started on : ${hostname}:${port}`);
});

// console.log("Hello Ts");
// console.log("Hello Ts");

// const dog = new Dog();
// dog.bark();
