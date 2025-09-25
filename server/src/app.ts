import express from 'express';
import type { Application, Request, Response } from 'express';
import { userRouter } from "./routes/user.route.js";

const app: Application = express();
app.use(express.json());

app.use("/users", userRouter);

export default app;
