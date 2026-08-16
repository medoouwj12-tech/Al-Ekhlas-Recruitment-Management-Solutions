"use client";

import React from "react";
import { useLanguage } from "@/context/LanguageContext";
import { Star, Quote } from "lucide-react";

export const TestimonialsSection: React.FC = () => {
  const { t, language } = useLanguage();

  const testimonials = [
    {
      text: t("testimonial1Text"),
      author: t("testimonial1Author"),
      role: t("testimonial1Role"),
      stars: 5,
    },
    {
      text: t("testimonial2Text"),
      author: t("testimonial2Author"),
      role: t("testimonial2Role"),
      stars: 5,
    },
    {
      text: t("testimonial3Text"),
      author: t("testimonial3Author"),
      role: t("testimonial3Role"),
      stars: 5,
    },
  ];

  return (
    <section className="py-20 relative bg-slate-50/50 dark:bg-slate-900/40 border-t border-slate-200/60 dark:border-slate-800/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-brand-500/10 text-brand-600 dark:text-brand-400 border border-brand-500/20">
            {t("testimonialsBadge")}
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {t("testimonialsTitle")}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {testimonials.map((item, idx) => (
            <div
              key={idx}
              className="glass-panel p-7 rounded-3xl border border-slate-200 dark:border-slate-800 glass-card-hover flex flex-col justify-between"
            >
              <div>
                {/* Stars */}
                <div className="flex items-center gap-1 mb-4 text-amber-400">
                  {[...Array(item.stars)].map((_, s) => (
                    <Star key={s} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>

                {/* Quote Text */}
                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed italic mb-6">
                  "{item.text}"
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  {item.author}
                </h4>
                <p className="text-xs text-brand-600 dark:text-brand-400 mt-0.5">
                  {item.role}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
