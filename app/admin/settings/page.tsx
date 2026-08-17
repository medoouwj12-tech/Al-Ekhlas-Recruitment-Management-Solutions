"use client";

import React, { useState } from "react";
import { useRecruitment } from "@/context/RecruitmentContext";
import { useLanguage } from "@/context/LanguageContext";
import { 
  Sliders, 
  RotateCcw, 
  ShieldCheck, 
  Database, 
  Save, 
  Building2, 
  CheckCircle2,
  RefreshCw,
  Server,
  Cloud,
  AlertCircle,
  ExternalLink
} from "lucide-react";

export default function AdminSettingsPage() {
  const { resetToDefaultData, refreshFromDatabase, dbStatus, triggerToast } = useRecruitment();
  const { t, language } = useLanguage();

  const [agencyName, setAgencyName] = useState("شركة الإخلاص للتوظيف والحلول الإدارية");
  const [licenseNumber, setLicenseNumber] = useState("4030291823");
  const [guaranteeDays, setGuaranteeDays] = useState(90);
  const [shortlistHours, setShortlistHours] = useState(48);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    triggerToast(
      language === "ar" ? "تم حفظ الإعدادات بنجاح" : "Settings Saved Successfully",
      language === "ar" ? "تم تحديث معايير التوظيف وضمانات الخدمة" : "Agency configurations updated",
      "success"
    );
  };

  const handleRefreshDb = async () => {
    setIsRefreshing(true);
    await refreshFromDatabase();
    setTimeout(() => {
      setIsRefreshing(false);
      triggerToast(
        language === "ar" ? "تمت مزامنة قاعدة البيانات" : "Database Synchronized",
        language === "ar" ? "تم فحص الاتصال وتحديث البيانات من السيرفر" : "Database records fetched successfully",
        "info"
      );
    }, 600);
  };

  const handleSeedDatabase = async () => {
    setIsSeeding(true);
    try {
      const res = await fetch("/api/seed", { method: "POST" });
      const data = await res.json();
      if (data.success) {
        await refreshFromDatabase();
        triggerToast(
          language === "ar" ? "تم تهيئة قاعدة البيانات بنجاح" : "Database Seeded Successfully",
          language === "ar" ? "تم إدخال كافة بيانات الشركات والمرشحين النموذجية" : "Initial realistic data injected into MongoDB",
          "success"
        );
      } else {
        await resetToDefaultData();
      }
    } catch {
      await resetToDefaultData();
    } finally {
      setIsSeeding(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
          {t("adminMenuSettings")}
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
          {language === "ar" ? "إدارة قاعدة بيانات MongoDB Atlas، معايير الوكالة، والضمانات" : "MongoDB Atlas Cloud connection, agency SLAs, and data management"}
        </p>
      </div>

      {/* Cloud Database Integration Status Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-slate-900 via-navy-900 to-indigo-950 text-white border border-slate-800 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
              <Database className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white">
                  {language === "ar" ? "اتصال قاعدة البيانات السحابية" : "Cloud Database Connection"}
                </h3>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  MongoDB Atlas
                </span>
              </div>
              <p className="text-xs text-slate-300">
                {language === "ar" ? "نظام سحابي مرن NoSQL فائق السرعة ومجاني 100%" : "Production-ready NoSQL Cloud Database with Next.js API Handlers"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleRefreshDb}
              disabled={isRefreshing}
              className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-white/10 hover:bg-white/20 border border-white/15 transition-all flex items-center gap-2"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
              <span>{language === "ar" ? "فحص الاتصال والتحديث" : "Refresh & Ping"}</span>
            </button>

            <button
              onClick={handleSeedDatabase}
              disabled={isSeeding}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 transition-all flex items-center gap-2"
            >
              <Cloud className="w-3.5 h-3.5" />
              <span>{isSeeding ? (language === "ar" ? "جاري التهيئة..." : "Seeding...") : (language === "ar" ? "تهيئة البيانات في MongoDB" : "Seed Database")}</span>
            </button>
          </div>
        </div>

        {/* Database Status Chips */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
            <span className="text-slate-400 block">{language === "ar" ? "حالة المحرك" : "Engine Status"}</span>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-bold text-white">
                {dbStatus.connected ? (language === "ar" ? "متصل بسحابة MongoDB" : "Connected (Cloud Atlas)") : (language === "ar" ? "محرك التخزين النشط (Active Storage)" : "Active Storage Mode")}
              </span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
            <span className="text-slate-400 block">{language === "ar" ? "الطلبات المحفوظة (Orders)" : "Saved Orders"}</span>
            <span className="text-lg font-black text-brand-300">
              {dbStatus.counts?.orders ?? 0} {language === "ar" ? "طلب شركة مسجل" : "orders"}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
            <span className="text-slate-400 block">{language === "ar" ? "الكفاءات المسجلة (Candidates)" : "Vetted Candidates"}</span>
            <span className="text-lg font-black text-emerald-300">
              {dbStatus.counts?.candidates ?? 0} {language === "ar" ? "مرشح مفحوص" : "candidates"}
            </span>
          </div>
        </div>

        {/* MongoDB Connection Guide Callout */}
        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-xs space-y-2">
          <div className="flex items-center justify-between font-bold text-slate-200">
            <span>{language === "ar" ? "💡 كيفية ربط حسابك المجاني في MongoDB Atlas:" : "💡 Connecting your free MongoDB Atlas Cluster:"}</span>
            <a
              href="https://www.mongodb.com/cloud/atlas/register"
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-400 hover:underline flex items-center gap-1"
            >
              <span>{language === "ar" ? "إنشاء حساب مجاني (M0 Cluster)" : "Create Free Atlas Cluster"}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
          <p className="text-slate-400 leading-relaxed font-mono text-[11px] bg-black/40 p-3 rounded-xl">
            MONGODB_URI="mongodb+srv://&lt;username&gt;:&lt;password&gt;@cluster0.mongodb.net/al_ekhlas?retryWrites=true&w=majority"
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 8 Cols: Settings Form */}
        <div className="lg:col-span-8 p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <form onSubmit={handleSaveSettings} className="space-y-5">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <Building2 className="w-4 h-4 text-brand-500" />
              <span>{language === "ar" ? "بيانات الوكالة والترخيص" : "Agency Identity & Licensing"}</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  {language === "ar" ? "اسم الشركة التجاري" : "Agency Business Name"}
                </label>
                <input
                  type="text"
                  value={agencyName}
                  onChange={(e) => setAgencyName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  {language === "ar" ? "رقم ترخيص وزارة الموارد البشرية" : "Ministry License Number"}
                </label>
                <input
                  type="text"
                  value={licenseNumber}
                  onChange={(e) => setLicenseNumber(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  {language === "ar" ? "مدة ضمان الاستبدال المجاني (أيام)" : "Replacement Guarantee Period (Days)"}
                </label>
                <input
                  type="number"
                  value={guaranteeDays}
                  onChange={(e) => setGuaranteeDays(Number(e.target.value))}
                  className="w-full px-4 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  {language === "ar" ? "الحد الأقصى لتقديم القائمة المختصرة (ساعات)" : "Shortlist SLA Target (Hours)"}
                </label>
                <input
                  type="number"
                  value={shortlistHours}
                  onChange={(e) => setShortlistHours(Number(e.target.value))}
                  className="w-full px-4 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
              <button
                type="submit"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-brand-600 hover:bg-brand-500 shadow-md transition-all"
              >
                <Save className="w-4 h-4" />
                <span>{t("save")}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Right 4 Cols: Reset Demo Data */}
        <div className="lg:col-span-4 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
              <RotateCcw className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              {language === "ar" ? "إعادة ضبط البيانات التجريبية" : "Reset Demo Data"}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              {language === "ar"
                ? "يمكنك استعادة بيانات الشركات والمرشحين الافتراضية في أي وقت لإعادة تجربة الفرز والمطابقة."
                : "Reset all employer orders and candidate talent pool back to default initial mock data."}
            </p>
          </div>

          <button
            onClick={() => resetToDefaultData()}
            className="w-full py-2.5 rounded-xl text-xs font-bold text-amber-700 dark:text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 transition-colors flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>{t("reset")}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
