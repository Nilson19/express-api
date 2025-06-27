import express from 'express';
import cors from 'cors';
import { setupSwagger } from './config/swagger';
import { errorHandler } from './middlewares/ErrorHandler';
import authRoutes from './interfaces/routes/auth.routes';

export const app = express();

app.use(cors());
app.use(express.json());

setupSwagger(app);

app.get('/api/v1', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/v1/auth', authRoutes);

// Error handler middleware must be added after all routes
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  errorHandler(err, req, res, next);
});
