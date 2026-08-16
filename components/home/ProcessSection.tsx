"use client";

import React from "react";
import { useLanguage } from "@/context/LanguageContext";
import { 
  ClipboardList, 
  Search, 
  UserCheck2, 
  SendHorizontal,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

export const ProcessSection: React.FC = () => {
  const { t, language, dir } = useLanguage();

  const steps = [
    {
      num: "01",
      icon: ClipboardList,
      title: t("step1Title"),
      desc: t("step1Desc"),
    },
    {
      num: "02",
      icon: Search,
      title: t("step2Title"),
      desc: t("step2Desc"),
    },
    {
      num: "03",
      icon: UserCheck2,
      title: t("step3Title"),
      desc: t("step3Desc"),
    },
    {
      num: "04",
      icon: SendHorizontal,
      title: t("step4Title"),
      desc: t("step4Desc"),
    },
  ];

  return (
    <section className="py-20 relative bg-slate-900 text-white overflow-hidden">
      {/* Glow background */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-white/10 text-brand-300 border border-white/15">
            {t("processBadge")}
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            {t("processTitle")}
          </h2>
        </div>

        {/* 4 Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((s, idx) => {
            const Icon = s.icon;
            return (
              <div
                key={idx}
                className="relative p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md flex flex-col justify-between group hover:border-brand-500/50 hover:bg-white/10 transition-all"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 rounded-xl bg-brand-500/20 text-brand-400 border border-brand-500/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-3xl font-black text-white/20 group-hover:text-brand-400 transition-colors">
                      {s.num}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white mb-2">
                    {s.title}
                  </h3>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    {s.desc}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-white/10 flex items-center gap-1 text-[11px] font-semibold text-brand-300">
                  <span>{language === "ar" ? "دقة وسرعة في الإنجاز" : "Fast & Verified"}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
