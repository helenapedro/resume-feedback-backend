import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import connectDB from './config/db';
import authRoutes from './routes/authRoutes';
import resumeRoutes from './routes/resumeRoutes';
import commentRoutes from './routes/commentRoutes'
import { errorHandler } from './middlewares/errorHandler ';

dotenv.config();

connectDB(); 

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100, 
  message: 'Too many requests from this IP, please try again after 15 minutes',
});

const app = express();

app.use(express.json());
app.use(morgan('dev'));
app.use(helmet());
app.use(limiter);

app.use(cors());

app.use('/api/auth', authRoutes);
app.use('/api/resumes', resumeRoutes);
app.use('/api/comments', commentRoutes);

app.use(errorHandler);

app.get('/', (req, res) => {
  res.send('Resume Feedback API');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
