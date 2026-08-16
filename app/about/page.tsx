"use client";

import React from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { AboutSection } from "@/components/home/AboutSection";
import { useLanguage } from "@/context/LanguageContext";
import { Award, ShieldCheck, CheckCircle2, Building2, Users, Target, ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function AboutPage() {
  const { t, language, dir } = useLanguage();

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow pt-12 pb-20">
        {/* Banner */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-brand-500/10 text-brand-600 dark:text-brand-400 border border-brand-500/20">
              {t("navAbout")}
            </div>
            <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
              {t("brandName")}
            </h1>
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
              {t("brandTagline")}
            </p>
          </div>
        </div>

        {/* Company Profile Details */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-6">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                {language === "ar"
                  ? "شريككم الأول في بناء فرق العمل القيادية والمواهب الاستثنائية"
                  : "Your Premier Partner in Building Executive Teams and Exceptional Talents"}
              </h2>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                {language === "ar"
                  ? "انطلقت شركة الإخلاص للتوظيف والحلول الإدارية برؤية طموحة لتطوير قطاع الموارد البشرية والتوظيف التخصصي. نحن نجمع بين الفهم العميق لمتطلبات سوق العمل الخليجي والسعودي، وأحدث الممارسات الدولية في الاستقطاب وتقييم الكفاءات."
                  : "Al-Ekhlas Recruitment was established with an ambitious vision to elevate human resources and specialized staffing. We combine deep insight into the Saudi & Gulf job markets with cutting-edge international talent acquisition benchmarks."}
              </p>
              <div className="space-y-3">
                {[
                  language === "ar" ? "ترخيص رسمي معتمد من وزارة الموارد البشرية والتنمية الاجتماعية" : "Licensed by the Ministry of Human Resources and Social Development",
                  language === "ar" ? "شبكة تتجاوز 50,000+ محترف وقيادي مفحوص في مختلف التخصصات" : "Network of 50,000+ vetted professionals across specialized disciplines",
                  language === "ar" ? "ضمان استبدال مجاني لمدة 90 يوماً على كافة التعيينات الدائمة" : "90-day free replacement guarantee on all permanent placements",
                  language === "ar" ? "سرعة إنجاز استثنائية مع تقديم أول قائمة مختصرة خلال 48 ساعة" : "Rapid shortlist delivery within 48 to 72 hours",
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 text-xs sm:text-sm text-slate-700 dark:text-slate-200">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="p-8 rounded-3xl bg-gradient-to-br from-brand-600 via-indigo-600 to-slate-900 text-white shadow-2xl space-y-6">
                <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center">
                  <ShieldCheck className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white">
                  {language === "ar" ? "الميثاق المهني والسرية" : "Professional Charter & Discretion"}
                </h3>
                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                  {language === "ar"
                    ? "نلتزم في شركة الإخلاص بأعلى درجات السرية التامة لحماية بيانات الشركات الشريكة وخصوصية المرشحين، مع الامتثال الكامل للأنظمة المحلية والدولية لحماية البيانات."
                    : "We adhere strictly to confidentiality and ethical non-disclosure protocols, protecting corporate strategies and candidate privacy under global standards."}
                </p>
                <div className="pt-4 border-t border-white/20 flex items-center justify-between text-xs">
                  <span>{t("licenseInfo")}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <AboutSection />

        {/* Action Callout */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 text-center">
          <div className="p-10 rounded-3xl glass-panel border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 space-y-6">
            <h3 className="text-2xl font-black text-slate-900 dark:text-white">
              {language === "ar" ? "جاهزون لبدء رحلة التوظيف الناجحة؟" : "Ready to Accelerate Your Recruitment Journey?"}
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 max-w-xl mx-auto">
              {language === "ar"
                ? "تواصل معنا اليوم وسيقوم أحد مستشاري التوظيف المتخصصين بجدولة اجتماع لمناقشة احتياجات منشأتكم."
                : "Get in touch today and one of our dedicated recruitment consultants will schedule a strategic consultation."}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/employers"
                className="px-6 py-3 rounded-xl text-sm font-bold text-white bg-brand-600 hover:bg-brand-500 shadow-md shadow-brand-500/20"
              >
                {t("navRequestStaff")}
              </Link>
              <Link
                href="/candidates"
                className="px-6 py-3 rounded-xl text-sm font-bold text-slate-800 dark:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700"
              >
                {t("navApplyJob")}
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
