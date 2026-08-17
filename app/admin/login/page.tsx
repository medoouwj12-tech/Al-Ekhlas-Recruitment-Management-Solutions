"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, Lock, User, Shield, Loader2, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [attempts, setAttempts] = useState(0);

  const expired = searchParams.get("expired") === "1";

  useEffect(() => {
    if (expired) {
      setError("انتهت صلاحية الجلسة. يرجى تسجيل الدخول مجدداً.");
    }
  }, [expired]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError("يرجى إدخال اسم المستخدم وكلمة المرور");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: username.trim(), password }),
      });

      const data = await res.json();

      if (data.success) {
        const from = searchParams.get("from") || "/admin";
        router.replace(from);
      } else {
        setAttempts((prev) => prev + 1);
        setError(data.message || "بيانات الدخول غير صحيحة");
        setPassword("");
      }
    } catch {
      setError("حدث خطأ في الاتصال بالخادم. يرجى المحاولة مجدداً.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070B14] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[50%] translate-x-[-50%] w-[600px] h-[600px] rounded-full bg-indigo-600/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] rounded-full bg-brand-600/8 blur-[100px]" />
        <div className="absolute top-[30%] right-[-5%] w-[300px] h-[300px] rounded-full bg-emerald-500/5 blur-[80px]" />
        {/* Subtle grid */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.03]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="w-full max-w-md relative z-10"
      >
        {/* Card */}
        <div className="bg-slate-900/80 backdrop-blur-xl border border-white/8 rounded-3xl shadow-2xl overflow-hidden">
          {/* Top stripe */}
          <div className="h-1 w-full bg-gradient-to-r from-brand-600 via-indigo-500 to-emerald-500" />

          <div className="p-8 sm:p-10 space-y-8">
            {/* Header */}
            <div className="text-center space-y-4">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-brand-600/15 border border-brand-500/20 mx-auto">
                <Shield className="w-8 h-8 text-brand-400" />
              </div>
              <div>
                <h1 className="text-xl font-black text-white tracking-tight">
                  بوابة الإدارة المحمية
                </h1>
                <p className="text-xs text-slate-400 mt-1.5">
                  شركة الإخلاص للتوظيف والحلول الإدارية
                </p>
              </div>
            </div>

            {/* Error */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -8, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: "auto" }}
                  exit={{ opacity: 0, y: -8, height: 0 }}
                  className="flex items-start gap-3 p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs"
                >
                  <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>{error}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5" dir="rtl">
              {/* Username */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-300">
                  اسم المستخدم
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3.5 pointer-events-none">
                    <User className="w-4 h-4 text-slate-500" />
                  </div>
                  <input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="أدخل اسم المستخدم"
                    autoComplete="username"
                    disabled={loading}
                    className="w-full pr-10 pl-4 py-3 rounded-xl bg-slate-800/60 border border-slate-700/60 text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500/30 transition-all disabled:opacity-50"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-300">
                  كلمة المرور
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3.5 pointer-events-none">
                    <Lock className="w-4 h-4 text-slate-500" />
                  </div>
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="أدخل كلمة المرور"
                    autoComplete="current-password"
                    disabled={loading}
                    className="w-full pr-10 pl-10 py-3 rounded-xl bg-slate-800/60 border border-slate-700/60 text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500/30 transition-all disabled:opacity-50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500 hover:text-slate-300 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Attempts warning */}
              {attempts >= 3 && (
                <p className="text-[11px] text-amber-400 text-center">
                  ⚠️ تم إدخال بيانات خاطئة عدة مرات. يرجى التأكد من بياناتك.
                </p>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading || !username || !password}
                className="w-full py-3 rounded-xl text-sm font-bold text-white bg-brand-600 hover:bg-brand-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 shadow-lg shadow-brand-600/20 hover:shadow-brand-600/30"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>جاري التحقق...</span>
                  </>
                ) : (
                  <>
                    <Shield className="w-4 h-4" />
                    <span>تسجيل الدخول إلى لوحة الإدارة</span>
                  </>
                )}
              </button>
            </form>

            {/* Footer note */}
            <div className="pt-4 border-t border-white/5 text-center">
              <p className="text-[11px] text-slate-600">
                🔒 هذه البوابة محمية ومخصصة للمسؤولين المعتمدين فقط
              </p>
            </div>
          </div>
        </div>

        {/* Back to site link */}
        <div className="text-center mt-5">
          <a
            href="/"
            className="text-xs text-slate-500 hover:text-slate-300 transition-colors"
          >
            ← العودة إلى الموقع الرئيسي
          </a>
        </div>
      </motion.div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <React.Suspense fallback={<div className="min-h-screen bg-[#070B14]" />}>
      <LoginForm />
    </React.Suspense>
  );
}
