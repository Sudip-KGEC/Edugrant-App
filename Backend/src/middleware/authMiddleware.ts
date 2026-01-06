import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';

export const protect = async (req: Request, res: Response, next: NextFunction) => {

  const token = req.cookies?.token;

  if (!token) {
    return res.status(401).json({ message: "Not authorized, please login" });
  }
  
  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      console.error("CRITICAL: JWT_SECRET is not defined in .env");
      return res.status(500).json({ message: "Internal server configuration error" });
    }

    const decoded: any = jwt.verify(token, secret);

    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return res.status(401).json({ message: "User no longer exists" });
    }

    (req as any).user = user;
    next();
  } catch (error: any) {
    console.error("JWT Verification Error:", error.name);
    
    res.clearCookie('token');

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: "Session expired, please login again" });
    }
    res.status(401).json({ message: "Invalid session, please login again" });
  }
};