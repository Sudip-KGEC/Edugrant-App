import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  role: 'student' | 'admin';
  // Student 
  college?: string;
  cgpa?: number;
  class12Marks?: number;
  highestDegree?: string;
  currentDegree?: string;
  fieldOfStudy?: string;
  // Admin
  organization?: string;
  department?: string;
  designation?: string;
  employeeId?: string;
  
  appliedScholarships: string[];
}

const UserSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  role: { type: String, enum: ['student', 'admin'], default: 'student' },
  
  // Student Fields 
  college: { type: String },
  cgpa: { type: Number },
  class12Marks: { type: Number },
  highestDegree: { type: String },
  currentDegree: { type: String },
  fieldOfStudy: { type: String, default: 'General' },

  // Admin Fields 
  organization: { type: String },
  department: { type: String },
  designation: { type: String },
  employeeId: { type: String },

  appliedScholarships: { type: [String], default: [] },
}, { timestamps: true });

export default mongoose.model<IUser>('User', UserSchema);