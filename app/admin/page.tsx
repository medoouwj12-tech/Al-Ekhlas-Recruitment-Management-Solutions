"use client";

import React from "react";
import { useRecruitment } from "@/context/RecruitmentContext";
import { useLanguage } from "@/context/LanguageContext";
import { 
  Building2, 
  Users, 
  Briefcase, 
  Sparkles, 
  TrendingUp, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  ArrowUpRight,
  ArrowRight,
  Filter,
  Layers,
  BarChart3
} from "lucide-react";
import Link from "next/link";
import { formatCurrency, formatRelativeTime, getStatusColor } from "@/lib/utils";

export default function AdminDashboardPage() {
  const { employerRequests, candidates, notifications } = useRecruitment();
  const { t, language, dir } = useLanguage();

  // Calculate Metrics
  const totalOrders = employerRequests.length;
  const totalCandidates = candidates.length;
  const activeOrders = employerRequests.filter(
    (o) => o.status === "new" || o.status === "in_progress" || o.status === "shortlisting" || o.status === "interviewing"
  ).length;
  const placedCandidates = candidates.filter((c) => c.status === "placed").length;

  // Pipeline Status breakdown
  const statusCounts = {
    new: employerRequests.filter((o) => o.status === "new").length,
    in_progress: employerRequests.filter((o) => o.status === "in_progress").length,
    shortlisting: employerRequests.filter((o) => o.status === "shortlisting").length,
    interviewing: employerRequests.filter((o) => o.status === "interviewing").length,
    completed: employerRequests.filter((o) => o.status === "completed").length,
  };

  // Industry Breakdown
  const industryCounts: Record<string, number> = {};
  employerRequests.forEach((o) => {
    industryCounts[o.industry] = (industryCounts[o.industry] || 0) + 1;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner / Welcome */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-navy-900 to-indigo-950 text-white border border-slate-800 shadow-xl relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-white/10 text-brand-300 border border-white/15">
            <Sparkles className="w-3.5 h-3.5 text-brand-400" />
            <span>{language === "ar" ? "لوحة المتابعة والتحليلات الحية" : "Live Recruitment Analytics"}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black">
            {language === "ar" ? "مرحباً بك في نظام إدارة الإخلاص للتوظيف" : "Welcome to Al-Ekhlas Talent Suite"}
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
            {language === "ar"
              ? "إدارة خطوط الاستقطاب، متابعة طلبات المنشآت الشريكة، وتفعيل خوارزمية المطابقة الذكية للكوادر."
              : "Manage talent pipelines, review partner job orders, and leverage AI candidate matching."}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 z-10">
          <Link
            href="/admin/matchmaker"
            className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-amber-400 to-amber-300 hover:from-amber-300 hover:to-amber-200 shadow-md transition-all flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>{t("adminMenuMatchmaker")}</span>
          </Link>
          <Link
            href="/admin/employers"
            className="px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-white/10 hover:bg-white/20 border border-white/20 transition-all flex items-center gap-2"
          >
            <Building2 className="w-4 h-4" />
            <span>{t("adminMenuOrders")}</span>
          </Link>
        </div>

        <div className="absolute top-0 right-0 w-80 h-80 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Card 1: Total Orders */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
              {t("kpiTotalOrders")}
            </span>
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
              <Building2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              {totalOrders}
            </div>
            <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 mt-1 block">
              {t("kpiTotalOrdersSub")}
            </span>
          </div>
        </div>

        {/* Card 2: Candidates */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
              {t("kpiTotalCandidates")}
            </span>
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              {totalCandidates}
            </div>
            <span className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 mt-1 block">
              {t("kpiTotalCandidatesSub")}
            </span>
          </div>
        </div>

        {/* Card 3: Active Orders */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
              {t("kpiOpenOrders")}
            </span>
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
              <Briefcase className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl sm:text-3xl font-extrabold text-amber-600 dark:text-amber-400">
              {activeOrders}
            </div>
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mt-1 block">
              {t("kpiOpenOrdersSub")}
            </span>
          </div>
        </div>

        {/* Card 4: Placements */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
              {t("kpiMatchesPlaced")}
            </span>
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">
              {placedCandidates}
            </div>
            <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 mt-1 block">
              {t("kpiMatchesPlacedSub")}
            </span>
          </div>
        </div>
      </div>

      {/* Main Analytics Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 7 Cols: Pipeline Status Breakdown */}
        <div className="lg:col-span-7 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <BarChart3 className="w-5 h-5 text-brand-500" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                {t("chartPipelineTitle")}
              </h3>
            </div>
            <span className="text-xs font-semibold text-slate-500">
              {totalOrders} {language === "ar" ? "أمر توظيف إجمالي" : "Total Orders"}
            </span>
          </div>

          {/* Pipeline Visual Stages */}
          <div className="space-y-4">
            {[
              { key: "new", label: t("status_new"), count: statusCounts.new, color: "bg-blue-500", text: "text-blue-500" },
              { key: "in_progress", label: t("status_in_progress"), count: statusCounts.in_progress, color: "bg-amber-500", text: "text-amber-500" },
              { key: "shortlisting", label: t("status_shortlisting"), count: statusCounts.shortlisting, color: "bg-indigo-500", text: "text-indigo-500" },
              { key: "interviewing", label: t("status_interviewing"), count: statusCounts.interviewing, color: "bg-purple-500", text: "text-purple-500" },
              { key: "completed", label: t("status_completed"), count: statusCounts.completed, color: "bg-emerald-500", text: "text-emerald-500" },
            ].map((stage) => {
              const pct = totalOrders > 0 ? Math.round((stage.count / totalOrders) * 100) : 0;
              return (
                <div key={stage.key} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-slate-700 dark:text-slate-300">{stage.label}</span>
                    <span className="text-slate-500">
                      {stage.count} ({pct}%)
                    </span>
                  </div>
                  <div className="h-2.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${stage.color} rounded-full transition-all duration-500`}
                      style={{ width: `${Math.max(pct, stage.count > 0 ? 5 : 0)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-500">
              {language === "ar" ? "سرعة إغلاق الشواغر: 14 يوم متوسط" : "Avg. Time to Fill: 14 Days"}
            </span>
            <Link href="/admin/employers" className="text-brand-600 dark:text-brand-400 font-bold hover:underline">
              {language === "ar" ? "عرض كافة الطلبات" : "View All Orders"} →
            </Link>
          </div>
        </div>

        {/* Right 5 Cols: Industry Distribution */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Layers className="w-5 h-5 text-indigo-500" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                {t("chartIndustryTitle")}
              </h3>
            </div>
          </div>

          <div className="space-y-3">
            {Object.entries(industryCounts).map(([indKey, count]) => {
              const label = (t as any)(`ind_${indKey}`) || indKey;
              return (
                <div
                  key={indKey}
                  className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs"
                >
                  <span className="font-semibold text-slate-700 dark:text-slate-200 truncate max-w-[200px]">
                    {label}
                  </span>
                  <span className="px-2.5 py-1 rounded-full font-bold bg-brand-500/10 text-brand-600 dark:text-brand-400">
                    {count} {language === "ar" ? "طلب" : "orders"}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recent Activity Feed & Quick Table */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Clock className="w-5 h-5 text-brand-500" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              {t("chartRecentActivity")}
            </h3>
          </div>
          <Link
            href="/admin/employers"
            className="text-xs font-bold text-brand-600 dark:text-brand-400 hover:underline"
          >
            {language === "ar" ? "إدارة الطلبات" : "Manage Orders"}
          </Link>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {employerRequests.slice(0, 4).map((order) => {
            const statusStyle = getStatusColor(order.status);
            return (
              <div key={order.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-start sm:items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-300 font-bold text-xs flex-shrink-0">
                    <Building2 className="w-4 h-4 text-brand-500" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900 dark:text-white">
                        {order.companyName}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {order.id}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      {order.jobTitle} • {formatCurrency(order.minSalary, order.currency, language)} - {formatCurrency(order.maxSalary, order.currency, language)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-center">
                  <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold border ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border}`}>
                    {(t as any)(`status_${order.status}`)}
                  </span>
                  <span className="text-[11px] text-slate-400">
                    {formatRelativeTime(order.submittedAt, language)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
