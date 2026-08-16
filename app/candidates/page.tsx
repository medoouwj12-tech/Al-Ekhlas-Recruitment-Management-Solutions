"use client";

import React from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CandidateForm } from "@/components/forms/CandidateForm";
import { useLanguage } from "@/context/LanguageContext";
import { Users, Sparkles, Shield, Briefcase, Award } from "lucide-react";

export default function CandidatesPage() {
  const { t, language } = useLanguage();

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow pt-12 pb-20">
        {/* Banner */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-brand-500/10 text-brand-600 dark:text-brand-400 border border-brand-500/20">
              <Users className="w-3.5 h-3.5" />
              <span>{t("navJobSeekers")}</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
              {t("candidateFormTitle")}
            </h1>
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
              {t("candidateFormSubtitle")}
            </p>
          </div>

          {/* Benefits Strip */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto mt-10">
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center gap-3">
              <Sparkles className="w-8 h-8 text-brand-500 flex-shrink-0" />
              <div className="text-xs">
                <span className="font-bold text-slate-900 dark:text-white block">
                  {language === "ar" ? "خدمة مجانية 100% للمرشحين" : "100% Free for Candidates"}
                </span>
                <span className="text-slate-500">{language === "ar" ? "لا يتم تحصيل أي رسوم من الباحثين" : "Zero fees on job seekers"}</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center gap-3">
              <Briefcase className="w-8 h-8 text-indigo-500 flex-shrink-0" />
              <div className="text-xs">
                <span className="font-bold text-slate-900 dark:text-white block">
                  {language === "ar" ? "فرص وظيفية لدى كبرى الشركات" : "Leading Enterprise Opportunities"}
                </span>
                <span className="text-slate-500">{language === "ar" ? "شركات معتمدة برواتب ومزايا تنافسية" : "Top tier packages"}</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center gap-3">
              <Shield className="w-8 h-8 text-emerald-500 flex-shrink-0" />
              <div className="text-xs">
                <span className="font-bold text-slate-900 dark:text-white block">
                  {language === "ar" ? "سرية تامة لبياناتك الوظيفية" : "Absolute Privacy & Confidentiality"}
                </span>
                <span className="text-slate-500">{language === "ar" ? "عدم مشاركة بياناتك إلا بموافقتك" : "Consent-based submissions"}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Candidate Form */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <CandidateForm />
        </div>
      </main>
      <Footer />
    </div>
  );
}
