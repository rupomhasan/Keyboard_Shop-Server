import express, { Request, Response } from "express";
export const app = express();
import cors from "cors";
import { router } from "./app/routes";
import { NotFoundRoute } from "./app/middlewares/NotFoundRoute";

app.use(express.json());
app.use(cors());

app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to Assignment-4");
});

app.use("/api", router)

app.use(NotFoundRoute)