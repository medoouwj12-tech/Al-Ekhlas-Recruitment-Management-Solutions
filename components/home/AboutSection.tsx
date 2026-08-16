"use client";

import React from "react";
import { useLanguage } from "@/context/LanguageContext";
import { 
  ShieldCheck, 
  Target, 
  Eye, 
  Zap, 
  Lock, 
  Award, 
  CheckCircle,
  Building
} from "lucide-react";

export const AboutSection: React.FC = () => {
  const { t, language } = useLanguage();

  const values = [
    {
      icon: ShieldCheck,
      color: "text-blue-500 bg-blue-500/10 border-blue-500/20",
      title: t("valueIntegrity"),
      desc: t("valueIntegrityDesc"),
    },
    {
      icon: Award,
      color: "text-indigo-500 bg-indigo-500/10 border-indigo-500/20",
      title: t("valueExcellence"),
      desc: t("valueExcellenceDesc"),
    },
    {
      icon: Zap,
      color: "text-amber-500 bg-amber-500/10 border-amber-500/20",
      title: t("valueSpeed"),
      desc: t("valueSpeedDesc"),
    },
    {
      icon: Lock,
      color: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
      title: t("valueConfidentiality"),
      desc: t("valueConfidentialityDesc"),
    },
  ];

  return (
    <section id="about" className="py-20 relative bg-slate-50/50 dark:bg-slate-900/40 border-y border-slate-200/60 dark:border-slate-800/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-brand-500/10 text-brand-600 dark:text-brand-400 border border-brand-500/20">
            {t("aboutSectionBadge")}
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {t("aboutTitle")}
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
            {t("aboutDescription")}
          </p>
        </div>

        {/* Mission & Vision Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 mb-14">
          {/* Mission */}
          <div className="glass-panel p-8 rounded-3xl border border-slate-200 dark:border-slate-800 relative overflow-hidden group">
            <div className="w-12 h-12 rounded-2xl bg-brand-500/10 text-brand-600 dark:text-brand-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
              <Target className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
              {t("missionTitle")}
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {t("missionDesc")}
            </p>
          </div>

          {/* Vision */}
          <div className="glass-panel p-8 rounded-3xl border border-slate-200 dark:border-slate-800 relative overflow-hidden group">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
              <Eye className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
              {t("visionTitle")}
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {t("visionDesc")}
            </p>
          </div>
        </div>

        {/* Core Values 4-Grid */}
        <div>
          <h3 className="text-xl font-bold text-center text-slate-900 dark:text-white mb-8">
            {t("valuesTitle")}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v, i) => {
              const Icon = v.icon;
              return (
                <div
                  key={i}
                  className="glass-panel p-6 rounded-2xl border border-slate-200 dark:border-slate-800/80 glass-card-hover"
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 border ${v.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <h4 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                    {v.title}
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {v.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
