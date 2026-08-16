"use client";

import React, { useState } from "react";
import { useRecruitment } from "@/context/RecruitmentContext";
import { useLanguage } from "@/context/LanguageContext";
import { EmployerRequest, ExperienceLevel, IndustryCategory, JobType } from "@/lib/types";
import { 
  Building2, 
  Briefcase, 
  Upload, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  FileText, 
  Sparkles,
  AlertCircle,
  Clock,
  Zap,
  Check
} from "lucide-react";
import confetti from "canvas-confetti";
import Link from "next/link";

interface EmployerFormProps {
  onSuccessRedirect?: boolean;
}

export const EmployerForm: React.FC<EmployerFormProps> = ({ onSuccessRedirect = false }) => {
  const { addEmployerRequest } = useRecruitment();
  const { t, language, dir } = useLanguage();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [createdOrderId, setCreatedOrderId] = useState<string>("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Form State
  const [formData, setFormData] = useState({
    companyName: "",
    industry: "technology" as IndustryCategory,
    contactPerson: "",
    email: "",
    phone: "",
    website: "",
    city: "",
    country: "المملكة العربية السعودية",
    jobTitle: "",
    jobType: "full-time" as JobType,
    experienceLevel: "senior" as ExperienceLevel,
    minSalary: 15000,
    maxSalary: 25000,
    currency: "SAR",
    numberOfOpenings: 1,
    jobDescription: "",
    requiredSkills: "",
    qualifications: "",
    urgency: "high" as "normal" | "high" | "urgent",
    fileName: "",
    fileSize: "",
  });

  const industries: { key: IndustryCategory; label: string }[] = [
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

  const jobTypes: { key: JobType; label: string }[] = [
    { key: "full-time", label: t("type_full_time") },
    { key: "remote", label: t("type_remote") },
    { key: "part-time", label: t("type_part_time") },
    { key: "contract", label: t("type_contract") },
  ];

  const expLevels: { key: ExperienceLevel; label: string }[] = [
    { key: "junior", label: t("exp_junior") },
    { key: "mid", label: t("exp_mid") },
    { key: "senior", label: t("exp_senior") },
    { key: "lead", label: t("exp_lead") },
    { key: "executive", label: t("exp_executive") },
  ];

  // Validation
  const validateStep = (currentStep: number): boolean => {
    const errs: Record<string, string> = {};

    if (currentStep === 1) {
      if (!formData.companyName.trim()) errs.companyName = language === "ar" ? "اسم الشركة مطلوب" : "Company name is required";
      if (!formData.contactPerson.trim()) errs.contactPerson = language === "ar" ? "اسم مسؤول التواصل مطلوب" : "Contact person name is required";
      if (!formData.email.trim() || !formData.email.includes("@")) errs.email = language === "ar" ? "بريد إلكتروني صحيح مطلوب" : "Valid email is required";
      if (!formData.phone.trim()) errs.phone = language === "ar" ? "رقم الهاتف مطلوب" : "Phone number is required";
      if (!formData.city.trim()) errs.city = language === "ar" ? "المدينة مطلوبة" : "City is required";
    }

    if (currentStep === 2) {
      if (!formData.jobTitle.trim()) errs.jobTitle = language === "ar" ? "المسمى الوظيفي مطلوب" : "Job title is required";
      if (formData.minSalary <= 0) errs.minSalary = language === "ar" ? "الحد الأدنى غير صحيح" : "Invalid min salary";
      if (formData.maxSalary < formData.minSalary) errs.maxSalary = language === "ar" ? "الحد الأقصى يجب أن يكون أكبر" : "Max salary must be greater than min";
    }

    if (currentStep === 3) {
      if (!formData.jobDescription.trim() || formData.jobDescription.length < 20) {
        errs.jobDescription = language === "ar" ? "يرجى كتابة وصف وظيفي واضح (20 حرف على الأقل)" : "Please provide a job description (at least 20 chars)";
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
        fileName: file.name,
        fileSize: (file.size / (1024 * 1024)).toFixed(1) + " MB",
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep(3)) return;

    setIsSubmitting(true);

    setTimeout(() => {
      const skillsArray = formData.requiredSkills
        ? formData.requiredSkills.split(/[,،]+/).map((s) => s.trim()).filter(Boolean)
        : ["Communication", "Problem Solving"];

      const newId = addEmployerRequest({
        companyName: formData.companyName,
        industry: formData.industry,
        contactPerson: formData.contactPerson,
        email: formData.email,
        phone: formData.phone,
        website: formData.website,
        city: formData.city,
        country: formData.country,
        jobTitle: formData.jobTitle,
        jobType: formData.jobType,
        experienceLevel: formData.experienceLevel,
        minSalary: Number(formData.minSalary),
        maxSalary: Number(formData.maxSalary),
        currency: formData.currency,
        numberOfOpenings: Number(formData.numberOfOpenings),
        jobDescription: formData.jobDescription,
        requiredSkills: skillsArray,
        qualifications: formData.qualifications,
        urgency: formData.urgency,
        fileName: formData.fileName || "JD_Spec.pdf",
        fileSize: formData.fileSize || "1.2 MB",
      });

      setCreatedOrderId(newId);
      setIsSubmitting(false);
      setSuccessModalOpen(true);

      // Trigger Celebration Confetti
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
            {step === 1 && t("stepCompanyInfo")}
            {step === 2 && t("stepJobSpecs")}
            {step === 3 && t("stepRequirements")}
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

      {/* Main Form Box */}
      <div className="glass-panel p-6 sm:p-10 rounded-2xl shadow-xl bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* STEP 1: Company Profile */}
          {step === 1 && (
            <div className="space-y-5 animate-in fade-in duration-300">
              <div className="border-b border-slate-200 dark:border-slate-800 pb-3">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-brand-500" />
                  <span>{t("stepCompanyInfo")}</span>
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Company Name */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    {t("companyNameLabel")}
                  </label>
                  <input
                    type="text"
                    value={formData.companyName}
                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                    placeholder={t("companyNamePlaceholder")}
                    className={`w-full px-4 py-2.5 rounded-xl text-sm bg-slate-50 dark:bg-slate-800/80 border ${
                      errors.companyName ? "border-rose-500" : "border-slate-300 dark:border-slate-700"
                    } text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all`}
                  />
                  {errors.companyName && (
                    <p className="text-xs text-rose-500 mt-1">{errors.companyName}</p>
                  )}
                </div>

                {/* Industry Sector */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    {t("industryLabel")}
                  </label>
                  <select
                    value={formData.industry}
                    onChange={(e) => setFormData({ ...formData, industry: e.target.value as any })}
                    className="w-full px-4 py-2.5 rounded-xl text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all"
                  >
                    {industries.map((ind) => (
                      <option key={ind.key} value={ind.key}>
                        {ind.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Contact Person */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    {t("contactPersonLabel")}
                  </label>
                  <input
                    type="text"
                    value={formData.contactPerson}
                    onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                    placeholder={t("contactPersonPlaceholder")}
                    className={`w-full px-4 py-2.5 rounded-xl text-sm bg-slate-50 dark:bg-slate-800/80 border ${
                      errors.contactPerson ? "border-rose-500" : "border-slate-300 dark:border-slate-700"
                    } text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all`}
                  />
                  {errors.contactPerson && (
                    <p className="text-xs text-rose-500 mt-1">{errors.contactPerson}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    {t("emailLabel")}
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder={t("emailPlaceholder")}
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
                    {t("phoneLabel")}
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder={t("phonePlaceholder")}
                    dir="ltr"
                    className={`w-full px-4 py-2.5 rounded-xl text-sm bg-slate-50 dark:bg-slate-800/80 border ${
                      errors.phone ? "border-rose-500" : "border-slate-300 dark:border-slate-700"
                    } text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all`}
                  />
                  {errors.phone && <p className="text-xs text-rose-500 mt-1">{errors.phone}</p>}
                </div>

                {/* City & Country */}
                <div>
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

                {/* Website */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    {t("websiteLabel")}
                  </label>
                  <input
                    type="url"
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    placeholder={t("websitePlaceholder")}
                    dir="ltr"
                    className="w-full px-4 py-2.5 rounded-xl text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Job Specifications */}
          {step === 2 && (
            <div className="space-y-5 animate-in fade-in duration-300">
              <div className="border-b border-slate-200 dark:border-slate-800 pb-3">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-brand-500" />
                  <span>{t("stepJobSpecs")}</span>
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Job Title */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    {t("jobTitleNeededLabel")}
                  </label>
                  <input
                    type="text"
                    value={formData.jobTitle}
                    onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                    placeholder={t("jobTitleNeededPlaceholder")}
                    className={`w-full px-4 py-2.5 rounded-xl text-sm bg-slate-50 dark:bg-slate-800/80 border ${
                      errors.jobTitle ? "border-rose-500" : "border-slate-300 dark:border-slate-700"
                    } text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all`}
                  />
                  {errors.jobTitle && (
                    <p className="text-xs text-rose-500 mt-1">{errors.jobTitle}</p>
                  )}
                </div>

                {/* Job Type */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    {t("jobTypeLabel")}
                  </label>
                  <select
                    value={formData.jobType}
                    onChange={(e) => setFormData({ ...formData, jobType: e.target.value as any })}
                    className="w-full px-4 py-2.5 rounded-xl text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all"
                  >
                    {jobTypes.map((type) => (
                      <option key={type.key} value={type.key}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Experience Level */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    {t("experienceLevelLabel")}
                  </label>
                  <select
                    value={formData.experienceLevel}
                    onChange={(e) => setFormData({ ...formData, experienceLevel: e.target.value as any })}
                    className="w-full px-4 py-2.5 rounded-xl text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all"
                  >
                    {expLevels.map((exp) => (
                      <option key={exp.key} value={exp.key}>
                        {exp.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Number of Openings */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    {t("openingsCountLabel")}
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={formData.numberOfOpenings}
                    onChange={(e) => setFormData({ ...formData, numberOfOpenings: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 rounded-xl text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all"
                  />
                </div>

                {/* Urgency */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    {t("urgencyLabel")}
                  </label>
                  <select
                    value={formData.urgency}
                    onChange={(e) => setFormData({ ...formData, urgency: e.target.value as any })}
                    className="w-full px-4 py-2.5 rounded-xl text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all"
                  >
                    <option value="normal">{t("urgencyNormal")}</option>
                    <option value="high">{t("urgencyHigh")}</option>
                    <option value="urgent">{t("urgencyUrgent")}</option>
                  </select>
                </div>

                {/* Salary Range */}
                <div className="md:col-span-2 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-3">
                    {t("salaryRangeLabel")}
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-[11px] text-slate-500 block mb-1">{t("minSalaryLabel")}</span>
                      <input
                        type="number"
                        step="1000"
                        value={formData.minSalary}
                        onChange={(e) => setFormData({ ...formData, minSalary: Number(e.target.value) })}
                        className="w-full px-3.5 py-2 rounded-lg text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <span className="text-[11px] text-slate-500 block mb-1">{t("maxSalaryLabel")}</span>
                      <input
                        type="number"
                        step="1000"
                        value={formData.maxSalary}
                        onChange={(e) => setFormData({ ...formData, maxSalary: Number(e.target.value) })}
                        className="w-full px-3.5 py-2 rounded-lg text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Job Description & Attachments */}
          {step === 3 && (
            <div className="space-y-5 animate-in fade-in duration-300">
              <div className="border-b border-slate-200 dark:border-slate-800 pb-3">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <FileText className="w-5 h-5 text-brand-500" />
                  <span>{t("stepRequirements")}</span>
                </h3>
              </div>

              {/* Job Description */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  {t("jobDescriptionLabel")}
                </label>
                <textarea
                  rows={4}
                  value={formData.jobDescription}
                  onChange={(e) => setFormData({ ...formData, jobDescription: e.target.value })}
                  placeholder={t("jobDescriptionPlaceholder")}
                  className={`w-full px-4 py-3 rounded-xl text-sm bg-slate-50 dark:bg-slate-800/80 border ${
                    errors.jobDescription ? "border-rose-500" : "border-slate-300 dark:border-slate-700"
                  } text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all`}
                />
                {errors.jobDescription && (
                  <p className="text-xs text-rose-500 mt-1">{errors.jobDescription}</p>
                )}
              </div>

              {/* Required Skills */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  {t("requiredSkillsLabel")}
                </label>
                <input
                  type="text"
                  value={formData.requiredSkills}
                  onChange={(e) => setFormData({ ...formData, requiredSkills: e.target.value })}
                  placeholder={t("requiredSkillsPlaceholder")}
                  className="w-full px-4 py-2.5 rounded-xl text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all"
                />
              </div>

              {/* Qualifications */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  {t("qualificationsLabel")}
                </label>
                <input
                  type="text"
                  value={formData.qualifications}
                  onChange={(e) => setFormData({ ...formData, qualifications: e.target.value })}
                  placeholder={t("qualificationsPlaceholder")}
                  className="w-full px-4 py-2.5 rounded-xl text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all"
                />
              </div>

              {/* Upload JD */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  {t("uploadJDLabel")}
                </label>
                <div className="relative border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-brand-500 dark:hover:border-brand-500 rounded-2xl p-6 text-center transition-all bg-slate-50/50 dark:bg-slate-800/30">
                  <input
                    type="file"
                    accept=".pdf,.docx,.doc"
                    onChange={handleFileUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Upload className="w-8 h-8 text-brand-500" />
                    {formData.fileName ? (
                      <div className="flex items-center gap-2 text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                        <Check className="w-4 h-4" />
                        <span>
                          {formData.fileName} ({formData.fileSize})
                        </span>
                      </div>
                    ) : (
                      <>
                        <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                          {t("uploadJDDragDrop")}
                        </p>
                        <p className="text-xs text-slate-400">{t("uploadJDHint")}</p>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Action Buttons */}
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
                    <span>{t("submitEmployerBtn")}</span>
                  </>
                )}
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Success Confirmation Modal */}
      {successModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-lg p-6 sm:p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-6 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-mono text-brand-600 dark:text-brand-400 font-bold px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 inline-block">
                {createdOrderId}
              </span>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                {t("modalSuccessTitle")}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {t("modalSuccessEmployerDesc")}
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
                href="/admin/employers"
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
