"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";
import { useRecruitment } from "@/context/RecruitmentContext";
import { 
  Building2, 
  Globe, 
  Sun, 
  Moon, 
  Menu, 
  X, 
  ShieldCheck, 
  Briefcase, 
  UserCheck, 
  Sparkles,
  ArrowUpRight
} from "lucide-react";

export const Navbar: React.FC = () => {
  const { language, toggleLanguage, t, dir } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const { unreadNotificationCount } = useRecruitment();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: "/", label: t("navHome") },
    { href: "/about", label: t("navAbout") },
    { href: "/services", label: t("navServices") },
    { href: "/employers", label: t("navEmployers") },
    { href: "/candidates", label: t("navJobSeekers") },
    { href: "/contact", label: t("navContact") },
  ];

  const isActive = (href: string) => {
    if (href === "/" && pathname !== "/") return false;
    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-40 w-full transition-colors duration-300 border-b border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-navy-900/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Brand Identity */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-12 h-12 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-0.5 shadow-md shadow-brand-500/10 group-hover:scale-105 transition-transform flex items-center justify-center overflow-hidden">
              <img
                src="/logo.png"
                alt="شركة الإخلاص للتوظيف بالخارج"
                className="w-full h-full object-contain rounded-lg"
              />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base sm:text-lg tracking-tight text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                  {language === "ar" ? "شركة الإخلاص" : "Al-Ekhlas"}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-brand-500/10 text-brand-600 dark:text-brand-400 border border-brand-500/20">
                  {language === "ar" ? "ترخيص 509" : "Lic. 509"}
                </span>
              </div>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                {language === "ar" ? "للتوظيف بالخارج" : "Overseas Recruitment"}
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                    active
                      ? "text-brand-600 dark:text-brand-400 bg-brand-500/10 font-bold"
                      : "text-slate-700 dark:text-slate-300 hover:text-brand-600 dark:hover:text-brand-400 hover:bg-slate-100 dark:hover:bg-slate-800/60"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Controls */}
          <div className="hidden sm:flex items-center gap-2.5">
            {/* Language Switcher */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all border border-slate-200 dark:border-slate-700"
              title="Switch Language"
            >
              <Globe className="w-3.5 h-3.5 text-brand-500" />
              <span>{t("langToggle")}</span>
            </button>

            {/* Theme Switcher */}
            <button
              onClick={toggleTheme}
              className="p-2 text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-all border border-slate-200 dark:border-slate-700"
              title="Toggle Theme"
              aria-label="Toggle Theme"
            >
              {theme === "dark" ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-slate-700" />
              )}
            </button>

            {/* Admin Portal Quick Access */}
            <Link
              href="/admin"
              className="relative inline-flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg text-white bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 border border-slate-700/80 shadow-sm transition-all group"
            >
              <ShieldCheck className="w-4 h-4 text-brand-400 group-hover:scale-110 transition-transform" />
              <span>{t("navAdminPortal")}</span>
              {unreadNotificationCount > 0 && (
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              )}
            </Link>

            {/* CTA Request Staff */}
            <Link
              href="/employers"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-lg text-white bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 shadow-md shadow-brand-500/20 hover:shadow-brand-500/30 transition-all"
            >
              <span>{t("navRequestStaff")}</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex sm:hidden items-center gap-2">
            <button
              onClick={toggleLanguage}
              className="px-2.5 py-1.5 text-xs font-bold rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700"
            >
              {language === "ar" ? "EN" : "عربي"}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none"
              aria-label="Open menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl px-4 pt-2 pb-6 space-y-3">
          <div className="flex flex-col space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`px-4 py-2.5 rounded-lg text-base font-medium ${
                  isActive(link.href)
                    ? "text-brand-600 dark:text-brand-400 bg-brand-500/10 font-bold"
                    : "text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-col gap-3">
            <div className="flex items-center justify-between px-2">
              <span className="text-xs text-slate-500 dark:text-slate-400">
                {language === "ar" ? "المظهر" : "Appearance"}
              </span>
              <button
                onClick={toggleTheme}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200"
              >
                {theme === "dark" ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
                <span>{theme === "dark" ? t("themeLight") : t("themeDark")}</span>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <Link
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg text-xs font-bold text-white bg-slate-800 dark:bg-slate-700"
              >
                <ShieldCheck className="w-4 h-4 text-brand-400" />
                <span>{t("navAdminPortal")}</span>
              </Link>

              <Link
                href="/employers"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg text-xs font-bold text-white bg-brand-600"
              >
                <span>{t("navRequestStaff")}</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
