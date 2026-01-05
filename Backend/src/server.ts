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
<<<<<<< HEAD
  origin: process.env.FRONTEND_URL,
  credentials: true, 
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], 
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept"]
}));

app.use(cookieParser());
app.use(express.json()) 
app.use(express.urlencoded({ extended: true }));
app.use(helmet()); 

=======
    origin:["https://edugrant-app.vercel.app", "http://localhost:5173"], 
  credentials: true, 
  methods: ["GET", "POST", "PUT", "DELETE"],
 allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept"]
}));

app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } })); 
app.use(cookieParser());
app.use(express.json()) 
app.use(express.urlencoded({ extended: true }));
>>>>>>> 9098a4a47adc0fa1d89c2b2b482db2a2ae66b407

// Test
app.get('/', (req: Request, res: Response) => {
    res.send('Scholarship Portal API is running...');
});

//Routes 
app.use('/api/users', userRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/scholarships', scholarshipRoutes);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
