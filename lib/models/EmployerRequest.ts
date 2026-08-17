import mongoose, { Schema, Document, Model } from "mongoose";
import { ExperienceLevel, IndustryCategory, JobType, RequestStatus } from "../types";

export interface IEmployerRequestDocument extends Document {
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
  qualifications?: string;
  status: RequestStatus;
  urgency: "normal" | "high" | "urgent";
  submittedAt: string;
  updatedAt: string;
  assignedCandidateIds: string[];
  notes?: string;
  fileName?: string;
  fileSize?: string;
}

const EmployerRequestSchema = new Schema<IEmployerRequestDocument>(
  {
    id: { type: String, required: true, unique: true, index: true },
    companyName: { type: String, required: true },
    industry: { type: String, required: true },
    contactPerson: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    website: { type: String, default: "" },
    linkedin: { type: String, default: "" },
    city: { type: String, required: true },
    country: { type: String, default: "المملكة العربية السعودية" },
    jobTitle: { type: String, required: true },
    jobType: { type: String, required: true },
    experienceLevel: { type: String, required: true },
    minSalary: { type: Number, required: true },
    maxSalary: { type: Number, required: true },
    currency: { type: String, default: "SAR" },
    numberOfOpenings: { type: Number, default: 1 },
    jobDescription: { type: String, required: true },
    requiredSkills: { type: [String], default: [] },
    qualifications: { type: String, default: "" },
    status: { 
      type: String, 
      enum: ["new", "in_progress", "shortlisting", "interviewing", "completed", "cancelled"], 
      default: "new" 
    },
    urgency: { type: String, enum: ["normal", "high", "urgent"], default: "normal" },
    submittedAt: { type: String, default: () => new Date().toISOString() },
    updatedAt: { type: String, default: () => new Date().toISOString() },
    assignedCandidateIds: { type: [String], default: [] },
    notes: { type: String, default: "" },
    fileName: { type: String, default: "" },
    fileSize: { type: String, default: "" },
  },
  { timestamps: true }
);

export const EmployerRequestModel: Model<IEmployerRequestDocument> =
  mongoose.models.EmployerRequest ||
  mongoose.model<IEmployerRequestDocument>("EmployerRequest", EmployerRequestSchema);
