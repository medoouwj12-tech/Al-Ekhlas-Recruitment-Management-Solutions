import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currency: string = "SAR", lang: "ar" | "en" = "ar"): string {
  if (lang === "ar") {
    return `${amount.toLocaleString("ar-SA")} ${currency === "SAR" ? "ر.س" : currency}`;
  }
  return `${currency} ${amount.toLocaleString("en-US")}`;
}

export function formatDate(dateString: string, lang: "ar" | "en" = "ar"): string {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return new Intl.DateTimeFormat(lang === "ar" ? "ar-EG" : "en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date);
  } catch {
    return dateString;
  }
}

export function formatRelativeTime(dateString: string, lang: "ar" | "en" = "ar"): string {
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) {
      return lang === "ar" ? "الآن" : "Just now";
    }
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
      return lang === "ar" ? `منذ ${diffInMinutes} دقيقة` : `${diffInMinutes}m ago`;
    }
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return lang === "ar" ? `منذ ${diffInHours} ساعة` : `${diffInHours}h ago`;
    }
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 30) {
      return lang === "ar" ? `منذ ${diffInDays} يوم` : `${diffInDays}d ago`;
    }
    return formatDate(dateString, lang);
  } catch {
    return dateString;
  }
}

export function getStatusColor(status: string): { bg: string; text: string; border: string; dot: string } {
  switch (status) {
    case "new":
    case "available":
      return {
        bg: "bg-blue-500/10 dark:bg-blue-500/20",
        text: "text-blue-600 dark:text-blue-400",
        border: "border-blue-500/20 dark:border-blue-500/30",
        dot: "bg-blue-500",
      };
    case "in_progress":
    case "under_review":
      return {
        bg: "bg-amber-500/10 dark:bg-amber-500/20",
        text: "text-amber-600 dark:text-amber-400",
        border: "border-amber-500/20 dark:border-amber-500/30",
        dot: "bg-amber-500",
      };
    case "shortlisting":
    case "shortlisted":
      return {
        bg: "bg-indigo-500/10 dark:bg-indigo-500/20",
        text: "text-indigo-600 dark:text-indigo-400",
        border: "border-indigo-500/20 dark:border-indigo-500/30",
        dot: "bg-indigo-500",
      };
    case "interviewing":
    case "interviewed":
      return {
        bg: "bg-purple-500/10 dark:bg-purple-500/20",
        text: "text-purple-600 dark:text-purple-400",
        border: "border-purple-500/20 dark:border-purple-500/30",
        dot: "bg-purple-500",
      };
    case "completed":
    case "placed":
      return {
        bg: "bg-emerald-500/10 dark:bg-emerald-500/20",
        text: "text-emerald-600 dark:text-emerald-400",
        border: "border-emerald-500/20 dark:border-emerald-500/30",
        dot: "bg-emerald-500",
      };
    case "cancelled":
    case "archived":
      return {
        bg: "bg-rose-500/10 dark:bg-rose-500/20",
        text: "text-rose-600 dark:text-rose-400",
        border: "border-rose-500/20 dark:border-rose-500/30",
        dot: "bg-rose-500",
      };
    default:
      return {
        bg: "bg-slate-500/10 dark:bg-slate-500/20",
        text: "text-slate-600 dark:text-slate-400",
        border: "border-slate-500/20 dark:border-slate-500/30",
        dot: "bg-slate-500",
      };
  }
}
