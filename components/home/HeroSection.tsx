"use client";

import React from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { 
  Building2, 
  Users, 
  CheckCircle2, 
  ArrowUpRight, 
  Clock, 
  ShieldCheck, 
  Sparkles,
  TrendingUp
} from "lucide-react";

export const HeroSection: React.FC = () => {
  const { t, language } = useLanguage();

  return (
    <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28">
      {/* Background Decorative Glow Elements */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] glow-spot-blue pointer-events-none rounded-full blur-3xl" />
      <div className="absolute top-1/3 right-10 w-[400px] h-[400px] glow-spot-gold pointer-events-none rounded-full blur-3xl opacity-60" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-4xl mx-auto space-y-6">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs sm:text-sm font-semibold bg-brand-500/10 text-brand-600 dark:text-brand-400 border border-brand-500/20 shadow-sm animate-pulse-slow">
            <Sparkles className="w-4 h-4 text-brand-500" />
            <span>{t("heroBadge")}</span>
          </div>

          {/* Main Title */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.2] sm:leading-[1.2]">
            {t("heroTitlePart1")}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 via-indigo-600 to-brand-500">
              {t("heroTitleHighlight")}
            </span>
            {t("heroTitlePart2")}
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
            {t("heroSubtitle")}
          </p>

          {/* Dual CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <a
              href="#forms-section"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-base font-bold text-white bg-gradient-to-r from-brand-600 via-brand-500 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 shadow-xl shadow-brand-500/25 hover:shadow-brand-500/40 transition-all hover:scale-[1.02]"
            >
              <Building2 className="w-5 h-5" />
              <span>{t("heroCtaEmployer")}</span>
              <ArrowUpRight className="w-4 h-4" />
            </a>

            <a
              href="#forms-section"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-base font-bold text-slate-800 dark:text-white bg-white dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-700/80 border border-slate-300 dark:border-slate-700 shadow-lg shadow-slate-900/5 transition-all hover:scale-[1.02]"
            >
              <Users className="w-5 h-5 text-brand-500" />
              <span>{t("heroCtaCandidate")}</span>
            </a>
          </div>

          {/* Trust Caption */}
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 pt-2 flex items-center justify-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>{t("heroStatsTrustedBy")}</span>
          </p>
        </div>

        {/* Live Counter Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mt-14 sm:mt-18">
          {/* Card 1: Companies */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-200 dark:border-slate-800/80 glass-card-hover flex flex-col items-center sm:items-start text-center sm:text-start">
            <div className="w-11 h-11 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center mb-3">
              <Building2 className="w-6 h-6" />
            </div>
            <span className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
              {t("statCompanies")}
            </span>
            <span className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium mt-1">
              {t("statCompaniesLabel")}
            </span>
          </div>

          {/* Card 2: Candidates */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-200 dark:border-slate-800/80 glass-card-hover flex flex-col items-center sm:items-start text-center sm:text-start">
            <div className="w-11 h-11 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center mb-3">
              <Users className="w-6 h-6" />
            </div>
            <span className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
              {t("statCandidates")}
            </span>
            <span className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium mt-1">
              {t("statCandidatesLabel")}
            </span>
          </div>

          {/* Card 3: Retention */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-200 dark:border-slate-800/80 glass-card-hover flex flex-col items-center sm:items-start text-center sm:text-start">
            <div className="w-11 h-11 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center mb-3">
              <TrendingUp className="w-6 h-6" />
            </div>
            <span className="text-2xl sm:text-4xl font-extrabold text-emerald-600 dark:text-emerald-400">
              {t("statRetention")}
            </span>
            <span className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium mt-1">
              {t("statRetentionLabel")}
            </span>
          </div>

          {/* Card 4: Speed */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-200 dark:border-slate-800/80 glass-card-hover flex flex-col items-center sm:items-start text-center sm:text-start">
            <div className="w-11 h-11 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center mb-3">
              <Clock className="w-6 h-6" />
            </div>
            <span className="text-2xl sm:text-4xl font-extrabold text-amber-500">
              {t("statSpeed")}
            </span>
            <span className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium mt-1">
              {t("statSpeedLabel")}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
