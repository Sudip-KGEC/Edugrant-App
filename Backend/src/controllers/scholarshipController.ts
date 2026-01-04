
import { Request, Response } from 'express';
import Scholarship from '../models/Scholarship'; 
import User from '../models/User';
import Application from '../models/Application'; 

// Get ONLY scholarships added 
export const getScholarships = async (req: Request, res: Response) => {
  try {
    const { adminId } = req.query;
    let query = {};

    // Check if adminId is a valid string and NOT the literal string "undefined"
    if (adminId && adminId !== 'undefined') {
      query = { adminId: adminId };
    }

    const scholarships = await Scholarship.find(query).sort({ createdAt: -1 });
    res.status(200).json(scholarships);
  } catch (error) {
    // Log the error to see exactly why it's failing
    console.error("Error fetching scholarships:", error);
    res.status(500).json({ message: 'Error fetching data' });
  }
};

// Add Scholarship 
export const addScholarship = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user; // From your auth middleware
    const { name, provider, amount, deadline, category, gpaRequirement, degreeLevel, description, eligibility, officialUrl } = req.body;

    const scholarship = new Scholarship({
      name,
      provider,
      amount: Number(amount),
      gpaRequirement: Number(gpaRequirement),
      deadline: new Date(deadline),
      category: category || 'General',
      degreeLevel,
      description,
      eligibility,
      officialUrl,
      adminId: user._id // CRITICAL: Link to current admin
    });

    const savedScholarship = await scholarship.save();
    res.status(201).json(savedScholarship);
  } catch (error: any) {
    res.status(400).json({ message: error.message || 'Invalid Data' });
  }
};

// Apply to Scholarship
export const applyToScholarship = async (req: Request, res: Response) => {
  try {
    const { scholarshipId } = req.body;
    const user = (req as any).user;

    // 1. Find scholarship to get adminId
    const scholarship = await Scholarship.findById(scholarshipId);
    if (!scholarship) return res.status(404).json({ message: 'Scholarship not found' });

    // 2. Check if already applied
    const existing = await Application.findOne({ scholarshipId, studentId: user._id });
    if (existing) return res.status(400).json({ message: 'Already applied' });

    // 3. Create the Application record
    const newApp = new Application({
      scholarshipId,
      studentId: user._id,
      adminId: scholarship.adminId,
      status: 'Applied'
    });
    const savedApp = await newApp.save();

    // 4. Update User & Get the fresh list of appliedScholarships
    const updatedUser = await User.findByIdAndUpdate(
      user._id, 
      { $addToSet: { appliedScholarships: scholarshipId } },
      { new: true } // Return the document after update
    );

    // 5. Return everything the frontend needs
    res.status(200).json({ 
      message: 'Applied successfully',
      application: savedApp, // Sending the real DB object (with _id)
      appliedScholarships: updatedUser?.appliedScholarships || [] // Updated list
    });

  } catch (error: any) {
    console.error("Apply Logic Error:", error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Admin View
export const getAdminApplications = async (req: Request, res: Response) => {
  try {
    const adminId = (req as any).user._id;
    
    const apps = await Application.find({ adminId })
      // ADD THE FIELDS HERE: college, cgpa, class12Marks, and studentCustomId (or whatever your UID field is named)
      .populate('studentId', 'name currentDegree highestDegree college cgpa class12Marks') 
      .populate('scholarshipId', 'name')
      .sort({ createdAt: -1 });

    res.json(apps);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// Update Application Status 
export const updateApplicationStatus = async (req: Request, res: Response) => {
  try {
    const { applicationId, status } = req.body;
    const updated = await Application.findByIdAndUpdate(
      applicationId,
      { status },
      { new: true }
    );
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};