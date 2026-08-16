"use client";

import React, { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { useRecruitment } from "@/context/RecruitmentContext";
import { 
  Mail, 
  Phone, 
  MapPin, 
  Send, 
  MessageSquare, 
  Building2, 
  CheckCircle2,
  Clock
} from "lucide-react";

export const ContactSection: React.FC = () => {
  const { t, language, dir } = useLanguage();
  const { triggerToast } = useRecruitment();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setSubmitted(true);
    triggerToast(
      language === "ar" ? "تم إرسال رسالتكم بنجاح" : "Message Sent Successfully",
      language === "ar" ? "سيقوم فريق خدمة العملاء بالتواصل معكم في أقرب وقت" : "Our team will reach back shortly",
      "success"
    );

    setTimeout(() => {
      setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
      setSubmitted(false);
    }, 4000);
  };

  const branches = [
    {
      city: t("branchRiyadh"),
      address: t("branchRiyadhAddress"),
      phone: "+966 11 456 7890",
      email: "riyadh@al-ekhlas-recruitment.com",
    },
    {
      city: t("branchCairo"),
      address: t("branchCairoAddress"),
      phone: "+20 2 2789 1234",
      email: "cairo@al-ekhlas-recruitment.com",
    },
    {
      city: t("branchDubai"),
      address: t("branchDubaiAddress"),
      phone: "+971 4 888 1234",
      email: "dubai@al-ekhlas-recruitment.com",
    },
  ];

  return (
    <section id="contact" className="py-20 relative bg-slate-50/50 dark:bg-slate-900/40 border-t border-slate-200/60 dark:border-slate-800/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-brand-500/10 text-brand-600 dark:text-brand-400 border border-brand-500/20">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>{t("contactBadge")}</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {t("contactTitle")}
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300">
            {t("contactDesc")}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left / Info: Regional Offices */}
          <div className="lg:col-span-5 space-y-4">
            {branches.map((branch, idx) => (
              <div
                key={idx}
                className="glass-panel p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3"
              >
                <div className="flex items-center gap-2.5 text-brand-600 dark:text-brand-400 font-bold text-sm">
                  <Building2 className="w-4 h-4" />
                  <span>{branch.city}</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
                  <span>{branch.address}</span>
                </p>
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
                  <span dir="ltr">{branch.phone}</span>
                  <span>{branch.email}</span>
                </div>
              </div>
            ))}

            {/* Direct WhatsApp Callout */}
            <a
              href="https://wa.me/966501234567"
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-between hover:bg-emerald-500/20 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5" />
                <div className="text-xs">
                  <span className="font-bold block">
                    {language === "ar" ? "تواصل فوري عبر الواتساب" : "Instant WhatsApp Inquiry"}
                  </span>
                  <span>{t("phoneWhatsapp")}</span>
                </div>
              </div>
              <span className="text-xs font-bold underline">
                {language === "ar" ? "بدء المحادثة" : "Chat Now"}
              </span>
            </a>
          </div>

          {/* Right / Quick Message Form */}
          <div className="lg:col-span-7 glass-panel p-8 sm:p-10 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl bg-white/90 dark:bg-slate-900/90">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
              <Send className="w-5 h-5 text-brand-500" />
              <span>{t("sendMessageTitle")}</span>
            </h3>

            {submitted ? (
              <div className="p-8 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
                <h4 className="text-base font-bold text-slate-900 dark:text-white">
                  {language === "ar" ? "تم استلام رسالتكم بنجاح!" : "Message Sent Successfully!"}
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  {language === "ar" ? "شكراً لتواصلكم، سيتصل بكم مستشارنا قريباً." : "Thank you for contacting us. We will get back to you shortly."}
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      {language === "ar" ? "الاسم الكريم *" : "Your Name *"}
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder={language === "ar" ? "الاسم الكامل" : "Full Name"}
                      className="w-full px-4 py-2.5 rounded-xl text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      {language === "ar" ? "البريد الإلكتروني *" : "Email Address *"}
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="name@example.com"
                      dir="ltr"
                      className="w-full px-4 py-2.5 rounded-xl text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500 outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      {language === "ar" ? "رقم الهاتف" : "Phone Number"}
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+966 5X XXX XXXX"
                      dir="ltr"
                      className="w-full px-4 py-2.5 rounded-xl text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      {language === "ar" ? "موضوع الاستفسار" : "Subject"}
                    </label>
                    <input
                      type="text"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      placeholder={language === "ar" ? "طلب استشارة توظيف / شراكة..." : "Recruitment Consultation / Inquiry..."}
                      className="w-full px-4 py-2.5 rounded-xl text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    {language === "ar" ? "تفاصيل الرسالة *" : "Message Details *"}
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder={language === "ar" ? "اكتب استفسارك أو تفاصيل احتياجك هنا..." : "Type your inquiry or requirements here..."}
                    className="w-full px-4 py-2.5 rounded-xl text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500 outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3 rounded-xl text-sm font-bold text-white bg-brand-600 hover:bg-brand-500 shadow-md shadow-brand-500/25 transition-all"
                >
                  <Send className="w-4 h-4" />
                  <span>{t("sendBtn")}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
