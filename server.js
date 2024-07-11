import express from "express";
import dotenv from "dotenv";
dotenv.config();
import bodyParser from "body-parser";
import { connectToDb } from "./db/db.js";
import userRouter from "./routes/user.routes.js";
import candidateRouter from "./routes/candidate.routes.js";
const app = express();
const port = 3000;

app.use(bodyParser.json()); // req.body

app.use("/api/user", userRouter);
app.use("/api/candidate", candidateRouter);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
  connectToDb();
});
