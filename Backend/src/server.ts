import dotenv from 'dotenv';
dotenv.config();

import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import connectDB from './config/db';
import cookieParser from 'cookie-parser'; 
import userRoutes from './routes/userRoutes';
import scholarshipRoutes from './routes/scholarshipRoutes';
import chatRoutes from './routes/chatRoutes'


const app: Application = express();
connectDB();

// Middleware

app.use(cors({
    origin:["https://edugrant-app.vercel.app", "https://edugrant-app.vercel.app/"], 
  credentials: true, 
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"] 
}));

app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } })); 
app.use(cookieParser());
app.use(express.json()) 
app.use(express.urlencoded({ extended: true }));

// Test
app.get('/', (req: Request, res: Response) => {
    res.send('Scholarship Portal API is running...');
});

//Routes 
app.use('/api/users', userRoutes);
app.use('/api', chatRoutes);
app.use('/api/scholarships', scholarshipRoutes);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
