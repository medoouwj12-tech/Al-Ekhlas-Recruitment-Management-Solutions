"use client";

import React, { useState } from "react";
import { useRecruitment } from "@/context/RecruitmentContext";
import { useLanguage } from "@/context/LanguageContext";
import { 
  Sliders, 
  RotateCcw, 
  ShieldCheck, 
  Bell, 
  Save, 
  Building2, 
  CheckCircle2,
  Lock
} from "lucide-react";

export default function AdminSettingsPage() {
  const { resetToDefaultData, triggerToast } = useRecruitment();
  const { t, language } = useLanguage();

  const [agencyName, setAgencyName] = useState("شركة الإخلاص للتوظيف والحلول الإدارية");
  const [licenseNumber, setLicenseNumber] = useState("4030291823");
  const [guaranteeDays, setGuaranteeDays] = useState(90);
  const [shortlistHours, setShortlistHours] = useState(48);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    triggerToast(
      language === "ar" ? "تم حفظ الإعدادات بنجاح" : "Settings Saved Successfully",
      language === "ar" ? "تم تحديث معايير التوظيف وضمانات الخدمة" : "Agency configurations updated",
      "success"
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
          {t("adminMenuSettings")}
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
          {language === "ar" ? "إدارة معايير الوكالة، مراحل خط التوظيف، وتفضيلات النظام" : "Agency preferences, SLAs, and data configurations"}
        </p>
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
            onClick={resetToDefaultData}
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
