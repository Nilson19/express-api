import express from 'express';
import cors from 'cors';
import { setupSwagger } from './config/swagger';

export const app = express();

app.use(cors());
app.use(express.json());

setupSwagger(app);

app.get('/api', (req, res) => {
  res.json({ status: 'ok' });
});

