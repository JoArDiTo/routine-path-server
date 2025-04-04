import express, { Request, Response } from 'express';
import { PORT } from '@config/constants.ts';
import userRouter from '@api/users/routes.ts';
import goalRouter from '@api/goals/routes';
import stepRouter from '@api/steps/routes.ts';
import { authMiddleware } from '@middlewares/validTokenMiddleware.ts';
import { pathMiddleware } from '@middlewares/pathMiddleware.ts';
import { corsMiddleware } from '@middlewares/corsMiddleware.ts';

const app = express();
app.use(express.json());
app.use(corsMiddleware());
app.use(pathMiddleware)

app.get('/', (req: Request, res: Response) => {
  res.status(200).json({ status: 'API is running successfully!' });
});

app.use('/api/users', userRouter);
app.use('/api/goals', authMiddleware, goalRouter);
app.use('/api/steps', authMiddleware, stepRouter);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});