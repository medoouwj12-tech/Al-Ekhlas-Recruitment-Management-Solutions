"use client";

import React from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ServicesSection } from "@/components/home/ServicesSection";
import { ProcessSection } from "@/components/home/ProcessSection";
import { useLanguage } from "@/context/LanguageContext";
import Link from "next/link";
import { ArrowUpRight, CheckCircle2 } from "lucide-react";

export default function ServicesPage() {
  const { t, language } = useLanguage();

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow pt-12 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-brand-500/10 text-brand-600 dark:text-brand-400 border border-brand-500/20">
              {t("navServices")}
            </div>
            <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
              {t("servicesTitle")}
            </h1>
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
              {t("servicesSubtitle")}
            </p>
          </div>
        </div>

        <ServicesSection />
        <ProcessSection />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-20 text-center">
          <div className="p-10 rounded-3xl glass-panel border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 space-y-5">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
              {language === "ar" ? "هل تبحث عن استشارة توظيف مخصصة لمنشأتك؟" : "Looking for Bespoke Recruitment Advisory?"}
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 max-w-lg mx-auto">
              {language === "ar"
                ? "فريقنا جاهز لتصميم خطة توظيف تتناسب مع حجم وطبيعة ميزانيتك والمواعيد المحددة لمشاريعك."
                : "Our specialized consultants will craft a customized talent acquisition strategy tailored to your budget and timelines."}
            </p>
            <div className="pt-2">
              <Link
                href="/employers"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl text-sm font-bold text-white bg-brand-600 hover:bg-brand-500 shadow-lg shadow-brand-500/25 transition-all"
              >
                <span>{t("navRequestStaff")}</span>
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
