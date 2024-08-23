import express, { Request, Response } from 'express';
export const app = express();
import cors from 'cors';

app.use(express.json());
app.use(cors());

app.get('/', (req: Request, res: Response) => {
  res.send('Welcome to Assignment-4');
});
