
import { Request, Response } from 'express';
import Scholarship from '../models/Scholarship';
import Notification from '../models/Notification';
import User from '../models/User';
import Application from '../models/Application';

// Get scholarships 
export const getScholarships = async (req: Request, res: Response) => {
  try {
    const { adminId } = req.query;
    let query = {};

    if (adminId && adminId !== 'undefined') {
      query = { adminId: adminId };
    }

    const scholarships = await Scholarship.find(query).sort({ createdAt: -1 });
    res.status(200).json(scholarships);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching data' });
  }
};

// Apply to Scholarship
export const applyToScholarship = async (req: Request, res: Response) => {
  try {
    const { scholarshipId } = req.body;
    const user = (req as any).user;

    // Find scholarship to get adminId
    const scholarship = await Scholarship.findById(scholarshipId);
    if (!scholarship) return res.status(404).json({ message: 'Scholarship not found' });

    // Check if already applied
    const existing = await Application.findOne({ scholarshipId, studentId: user._id });
    if (existing) return res.status(400).json({ message: 'Already applied' });

    // Create the Application record
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

//get updated applications 
export const getMyApplications = async (req: any, res: Response) => {
  try {
    const studentId = req.user?._id || req.user?.id;

    if (!studentId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const applications = await Application.find({ studentId })
      .populate('scholarshipId', 'name provider amount');

    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// Admin View
export const addScholarship = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const { name, provider, amount, deadline, category, gpaRequirement, degreeLevel, description, eligibility, officialUrl } = req.body;

    const newScholarship = new Scholarship({
      name,
      provider,
      amount: Number(amount),
      gpaRequirement: Number(gpaRequirement),
      deadline: new Date(deadline),
      category: category || 'Merit',
      degreeLevel,
      description,
      eligibility,
      officialUrl,
      adminId: user._id
    });

    const matchingStudents = await User.find({
    role: 'student',
    currentDegree: newScholarship.degreeLevel 
  });

  const notifications = matchingStudents.map(student => ({
    recipientId: student._id,
    title: 'New Match Found!',
    message: `A new scholarship "${newScholarship.name}" matches your profile.`,
    type: 'MATCH'
  }));

    await Notification.insertMany(notifications);
    const savedScholarship = await newScholarship.save();
    res.status(201).json(savedScholarship);
  } catch (error: any) {
    res.status(400).json({ message: error.message || 'Invalid Data' });
  }
};

export const getAdminApplications = async (req: Request, res: Response) => {
  try {
    const adminId = (req as any).user._id;
    const apps = await Application.find({ adminId })
      .populate('studentId', 'name currentDegree highestDegree college cgpa class12Marks')
      .populate('scholarshipId', 'name')
      .sort({ createdAt: -1 })
      .lean();

    res.json(apps);

  } catch (error) {
    console.error("Fetch Error:", error);
    res.status(500).json({ message: 'Server Error' });
  }
};

export const updateApplicationStatus = async (req: Request, res: Response) => {
  try {
    const { applicationId, status } = req.body;

    const updated = await Application.findByIdAndUpdate(
      applicationId,
      { status },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: 'Application not found' });
    }

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};



export const deleteScholarship = async (req: Request, res: Response) => {
  try {
    const { id } = req.params; 
    const user = (req as any).user;

    const scholarship = await Scholarship.findById(id);

    if (!scholarship) {
      return res.status(404).json({ message: "Scholarship not found" });
    }

    if (scholarship.adminId.toString() !== user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to delete this scholarship" });
    }

    await Application.deleteMany({ scholarshipId: id });

    await Scholarship.findByIdAndDelete(id);

    res.status(200).json({ 
      message: "Scholarship and all associated applications deleted successfully" 
    });
  } catch (error: any) {
    console.error("Delete Error:", error);
    res.status(500).json({ message: error.message || "Server Error" });
  }
};
