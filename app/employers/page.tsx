"use client";

import React from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { EmployerForm } from "@/components/forms/EmployerForm";
import { useLanguage } from "@/context/LanguageContext";
import { Building2, ShieldCheck, Zap, Award, Clock } from "lucide-react";

export default function EmployersPage() {
  const { t, language } = useLanguage();

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow pt-12 pb-20">
        {/* Banner */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-brand-500/10 text-brand-600 dark:text-brand-400 border border-brand-500/20">
              <Building2 className="w-3.5 h-3.5" />
              <span>{t("navEmployers")}</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
              {t("employerFormTitle")}
            </h1>
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
              {t("employerFormSubtitle")}
            </p>
          </div>

          {/* Guarantees Strip */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto mt-10">
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center gap-3">
              <Clock className="w-8 h-8 text-brand-500 flex-shrink-0" />
              <div className="text-xs">
                <span className="font-bold text-slate-900 dark:text-white block">
                  {language === "ar" ? "قائمة مختصرة خلال 48 ساعة" : "48-Hour Shortlist"}
                </span>
                <span className="text-slate-500">{language === "ar" ? "ترشيح أسرع الكفاءات الجاهزة" : "Pre-vetted matching"}</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center gap-3">
              <ShieldCheck className="w-8 h-8 text-emerald-500 flex-shrink-0" />
              <div className="text-xs">
                <span className="font-bold text-slate-900 dark:text-white block">
                  {language === "ar" ? "ضمان استبدال 90 يوماً" : "90-Day Replacement"}
                </span>
                <span className="text-slate-500">{language === "ar" ? "استبدال مجاني في حال عدم التوافق" : "Zero-risk staffing guarantee"}</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center gap-3">
              <Award className="w-8 h-8 text-amber-500 flex-shrink-0" />
              <div className="text-xs">
                <span className="font-bold text-slate-900 dark:text-white block">
                  {language === "ar" ? "فحص وتقييم فني دقيق" : "Rigorous Technical Vetting"}
                </span>
                <span className="text-slate-500">{language === "ar" ? "تقارير تقييم ومقابلات معمقة" : "Full evaluation profiles"}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Employer Form */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <EmployerForm />
        </div>
      </main>
      <Footer />
    </div>
  );
}
