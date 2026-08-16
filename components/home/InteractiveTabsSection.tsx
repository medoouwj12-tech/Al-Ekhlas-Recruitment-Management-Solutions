"use client";

import React, { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { EmployerForm } from "@/components/forms/EmployerForm";
import { CandidateForm } from "@/components/forms/CandidateForm";
import { Building2, Users, Sparkles, CheckCircle2 } from "lucide-react";

export const InteractiveTabsSection: React.FC = () => {
  const { t, language } = useLanguage();
  const [activeTab, setActiveTab] = useState<"employer" | "candidate">("employer");

  return (
    <section id="forms-section" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-brand-500/10 text-brand-600 dark:text-brand-400 border border-brand-500/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{language === "ar" ? "بوابة الخدمات التفاعلية" : "Interactive Portal"}</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {activeTab === "employer" ? t("employerFormTitle") : t("candidateFormTitle")}
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300">
            {activeTab === "employer" ? t("employerFormSubtitle") : t("candidateFormSubtitle")}
          </p>
        </div>

        {/* Big Interactive Tabs Switcher */}
        <div className="flex justify-center mb-10">
          <div className="p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 inline-flex items-center gap-2 shadow-inner">
            <button
              onClick={() => setActiveTab("employer")}
              className={`flex items-center gap-2.5 px-6 py-3 rounded-xl text-sm font-bold transition-all ${
                activeTab === "employer"
                  ? "bg-white dark:bg-slate-900 text-brand-600 dark:text-brand-400 shadow-md border border-slate-200/80 dark:border-slate-700"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span>{language === "ar" ? "أنا صاحب عمل (طلب موظفين)" : "I am an Employer (Hire Staff)"}</span>
            </button>

            <button
              onClick={() => setActiveTab("candidate")}
              className={`flex items-center gap-2.5 px-6 py-3 rounded-xl text-sm font-bold transition-all ${
                activeTab === "candidate"
                  ? "bg-white dark:bg-slate-900 text-brand-600 dark:text-brand-400 shadow-md border border-slate-200/80 dark:border-slate-700"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <Users className="w-4 h-4" />
              <span>{language === "ar" ? "أنا باحث عن عمل (تقديم CV)" : "I am a Job Seeker (Submit CV)"}</span>
            </button>
          </div>
        </div>

        {/* Tab Content Display */}
        <div className="transition-all duration-300">
          {activeTab === "employer" ? <EmployerForm /> : <CandidateForm />}
        </div>
      </div>
    </section>
  );
};
