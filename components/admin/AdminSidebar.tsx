"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import { useRecruitment } from "@/context/RecruitmentContext";
import { 
  LayoutDashboard, 
  Building2, 
  Users, 
  Sparkles, 
  Sliders, 
  ArrowLeft, 
  ArrowRight,
  ShieldCheck,
  ExternalLink,
  Zap
} from "lucide-react";

interface AdminSidebarProps {
  mobileOpen?: boolean;
  setMobileOpen?: (open: boolean) => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({ mobileOpen, setMobileOpen }) => {
  const pathname = usePathname();
  const { t, language, dir } = useLanguage();
  const { employerRequests, candidates } = useRecruitment();

  const links = [
    {
      href: "/admin",
      label: t("adminMenuOverview"),
      icon: LayoutDashboard,
      badge: null,
    },
    {
      href: "/admin/employers",
      label: t("adminMenuOrders"),
      icon: Building2,
      badge: employerRequests.filter((o) => o.status === "new").length || null,
      badgeColor: "bg-blue-500 text-white",
    },
    {
      href: "/admin/candidates",
      label: t("adminMenuCandidates"),
      icon: Users,
      badge: candidates.length,
      badgeColor: "bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300",
    },
    {
      href: "/admin/matchmaker",
      label: t("adminMenuMatchmaker"),
      icon: Sparkles,
      badge: "AI",
      badgeColor: "bg-gradient-to-r from-amber-500 to-orange-500 text-white",
    },
    {
      href: "/admin/settings",
      label: t("adminMenuSettings"),
      icon: Sliders,
      badge: null,
    },
  ];

  const isActive = (href: string) => {
    if (href === "/admin" && pathname !== "/admin") return false;
    return pathname.startsWith(href);
  };

  const closeMobile = () => {
    if (setMobileOpen) setMobileOpen(false);
  };

  return (
    <aside
      className={`fixed lg:sticky top-0 z-40 h-screen w-72 flex-shrink-0 flex flex-col justify-between border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 transition-all duration-300 ${
        mobileOpen
          ? "translate-x-0"
          : dir === "rtl"
          ? "translate-x-full lg:translate-x-0"
          : "-translate-x-full lg:translate-x-0"
      }`}
    >
      {/* Top Brand Header */}
      <div>
        <div className="h-20 px-6 flex items-center justify-between border-b border-slate-200 dark:border-slate-800">
          <Link href="/admin" className="flex items-center gap-3 group" onClick={closeMobile}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-brand-500/20">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="font-extrabold text-sm text-slate-900 dark:text-white">
                {language === "ar" ? "الإخلاص - الإدارة" : "Al-Ekhlas Admin"}
              </div>
              <span className="text-[10px] text-brand-600 dark:text-brand-400 font-semibold">
                HR & Talent Portal
              </span>
            </div>
          </Link>
        </div>

        {/* Navigation Links */}
        <div className="p-4 space-y-1.5">
          <span className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block mb-2">
            {language === "ar" ? "القائمة الرئيسية" : "Main Navigation"}
          </span>

          {links.map((link) => {
            const Icon = link.icon;
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={closeMobile}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  active
                    ? "bg-brand-600 text-white shadow-md shadow-brand-500/20"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${active ? "text-white" : "text-slate-400"}`} />
                  <span>{link.label}</span>
                </div>

                {link.badge !== null && (
                  <span
                    className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                      active ? "bg-white/20 text-white" : link.badgeColor
                    }`}
                  >
                    {link.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Bottom User / Return Box */}
      <div className="p-4 border-t border-slate-200 dark:border-slate-800 space-y-2">
        <Link
          href="/"
          className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
        >
          <div className="flex items-center gap-2.5">
            <ExternalLink className="w-4 h-4 text-brand-500" />
            <span>{t("adminBackToHome")}</span>
          </div>
          {dir === "rtl" ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
        </Link>

        {/* HR Agent status badge */}
        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 flex items-center gap-3">
          <div className="relative">
            <div className="w-8 h-8 rounded-full bg-brand-500/20 text-brand-600 dark:text-brand-400 font-bold flex items-center justify-center text-xs">
              HR
            </div>
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-900" />
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-xs font-bold text-slate-900 dark:text-white block truncate">
              {language === "ar" ? "فريق الاستقطاب التنفيذي" : "Executive Talent Lead"}
            </span>
            <span className="text-[10px] text-slate-400 block truncate">
              admin@al-ekhlas.sa
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
};
