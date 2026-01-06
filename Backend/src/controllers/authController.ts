import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import User from '../models/User';
import Otp from '../models/Otp';


export const sendOtp = async (req: Request, res: Response) => {
  if (!req.body || !req.body.email) {
    return res.status(400).json({ 
      success: false, 
      message: "Email is required. Make sure you are sending a JSON body." 
    });
  }
  const { email } = req.body;

  const otpCode = Math.floor(1000 + Math.random() * 9000).toString();

  try {

    await Otp.findOneAndUpdate(
      { email }, 
      { otp: otpCode, createdAt: new Date() }, 
      { upsert: true }
    );

    const transportOptions: SMTPTransport.Options = {
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, 
      },
    };

    const transporter = nodemailer.createTransport(transportOptions);

    await transporter.sendMail({
      from: `"EduGrant" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your Verification Code",
      html: `
        <div style="font-family: sans-serif; padding: 20px;">
          <h2>Verification Code</h2>
          <p>Your OTP for EduGrant is: <strong style="font-size: 24px; color: #4F46E5;">${otpCode}</strong></p>
          <p>This code expires in 5 minutes.</p>
        </div>
      `,
    });

    res.status(200).json({ success: true, message: "OTP sent successfully" });
  } catch (error: any) {
    console.error("Nodemailer Error:", error);
    res.status(500).json({ success: false, message: "Failed to send email" });
  }
};

export const verifyOtp = async (req: Request, res: Response) => {
  const { email, otp } = req.body;

  try {
    const record = await Otp.findOne({ email, otp });
    if (!record) {
      return res.status(400).json({ success: false, message: "Invalid or expired OTP" });
    }
    await Otp.deleteOne({ _id: record._id });

    const user = await User.findOne({ email });

    if (user) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET as string, { expiresIn: '7d' });

    res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

      return res.status(200).json({
        success: true,
        isRegistered: true,
        user,
        token 
      });
    } else {
      return res.status(200).json({
        success: true,
        isRegistered: false,
        message: "OTP Verified. Please complete your profile."
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: "Verification failed" });
  }
};

export const register = async (req: Request, res: Response) => {

  if (!req.body || !req.body.email || !req.body.name ) {
    return res.status(400).json({ 
      success: false, 
      message: "All fields are required. Make sure you are sending a JSON body." 
    });
  }

  try {
    const { email } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
     
    const newUser = new User(req.body);
    const savedUser = await newUser.save();


    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error("JWT_SECRET is not defined in environment variables");
    }

   const token = jwt.sign(
  { id: savedUser._id }, 
  process.env.JWT_SECRET as string, 
  { expiresIn: '7d' }
);

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'none',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(201).json({
      success: true,
      user: {
        _id: savedUser._id,
        name: savedUser.name,
        email: savedUser.email,
        college: savedUser.college,
        cgpa: savedUser.cgpa,
        class12Marks: savedUser.class12Marks,
        highestDegree: savedUser.highestDegree,
        currentDegree: savedUser.currentDegree,
        role: savedUser.role,
        fieldOfStudy: savedUser.fieldOfStudy,
        organization: savedUser.organization,
        department: savedUser.department,
        designation: savedUser.designation,
        employeeId: savedUser.employeeId,
        appliedScholarships: savedUser.appliedScholarships
        
      },
      token
    });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getProfile = async (req: Request, res: Response) => {
  try {
   
    const user = (req as any).user;
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);

  } catch (error) {
    console.error("GetProfile Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const logout = (req: Request, res: Response) => {
  res.cookie('token', '', { expires: new Date(0), httpOnly: true });
  res.status(200).json({ message: "Logged out" });
};