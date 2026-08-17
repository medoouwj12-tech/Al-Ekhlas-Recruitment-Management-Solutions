import mongoose, { Schema, Document, Model } from "mongoose";
import { CandidateStatus, ExperienceLevel, IndustryCategory } from "../types";

export interface ICandidateDocument extends Document {
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
  noticePeriod: "immediate" | "15_days" | "1_month" | "2_months" | "3_months";
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
  rating: number;
  submittedAt: string;
  updatedAt: string;
  hrNotes?: string;
  matchedEmployerIds: string[];
}

const CandidateSchema = new Schema<ICandidateDocument>(
  {
    id: { type: String, required: true, unique: true, index: true },
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    city: { type: String, required: true },
    country: { type: String, default: "المملكة العربية السعودية" },
    category: { type: String, required: true },
    currentTitle: { type: String, required: true },
    targetTitle: { type: String, required: true },
    yearsOfExperience: { type: Number, required: true },
    experienceLevel: { type: String, required: true },
    education: { type: String, required: true },
    currentCompany: { type: String, default: "" },
    noticePeriod: { type: String, default: "1_month" },
    expectedSalary: { type: Number, required: true },
    currentSalary: { type: Number, default: 0 },
    currency: { type: String, default: "SAR" },
    skills: { type: [String], default: [] },
    languages: { type: [String], default: ["العربية", "الإنجليزية"] },
    summary: { type: String, required: true },
    resumeFileName: { type: String, default: "Candidate_CV.pdf" },
    resumeFileSize: { type: String, default: "1.2 MB" },
    portfolioUrl: { type: String, default: "" },
    linkedinUrl: { type: String, default: "" },
    githubUrl: { type: String, default: "" },
    status: {
      type: String,
      enum: ["available", "under_review", "shortlisted", "interviewed", "placed", "archived"],
      default: "available",
    },
    rating: { type: Number, default: 5 },
    submittedAt: { type: String, default: () => new Date().toISOString() },
    updatedAt: { type: String, default: () => new Date().toISOString() },
    hrNotes: { type: String, default: "" },
    matchedEmployerIds: { type: [String], default: [] },
  },
  { timestamps: true }
);

export const CandidateModel: Model<ICandidateDocument> =
  mongoose.models.Candidate ||
  mongoose.model<ICandidateDocument>("Candidate", CandidateSchema);
