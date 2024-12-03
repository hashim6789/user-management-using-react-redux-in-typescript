// import { Dog } from "./Dog.js";
import express from "express";
import { sampleRouter } from "./routes/sampleRouter.js";
import morgan from "morgan";
import { connectDB } from "./config/db";
import userRouter from "./routes/userRoutes.js";

const app = express();

connectDB();

app.use(morgan("dev"));
app.use("/api", sampleRouter);
app.use("/api/user", userRouter);

app.listen(3000, () => {
  console.log("object");
});

// console.log("Hello Ts");
// console.log("Hello Ts");

// const dog = new Dog();
// dog.bark();
