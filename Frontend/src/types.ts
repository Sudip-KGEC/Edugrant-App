export type Language = 'en' | 'hi' | 'bn' | 'ta' | 'or' | 'ml';

export interface User {
  id?: string;             
  email: string;
  name: string;
  college?: string;
  cgpa?: number;
  class12Marks?: number;
  role: 'student' | 'admin'; 
  isRegistered: boolean;
  highestDegree?: string; 
  currentDegree?: string;  
  fieldOfStudy?: string;
  organization?: string;
  department?: string;
  designation?: string;
  employeeId?: string;
  appliedScholarships?: string[];

}

 export interface ScholarshipForm {
  name: string;
  provider: string;
  amount: string | number;
  deadline: string;        
  category: string;
  gpaRequirement: string | number; 
  degreeLevel: string;    
  description: string;
  eligibility: string[];
  officialUrl?: string; 
  adminId: string; 
}


export type ApplicationStatus = 'Applied' | 'Under Review' | 'Accepted' | 'Rejected';

export interface Application {
  id: string;
  scholarshipId: string;
  scholarshipName: string;
  adminId: string;
  userEmail: string;
  dateApplied: string;
  status: ApplicationStatus;
  studentName: string;
  currentDegree: string;
  completedDegree: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

// This matches what the Google Gemini API expects for history
export interface GeminiHistoryItem {
  role: string;
  parts: { text: string }[];
}