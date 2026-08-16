"use client";

import React, { useState } from "react";
import { useRecruitment } from "@/context/RecruitmentContext";
import { useLanguage } from "@/context/LanguageContext";
import { ExperienceLevel, IndustryCategory } from "@/lib/types";
import { 
  User, 
  Briefcase, 
  FileText, 
  Upload, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  Sparkles,
  Check,
  Globe,
  Link2
} from "lucide-react";
import confetti from "canvas-confetti";
import Link from "next/link";

interface CandidateFormProps {
  onSuccessRedirect?: boolean;
}

export const CandidateForm: React.FC<CandidateFormProps> = ({ onSuccessRedirect = false }) => {
  const { addCandidate } = useRecruitment();
  const { t, language, dir } = useLanguage();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [createdCandId, setCreatedCandId] = useState<string>("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Form State
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    city: "",
    country: "المملكة العربية السعودية",
    category: "technology" as IndustryCategory,
    currentTitle: "",
    targetTitle: "",
    yearsOfExperience: 5,
    experienceLevel: "senior" as ExperienceLevel,
    education: "",
    currentCompany: "",
    noticePeriod: "1_month" as "immediate" | "15_days" | "1_month" | "2_months" | "3_months",
    expectedSalary: 20000,
    currentSalary: 16000,
    currency: "SAR",
    skills: "",
    languages: ["العربية", "الإنجليزية"],
    summary: "",
    resumeFileName: "",
    resumeFileSize: "",
    portfolioUrl: "",
    linkedinUrl: "",
    githubUrl: "",
  });

  const categories: { key: IndustryCategory; label: string }[] = [
    { key: "technology", label: t("ind_technology") },
    { key: "engineering", label: t("ind_engineering") },
    { key: "healthcare", label: t("ind_healthcare") },
    { key: "finance_banking", label: t("ind_finance_banking") },
    { key: "marketing_sales", label: t("ind_marketing_sales") },
    { key: "hr_admin", label: t("ind_hr_admin") },
    { key: "executive_leadership", label: t("ind_executive_leadership") },
    { key: "operations_logistics", label: t("ind_operations_logistics") },
    { key: "legal", label: t("ind_legal") },
  ];

  // Validation
  const validateStep = (currentStep: number): boolean => {
    const errs: Record<string, string> = {};

    if (currentStep === 1) {
      if (!formData.fullName.trim()) errs.fullName = language === "ar" ? "الاسم الكامل مطلوب" : "Full name is required";
      if (!formData.email.trim() || !formData.email.includes("@")) errs.email = language === "ar" ? "بريد إلكتروني صحيح مطلوب" : "Valid email is required";
      if (!formData.phone.trim()) errs.phone = language === "ar" ? "رقم الهاتف / واتساب مطلوب" : "Phone number is required";
      if (!formData.city.trim()) errs.city = language === "ar" ? "المدينة مطلوبة" : "City is required";
    }

    if (currentStep === 2) {
      if (!formData.currentTitle.trim()) errs.currentTitle = language === "ar" ? "المسمى الحالي مطلوب" : "Current title is required";
      if (!formData.targetTitle.trim()) errs.targetTitle = language === "ar" ? "المسمى المستهدف مطلوب" : "Target title is required";
      if (!formData.education.trim()) errs.education = language === "ar" ? "المؤهل التعليمي مطلوب" : "Education is required";
      if (formData.expectedSalary <= 0) errs.expectedSalary = language === "ar" ? "الراتب المتوقع غير صحيح" : "Invalid salary";
    }

    if (currentStep === 3) {
      if (!formData.skills.trim()) errs.skills = language === "ar" ? "يرجى كتابة أهم مهاراتك" : "Please list your primary skills";
      if (!formData.summary.trim() || formData.summary.length < 15) {
        errs.summary = language === "ar" ? "يرجى كتابة نبذة مهنية موجزة (15 حرف على الأقل)" : "Please provide a brief professional summary";
      }
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep((prev) => (prev < 3 ? (prev + 1 as any) : prev));
    }
  };

  const handlePrev = () => {
    setStep((prev) => (prev > 1 ? (prev - 1 as any) : prev));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        resumeFileName: file.name,
        resumeFileSize: (file.size / (1024 * 1024)).toFixed(1) + " MB",
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep(3)) return;

    setIsSubmitting(true);

    setTimeout(() => {
      const skillsArray = formData.skills
        ? formData.skills.split(/[,،]+/).map((s) => s.trim()).filter(Boolean)
        : ["Teamwork", "Problem Solving"];

      // Derive experience level from years
      let expLevel: ExperienceLevel = "mid";
      if (formData.yearsOfExperience <= 2) expLevel = "junior";
      else if (formData.yearsOfExperience <= 5) expLevel = "mid";
      else if (formData.yearsOfExperience <= 9) expLevel = "senior";
      else expLevel = "lead";

      const newId = addCandidate({
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        city: formData.city,
        country: formData.country,
        category: formData.category,
        currentTitle: formData.currentTitle,
        targetTitle: formData.targetTitle,
        yearsOfExperience: Number(formData.yearsOfExperience),
        experienceLevel: expLevel,
        education: formData.education,
        currentCompany: formData.currentCompany,
        noticePeriod: formData.noticePeriod,
        expectedSalary: Number(formData.expectedSalary),
        currentSalary: Number(formData.currentSalary),
        currency: formData.currency,
        skills: skillsArray,
        languages: formData.languages,
        summary: formData.summary,
        resumeFileName: formData.resumeFileName || "Candidate_CV.pdf",
        resumeFileSize: formData.resumeFileSize || "1.1 MB",
        portfolioUrl: formData.portfolioUrl,
        linkedinUrl: formData.linkedinUrl,
        githubUrl: formData.githubUrl,
        hrNotes: "ملف تم تقديمه عبر بوابة الكفاءات بالموقع. مؤهل وجاهز للمطابقة.",
      });

      setCreatedCandId(newId);
      setIsSubmitting(false);
      setSuccessModalOpen(true);

      // Celebration Confetti
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch {}
    }, 800);
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Wizard Header & Progress */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">
            {language === "ar" ? `الخطوة ${step} من 3` : `Step ${step} of 3`}
          </span>
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            {step === 1 && t("stepPersonalInfo")}
            {step === 2 && t("stepCareerProfile")}
            {step === 3 && t("stepCvPortfolio")}
          </span>
        </div>

        {/* Step Indicator Bars */}
        <div className="grid grid-cols-3 gap-2">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`h-2 rounded-full transition-all duration-500 ${
                step >= s
                  ? "bg-gradient-to-r from-brand-600 to-indigo-600 shadow-sm"
                  : "bg-slate-200 dark:bg-slate-800"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Main Form Card */}
      <div className="glass-panel p-6 sm:p-10 rounded-2xl shadow-xl bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* STEP 1: Personal Details */}
          {step === 1 && (
            <div className="space-y-5 animate-in fade-in duration-300">
              <div className="border-b border-slate-200 dark:border-slate-800 pb-3">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <User className="w-5 h-5 text-brand-500" />
                  <span>{t("stepPersonalInfo")}</span>
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Full Name */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    {t("fullNameLabel")}
                  </label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder={t("fullNamePlaceholder")}
                    className={`w-full px-4 py-2.5 rounded-xl text-sm bg-slate-50 dark:bg-slate-800/80 border ${
                      errors.fullName ? "border-rose-500" : "border-slate-300 dark:border-slate-700"
                    } text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all`}
                  />
                  {errors.fullName && <p className="text-xs text-rose-500 mt-1">{errors.fullName}</p>}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    {t("candidateEmailLabel")}
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder={t("candidateEmailPlaceholder")}
                    dir="ltr"
                    className={`w-full px-4 py-2.5 rounded-xl text-sm bg-slate-50 dark:bg-slate-800/80 border ${
                      errors.email ? "border-rose-500" : "border-slate-300 dark:border-slate-700"
                    } text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all`}
                  />
                  {errors.email && <p className="text-xs text-rose-500 mt-1">{errors.email}</p>}
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    {t("candidatePhoneLabel")}
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder={t("candidatePhonePlaceholder")}
                    dir="ltr"
                    className={`w-full px-4 py-2.5 rounded-xl text-sm bg-slate-50 dark:bg-slate-800/80 border ${
                      errors.phone ? "border-rose-500" : "border-slate-300 dark:border-slate-700"
                    } text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all`}
                  />
                  {errors.phone && <p className="text-xs text-rose-500 mt-1">{errors.phone}</p>}
                </div>

                {/* City & Country */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    {t("cityCountryLabel")}
                  </label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder={t("cityCountryPlaceholder")}
                    className={`w-full px-4 py-2.5 rounded-xl text-sm bg-slate-50 dark:bg-slate-800/80 border ${
                      errors.city ? "border-rose-500" : "border-slate-300 dark:border-slate-700"
                    } text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all`}
                  />
                  {errors.city && <p className="text-xs text-rose-500 mt-1">{errors.city}</p>}
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Career Profile */}
          {step === 2 && (
            <div className="space-y-5 animate-in fade-in duration-300">
              <div className="border-b border-slate-200 dark:border-slate-800 pb-3">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-brand-500" />
                  <span>{t("stepCareerProfile")}</span>
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Specialization Category */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    {t("categoryLabel")}
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                    className="w-full px-4 py-2.5 rounded-xl text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all"
                  >
                    {categories.map((cat) => (
                      <option key={cat.key} value={cat.key}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Current Title */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    {t("currentTitleLabel")}
                  </label>
                  <input
                    type="text"
                    value={formData.currentTitle}
                    onChange={(e) => setFormData({ ...formData, currentTitle: e.target.value })}
                    placeholder={t("currentTitlePlaceholder")}
                    className={`w-full px-4 py-2.5 rounded-xl text-sm bg-slate-50 dark:bg-slate-800/80 border ${
                      errors.currentTitle ? "border-rose-500" : "border-slate-300 dark:border-slate-700"
                    } text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all`}
                  />
                  {errors.currentTitle && <p className="text-xs text-rose-500 mt-1">{errors.currentTitle}</p>}
                </div>

                {/* Target Title */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    {t("targetTitleLabel")}
                  </label>
                  <input
                    type="text"
                    value={formData.targetTitle}
                    onChange={(e) => setFormData({ ...formData, targetTitle: e.target.value })}
                    placeholder={t("targetTitlePlaceholder")}
                    className={`w-full px-4 py-2.5 rounded-xl text-sm bg-slate-50 dark:bg-slate-800/80 border ${
                      errors.targetTitle ? "border-rose-500" : "border-slate-300 dark:border-slate-700"
                    } text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all`}
                  />
                  {errors.targetTitle && <p className="text-xs text-rose-500 mt-1">{errors.targetTitle}</p>}
                </div>

                {/* Years Experience */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    {t("yearsExpLabel")}
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="40"
                    value={formData.yearsOfExperience}
                    onChange={(e) => setFormData({ ...formData, yearsOfExperience: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 rounded-xl text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all"
                  />
                </div>

                {/* Notice Period */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    {t("noticePeriodLabel")}
                  </label>
                  <select
                    value={formData.noticePeriod}
                    onChange={(e) => setFormData({ ...formData, noticePeriod: e.target.value as any })}
                    className="w-full px-4 py-2.5 rounded-xl text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all"
                  >
                    <option value="immediate">{t("noticeImmediate")}</option>
                    <option value="15_days">{t("notice15Days")}</option>
                    <option value="1_month">{t("notice1Month")}</option>
                    <option value="2_months">{t("notice2Months")}</option>
                    <option value="3_months">{t("notice3Months")}</option>
                  </select>
                </div>

                {/* Education */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    {t("educationLabel")}
                  </label>
                  <input
                    type="text"
                    value={formData.education}
                    onChange={(e) => setFormData({ ...formData, education: e.target.value })}
                    placeholder={t("educationPlaceholder")}
                    className={`w-full px-4 py-2.5 rounded-xl text-sm bg-slate-50 dark:bg-slate-800/80 border ${
                      errors.education ? "border-rose-500" : "border-slate-300 dark:border-slate-700"
                    } text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all`}
                  />
                  {errors.education && <p className="text-xs text-rose-500 mt-1">{errors.education}</p>}
                </div>

                {/* Expected Salary */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    {t("expectedSalaryLabel")}
                  </label>
                  <input
                    type="number"
                    step="1000"
                    value={formData.expectedSalary}
                    onChange={(e) => setFormData({ ...formData, expectedSalary: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 rounded-xl text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all"
                  />
                </div>

                {/* Current Company */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    {t("currentCompanyLabel")}
                  </label>
                  <input
                    type="text"
                    value={formData.currentCompany}
                    onChange={(e) => setFormData({ ...formData, currentCompany: e.target.value })}
                    placeholder={t("currentCompanyPlaceholder")}
                    className="w-full px-4 py-2.5 rounded-xl text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Skills, Summary, Upload CV & Social */}
          {step === 3 && (
            <div className="space-y-5 animate-in fade-in duration-300">
              <div className="border-b border-slate-200 dark:border-slate-800 pb-3">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <FileText className="w-5 h-5 text-brand-500" />
                  <span>{t("stepCvPortfolio")}</span>
                </h3>
              </div>

              {/* Skills */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  {t("skillsLabel")}
                </label>
                <input
                  type="text"
                  value={formData.skills}
                  onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                  placeholder={t("skillsPlaceholder")}
                  className={`w-full px-4 py-2.5 rounded-xl text-sm bg-slate-50 dark:bg-slate-800/80 border ${
                    errors.skills ? "border-rose-500" : "border-slate-300 dark:border-slate-700"
                  } text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all`}
                />
                {errors.skills && <p className="text-xs text-rose-500 mt-1">{errors.skills}</p>}
              </div>

              {/* Summary */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  {t("professionalSummaryLabel")}
                </label>
                <textarea
                  rows={3}
                  value={formData.summary}
                  onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                  placeholder={t("professionalSummaryPlaceholder")}
                  className={`w-full px-4 py-3 rounded-xl text-sm bg-slate-50 dark:bg-slate-800/80 border ${
                    errors.summary ? "border-rose-500" : "border-slate-300 dark:border-slate-700"
                  } text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all`}
                />
                {errors.summary && <p className="text-xs text-rose-500 mt-1">{errors.summary}</p>}
              </div>

              {/* CV Upload */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  {t("uploadCVLabel")}
                </label>
                <div className="relative border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-brand-500 dark:hover:border-brand-500 rounded-2xl p-6 text-center transition-all bg-slate-50/50 dark:bg-slate-800/30">
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Upload className="w-8 h-8 text-brand-500" />
                    {formData.resumeFileName ? (
                      <div className="flex items-center gap-2 text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                        <Check className="w-4 h-4" />
                        <span>
                          {formData.resumeFileName} ({formData.resumeFileSize})
                        </span>
                      </div>
                    ) : (
                      <>
                        <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                          {language === "ar" ? "اضغط هنا لرفع السيرة الذاتية (PDF)" : "Click here to upload CV (PDF)"}
                        </p>
                        <p className="text-xs text-slate-400">PDF, DOCX up to 10MB</p>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Links */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                    <Link2 className="w-3.5 h-3.5 text-blue-500" />
                    <span>{t("linkedinUrlLabel")}</span>
                  </label>
                  <input
                    type="url"
                    value={formData.linkedinUrl}
                    onChange={(e) => setFormData({ ...formData, linkedinUrl: e.target.value })}
                    placeholder="https://linkedin.com/in/username"
                    dir="ltr"
                    className="w-full px-3.5 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-emerald-500" />
                    <span>{t("portfolioUrlLabel")}</span>
                  </label>
                  <input
                    type="url"
                    value={formData.portfolioUrl}
                    onChange={(e) => setFormData({ ...formData, portfolioUrl: e.target.value })}
                    placeholder="https://myportfolio.com"
                    dir="ltr"
                    className="w-full px-3.5 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Navigation Controls */}
          <div className="flex items-center justify-between pt-6 border-t border-slate-200 dark:border-slate-800">
            {step > 1 ? (
              <button
                type="button"
                onClick={handlePrev}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                {dir === "rtl" ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
                <span>{t("previous")}</span>
              </button>
            ) : (
              <div />
            )}

            {step < 3 ? (
              <button
                type="button"
                onClick={handleNext}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-brand-600 hover:bg-brand-500 shadow-md shadow-brand-500/25 transition-all"
              >
                <span>{t("next")}</span>
                {dir === "rtl" ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
              </button>
            ) : (
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 px-7 py-3 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-lg shadow-emerald-500/25 transition-all disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>{t("submittingBtn")}</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>{t("submitCandidateBtn")}</span>
                  </>
                )}
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Success Modal */}
      {successModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-lg p-6 sm:p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-6 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-mono text-brand-600 dark:text-brand-400 font-bold px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 inline-block">
                {createdCandId}
              </span>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                {t("modalSuccessTitle")}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {t("modalSuccessCandidateDesc")}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => {
                  setSuccessModalOpen(false);
                  setStep(1);
                }}
                className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                {t("modalSuccessClose")}
              </button>
              <Link
                href="/admin/candidates"
                className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-brand-600 hover:bg-brand-500 flex items-center justify-center gap-1.5 shadow-md shadow-brand-500/20"
              >
                <span>{t("modalSuccessViewAdmin")}</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
