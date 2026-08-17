"use client";

import React from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { 
  Building2, 
  MapPin, 
  Phone, 
  Mail, 
  ShieldCheck, 
  Award, 
  CheckCircle2, 
  Globe 
} from "lucide-react";

export const Footer: React.FC = () => {
  const { t, language } = useLanguage();

  return (
    <footer className="bg-slate-950 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800/80">
          {/* Col 1 & 2: Brand & License */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-white p-1 flex items-center justify-center text-white shadow-lg shadow-brand-500/10 flex-shrink-0 overflow-hidden">
                <img
                  src="/logo.png"
                  alt="شركة الإخلاص للتوظيف بالخارج"
                  className="w-full h-full object-contain rounded-lg"
                />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white tracking-tight">
                  {t("brandName")}
                </h3>
                <p className="text-xs text-brand-400 font-medium">
                  {language === "ar" ? "ترخيص رقم 509 لإلحاق العمالة بالخارج" : "Overseas Recruitment Lic. No. 509"}
                </p>
              </div>
            </div>

            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              {t("footerDesc")}
            </p>

            {/* Official Accreditation Badge */}
            <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 flex items-start gap-3 max-w-md">
              <ShieldCheck className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
              <div className="text-xs text-slate-400 leading-snug">
                <span className="font-semibold text-slate-200 block mb-0.5">
                  {language === "ar" ? "ترخيص معتمد رسمياً" : "Officially Licensed Agency"}
                </span>
                {t("licenseInfo")}
              </div>
            </div>
          </div>

          {/* Col 3: Quick Links */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-white tracking-wider uppercase">
              {t("footerLinksQuick")}
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/" className="hover:text-brand-400 transition-colors">
                  {t("navHome")}
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-brand-400 transition-colors">
                  {t("navAbout")}
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-brand-400 transition-colors">
                  {t("navServices")}
                </Link>
              </li>
              <li>
                <Link href="/employers" className="hover:text-brand-400 transition-colors">
                  {t("navEmployers")}
                </Link>
              </li>
              <li>
                <Link href="/candidates" className="hover:text-brand-400 transition-colors">
                  {t("navJobSeekers")}
                </Link>
              </li>
              <li>
                <Link href="/admin" className="text-brand-400 hover:underline font-semibold flex items-center gap-1">
                  <span>{t("navAdminPortal")}</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Services */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-white tracking-wider uppercase">
              {t("footerLinksServices")}
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>{t("serviceExecutiveTitle")}</li>
              <li>{t("servicePermanentTitle")}</li>
              <li>{t("serviceRemoteTitle")}</li>
              <li>{t("serviceOutsourcingTitle")}</li>
              <li>{t("serviceMassHiringTitle")}</li>
              <li>{t("serviceAssessmentTitle")}</li>
            </ul>
          </div>

          {/* Col 5: Contact Info */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-white tracking-wider uppercase">
              {t("contactBadge")}
            </h4>
            <ul className="space-y-3 text-xs text-slate-400">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-brand-400 flex-shrink-0 mt-0.5" />
                <span>{t("branchRiyadhAddress")}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-brand-400 flex-shrink-0" />
                <span dir="ltr">{t("phoneMain")}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-brand-400 flex-shrink-0" />
                <span>{t("emailMain")}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>{t("copyright")}</p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="hover:text-slate-400 transition-colors">
              {t("privacyPolicy")}
            </Link>
            <Link href="/terms" className="hover:text-slate-400 transition-colors">
              {t("termsOfService")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
