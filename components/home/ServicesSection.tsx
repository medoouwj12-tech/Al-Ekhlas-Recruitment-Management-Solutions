"use client";

import React from "react";
import { useLanguage } from "@/context/LanguageContext";
import { 
  Briefcase, 
  Crown, 
  Globe2, 
  FileSpreadsheet, 
  Users2, 
  CheckCheck,
  ArrowUpRight
} from "lucide-react";
import Link from "next/link";

export const ServicesSection: React.FC = () => {
  const { t, language } = useLanguage();

  const services = [
    {
      icon: Crown,
      badge: language === "ar" ? "الإدارة العليا" : "C-Suite",
      title: t("serviceExecutiveTitle"),
      desc: t("serviceExecutiveDesc"),
      features: [
        language === "ar" ? "استقطاب كبار الرؤساء التنفيذيين (CEO, CTO, CFO)" : "C-Level headhunting (CEO, CTO, CFO)",
        language === "ar" ? "بحث مباشر وسري 100% بدون إعلانات عامة" : "100% confidential targeted search",
        language === "ar" ? "تقارير تقييم قيادي وسلوكي شاملة" : "Comprehensive leadership psychometrics",
      ],
      color: "from-amber-500/20 to-orange-500/20 text-amber-500",
    },
    {
      icon: Briefcase,
      badge: language === "ar" ? "الكفاءات المهنية" : "Professional",
      title: t("servicePermanentTitle"),
      desc: t("servicePermanentDesc"),
      features: [
        language === "ar" ? "تخصصات الهندسة، التقنية، والمالية" : "Engineering, IT, and Finance experts",
        language === "ar" ? "فحص فني ومطابقة المهارات الدقيقة" : "Technical vetting and skill matching",
        language === "ar" ? "ضمان استبدال مجاني لمدة 90 يوماً" : "90-day free replacement guarantee",
      ],
      color: "from-blue-500/20 to-indigo-500/20 text-blue-500",
    },
    {
      icon: Globe2,
      badge: language === "ar" ? "فرق دولية" : "Cross-Border",
      title: t("serviceRemoteTitle"),
      desc: t("serviceRemoteDesc"),
      features: [
        language === "ar" ? "كوادر برمجية وتقنية عالية الكفاءة" : "High-caliber tech and software squads",
        language === "ar" ? "توفير تكاليف التشغيل بنسبة تصل 40%" : "Save up to 40% in operational costs",
        language === "ar" ? "إدارة العقود وتكامل التوقيت الزمني" : "Timezone aligned & managed contracts",
      ],
      color: "from-emerald-500/20 to-teal-500/20 text-emerald-500",
    },
    {
      icon: FileSpreadsheet,
      badge: language === "ar" ? "حلول مؤسسية" : "Enterprise HR",
      title: t("serviceOutsourcingTitle"),
      desc: t("serviceOutsourcingDesc"),
      features: [
        language === "ar" ? "إدارة الرواتب ومسيرات الدفع البنكية" : "Payroll processing & WPS compliance",
        language === "ar" ? "الامتثال التام لنظام العمل والتأمينات وقوى" : "Full Saudi Labor Law & Qiwa compliance",
        language === "ar" ? "إدارة عقود العمل وشؤون الموظفين" : "Employee lifecycle & contract handling",
      ],
      color: "from-purple-500/20 to-pink-500/20 text-purple-500",
    },
    {
      icon: Users2,
      badge: language === "ar" ? "المشاريع الكبرى" : "Turnkey & Scale",
      title: t("serviceMassHiringTitle"),
      desc: t("serviceMassHiringDesc"),
      features: [
        language === "ar" ? "افتتاح الفروع والمشاريع الضخمة والفعاليات" : "Branch openings and mega-events",
        language === "ar" ? "توظيف أكثر من 100+ موظف في وقت قياسي" : "100+ placements within rapid deadlines",
        language === "ar" ? "أيام توظيف مفتوحة ومقابلات جماعية" : "Open recruitment days & mass assessment",
      ],
      color: "from-cyan-500/20 to-blue-500/20 text-cyan-500",
    },
    {
      icon: CheckCheck,
      badge: language === "ar" ? "مراكز التقييم" : "Assessments",
      title: t("serviceAssessmentTitle"),
      desc: t("serviceAssessmentDesc"),
      features: [
        language === "ar" ? "اختبارات فنية متخصصة ومشاريع عملية" : "Practical domain-specific coding & tasks",
        language === "ar" ? "تقييم السمات السلوكية والقدرة على التكيف" : "Behavioral & cultural fit analysis",
        language === "ar" ? "التحقق من المراجع والتاريخ الوظيفي" : "Reference checking & credential audits",
      ],
      color: "from-rose-500/20 to-red-500/20 text-rose-500",
    },
  ];

  return (
    <section id="services" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-brand-500/10 text-brand-600 dark:text-brand-400 border border-brand-500/20">
            {t("servicesBadge")}
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {t("servicesTitle")}
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
            {t("servicesSubtitle")}
          </p>
        </div>

        {/* 6 Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {services.map((service, idx) => {
            const Icon = service.icon;
            return (
              <div
                key={idx}
                className="glass-panel p-7 rounded-3xl border border-slate-200 dark:border-slate-800/80 glass-card-hover flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${service.color} flex items-center justify-center`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                      {service.badge}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2.5">
                    {service.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
                    {service.desc}
                  </p>

                  <ul className="space-y-2 mb-6 border-t border-slate-100 dark:border-slate-800/80 pt-4">
                    {service.features.map((item, fIdx) => (
                      <li key={fIdx} className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300">
                        <CheckCheck className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <a
                  href="#forms-section"
                  className="inline-flex items-center justify-between w-full pt-3 text-xs font-bold text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 transition-colors group"
                >
                  <span>{language === "ar" ? "طلب هذه الخدمة" : "Request this service"}</span>
                  <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </a>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
