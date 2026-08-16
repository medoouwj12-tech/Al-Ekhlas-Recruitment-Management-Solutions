import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/context/ThemeContext";
import { LanguageProvider } from "@/context/LanguageContext";
import { RecruitmentProvider } from "@/context/RecruitmentContext";
import { ToastContainer } from "@/components/ui/ToastContainer";

export const metadata: Metadata = {
  title: "شركة الإخلاص للتوظيف والحلول الإدارية | Al-Ekhlas Recruitment & Management Solutions",
  description: "الشركة الرائدة في استقطاب الكفاءات والتوظيف التنفيذي والحلول الإدارية وإدارة الموارد البشرية في المملكة العربية السعودية والشرق الأوسط.",
  keywords: ["توظيف", "موارد بشرية", "استقطاب كفاءات", "وظائف السعودية", "Executive Search", "Recruitment Agency KSA", "HR Solutions"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" className="dark">
      <body className="min-h-screen bg-slate-50 dark:bg-navy-950 text-slate-900 dark:text-slate-100 font-cairo antialiased selection:bg-brand-500 selection:text-white transition-colors duration-300">
        <ThemeProvider>
          <LanguageProvider>
            <RecruitmentProvider>
              {children}
              <ToastContainer />
            </RecruitmentProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
