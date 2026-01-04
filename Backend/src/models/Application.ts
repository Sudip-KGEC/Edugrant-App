import mongoose, { Document, Schema } from 'mongoose';

export interface IApplication extends Document {
  scholarshipId: mongoose.Types.ObjectId;
  studentId: mongoose.Types.ObjectId;
  adminId: mongoose.Types.ObjectId; 
  status: 'Applied' | 'Under Review' | 'Accepted' | 'Rejected';
  appliedAt: Date;
}

const ApplicationSchema: Schema = new Schema({
  scholarshipId: { type: Schema.Types.ObjectId, ref: 'Scholarship', required: true },
  studentId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  adminId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  status: { 
    type: String, 
    enum: ['Applied', 'Under Review', 'Accepted', 'Rejected'], 
    default: 'Applied' 
  },
  appliedAt: { type: Date, default: Date.now }
});

export default mongoose.model<IApplication>('Application', ApplicationSchema);