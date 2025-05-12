import express from 'express';
import connectDB from './config/db.js';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import userRoutes from './routes/user.route.js';
import jobRoutes from './routes/job.route.js';
import companyRoutes from './routes/company.route.js';
import applicationRoutes from './routes/application.route.js';

const app = express();

dotenv.config();

const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost/5173',
  credentials: true,
};


app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get('/', (req, res) => {
  res.json({ message: 'API is running...' });
});

app.use('/api/v1/user', userRoutes);
app.use('/api/v1/job', jobRoutes);
app.use('/api/v1/company', companyRoutes);
app.use('/api/v1/application', applicationRoutes);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
    await connectDB();
  } catch (error) {
    console.error('Error starting server:', error);
  }
};

startServer();
