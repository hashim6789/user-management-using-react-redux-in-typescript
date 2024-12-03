console.log("Router loaded!");

import { Router } from "express";
const sampleRouter = Router();

sampleRouter.get("/", (req, res) => {
  res.json({ message: "Welcome to the sample router!" });
});

export { sampleRouter }; // in sampleRouter.ts
