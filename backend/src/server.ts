import express from "express";
import { sampleRouter } from "./routes/sampleRouter"; // in server.ts
import morgan from "morgan";
import helmet from "helmet";

const app = express();
const PORT = 3000;

// Middleware for JSON parsing
app.use(express.json());
app.use(morgan("dev"));
app.use(helmet());

// Use the sample router
app.use("/test", sampleRouter);
app.use("/api", (req, res) => {
  res.json({ message: "hello" });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
