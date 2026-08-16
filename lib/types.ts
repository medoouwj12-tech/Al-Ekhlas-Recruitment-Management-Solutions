export type Language = 'ar' | 'en';
export type Theme = 'dark' | 'light';

export type JobType = 'full-time' | 'part-time' | 'remote' | 'contract';
export type ExperienceLevel = 'junior' | 'mid' | 'senior' | 'executive' | 'lead';
export type RequestStatus = 'new' | 'in_progress' | 'shortlisting' | 'interviewing' | 'completed' | 'cancelled';
export type CandidateStatus = 'available' | 'under_review' | 'shortlisted' | 'interviewed' | 'placed' | 'archived';
export type IndustryCategory = 
  | 'technology' 
  | 'engineering' 
  | 'healthcare' 
  | 'finance_banking' 
  | 'marketing_sales' 
  | 'hr_admin' 
  | 'executive_leadership' 
  | 'operations_logistics'
  | 'legal';

export interface EmployerRequest {
  id: string;
  companyName: string;
  industry: IndustryCategory;
  contactPerson: string;
  email: string;
  phone: string;
  website?: string;
  linkedin?: string;
  city: string;
  country: string;
  jobTitle: string;
  jobType: JobType;
  experienceLevel: ExperienceLevel;
  minSalary: number;
  maxSalary: number;
  currency: string;
  numberOfOpenings: number;
  jobDescription: string;
  requiredSkills: string[];
  qualifications: string;
  status: RequestStatus;
  urgency: 'normal' | 'high' | 'urgent';
  submittedAt: string;
  updatedAt: string;
  assignedCandidateIds: string[];
  notes?: string;
  fileName?: string;
  fileSize?: string;
}

export interface Candidate {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  city: string;
  country: string;
  category: IndustryCategory;
  currentTitle: string;
  targetTitle: string;
  yearsOfExperience: number;
  experienceLevel: ExperienceLevel;
  education: string;
  currentCompany?: string;
  noticePeriod: 'immediate' | '15_days' | '1_month' | '2_months' | '3_months';
  expectedSalary: number;
  currentSalary?: number;
  currency: string;
  skills: string[];
  languages: string[];
  summary: string;
  resumeFileName?: string;
  resumeFileSize?: string;
  portfolioUrl?: string;
  linkedinUrl?: string;
  githubUrl?: string;
  status: CandidateStatus;
  rating: number; // 1 to 5
  submittedAt: string;
  updatedAt: string;
  hrNotes?: string;
  matchedEmployerIds?: string[];
}

export interface MatchScore {
  candidateId: string;
  jobId: string;
  overallScore: number; // 0 - 100
  breakdown: {
    skillsMatch: number;
    experienceMatch: number;
    salaryMatch: number;
    categoryMatch: number;
  };
  matchedSkills: string[];
  missingSkills: string[];
}

export interface NotificationItem {
  id: string;
  title: string;
  titleEn: string;
  message: string;
  messageEn: string;
  type: 'employer_request' | 'candidate_applied' | 'status_change' | 'match_created';
  createdAt: string;
  read: boolean;
  link?: string;
}

export interface ShortlistExport {
  orderId: string;
  orderTitle: string;
  companyName: string;
  createdDate: string;
  candidates: Candidate[];
  notes?: string;
}
