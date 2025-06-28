import express from 'express';
import cors from 'cors';
import passport from "passport";
import { setupSwagger } from './config/swagger';
import { errorHandler } from './middlewares/ErrorHandler';
import authRoutes from './interfaces/routes/auth.routes';
import shipmentRoutes from './interfaces/routes/shipment.routes';
import { configurePassport }  from "./config/passport";
import { UserRepository } from './infrastructure/repositories/UserRepository';
import { AppError } from './utils/errors/AppError';

export const app = express();
const userRepository = new UserRepository();

app.use(cors());
app.use(express.json());
app.use(passport.initialize());
configurePassport(passport, userRepository);

setupSwagger(app);

app.get('/api/v1', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/shipments', shipmentRoutes);


app.use((err: AppError, req: express.Request, res: express.Response, next: express.NextFunction) => {
  errorHandler(err, req, res, next);
});
