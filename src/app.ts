import express, { Request, Response } from "express";
export const app = express();
import cors from "cors";
import { router } from "./app/routes";
import { NotFoundRoute } from "./app/middlewares/NotFoundRoute";
import { GlobalErrorHandler } from "./app/middlewares/GlobalErrorHandler";
import cookieParser from "cookie-parser"



app.use(express.json());
app.use(cookieParser())
app.use(cors());


app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to Assignment-4");
});

app.use("/api", router)
app.use(GlobalErrorHandler)
app.use(NotFoundRoute)