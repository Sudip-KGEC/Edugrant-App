import dotenv from 'dotenv';
dotenv.config();

import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import connectDB from './config/db';
import cookieParser from 'cookie-parser'; 
import userRoutes from './routes/userRoutes';
import scholarshipRoutes from './routes/scholarshipRoutes';
import chatRoutes from './routes/chatRoutes';
import notificationRoutes from './routes/notificationRoutes';


const app: Application = express();
connectDB();

// Middleware
app.set("trust proxy", 1);
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true, 
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"], 
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept"]
}));

app.use(cookieParser());
app.use(express.json()) 
app.use(express.urlencoded({ extended: true }));
app.use(helmet()); 


// Test
app.get('/', (req: Request, res: Response) => {
    res.send('Scholarship Portal API is running...');
});

//Routes 
app.use('/api/notifications', notificationRoutes);
app.use('/api/users', userRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/scholarships', scholarshipRoutes);


export default app;

if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}