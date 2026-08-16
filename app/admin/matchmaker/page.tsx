"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useRecruitment } from "@/context/RecruitmentContext";
import { useLanguage } from "@/context/LanguageContext";
import { Candidate, EmployerRequest, MatchScore } from "@/lib/types";
import { 
  Sparkles, 
  Building2, 
  Users, 
  CheckCircle2, 
  XCircle, 
  Plus, 
  Minus, 
  Printer, 
  Send, 
  FileText, 
  ArrowUpRight, 
  Check, 
  ShieldCheck,
  Star,
  Download,
  X
} from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";

function MatchmakerContent() {
  const searchParams = useSearchParams();
  const initialOrderId = searchParams.get("orderId");

  const { employerRequests, candidates, getMatchesForOrder, assignCandidateToOrder, removeCandidateFromOrder, triggerToast } = useRecruitment();
  const { t, language, dir } = useLanguage();

  const [selectedOrderId, setSelectedOrderId] = useState<string>("");
  const [shortlistModalOpen, setShortlistModalOpen] = useState(false);

  useEffect(() => {
    if (initialOrderId && employerRequests.some((o) => o.id === initialOrderId)) {
      setSelectedOrderId(initialOrderId);
    } else if (employerRequests.length > 0 && !selectedOrderId) {
      setSelectedOrderId(employerRequests[0].id);
    }
  }, [initialOrderId, employerRequests]);

  const currentOrder = employerRequests.find((o) => o.id === selectedOrderId);
  const matchedResults = selectedOrderId ? getMatchesForOrder(selectedOrderId) : [];

  const assignedCandidateIds = currentOrder?.assignedCandidateIds || [];
  const shortlistedCandidates = candidates.filter((c) => assignedCandidateIds.includes(c.id));

  const handleToggleShortlist = (candId: string) => {
    if (!selectedOrderId) return;
    if (assignedCandidateIds.includes(candId)) {
      removeCandidateFromOrder(selectedOrderId, candId);
    } else {
      assignCandidateToOrder(selectedOrderId, candId);
    }
  };

  const handlePrintShortlist = () => {
    window.print();
  };

  const handleSendToClient = () => {
    triggerToast(
      language === "ar" ? "تم إرسال القائمة المختصرة للعميل" : "Shortlist Emailed to Client",
      language === "ar" ? `تم إرسال ملف المرشحين إلى ${currentOrder?.contactPerson} (${currentOrder?.email})` : `Shortlist dossier sent to ${currentOrder?.email}`,
      "success"
    );
    setShortlistModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              {t("matchmakerTitle")}
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-sm">
              AI Powered
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            {t("matchmakerSubtitle")}
          </p>
        </div>

        {shortlistedCandidates.length > 0 && (
          <button
            onClick={() => setShortlistModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 shadow-md shadow-brand-500/20 transition-all self-start sm:self-auto"
          >
            <FileText className="w-4 h-4" />
            <span>{t("exportShortlistBtn")} ({shortlistedCandidates.length})</span>
          </button>
        )}
      </div>

      {/* Order Selector Banner */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
          {t("selectOrderToMatch")}
        </label>
        <select
          value={selectedOrderId}
          onChange={(e) => setSelectedOrderId(e.target.value)}
          className="w-full px-4 py-3 rounded-xl text-sm font-semibold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500 outline-none"
        >
          {employerRequests.map((order) => (
            <option key={order.id} value={order.id}>
              {order.id} - {order.companyName} | {order.jobTitle} ({formatCurrency(order.minSalary, order.currency, language)} - {formatCurrency(order.maxSalary, order.currency, language)})
            </option>
          ))}
        </select>

        {/* Selected Order Summary Chips */}
        {currentOrder && (
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80 flex flex-wrap items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-brand-500" />
              <span className="font-bold text-slate-900 dark:text-white">
                {currentOrder.companyName}
              </span>
              <span className="text-slate-400">• {currentOrder.contactPerson}</span>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <span className="px-2.5 py-1 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold">
                {(t as any)(`ind_${currentOrder.industry}`)}
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold">
                {(t as any)(`exp_${currentOrder.experienceLevel}`)}
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold">
                {formatCurrency(currentOrder.minSalary, currentOrder.currency, language)} - {formatCurrency(currentOrder.maxSalary, currentOrder.currency, language)}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Main Matching Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left 8 Cols: Ranked Matching Candidates */}
        <div className="lg:col-span-8 space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>{t("matchingResultsTitle")}</span>
            <span className="text-xs font-normal text-slate-400">
              ({matchedResults.length} {language === "ar" ? "مرشح تم فرزهم" : "candidates evaluated"})
            </span>
          </h3>

          <div className="space-y-4">
            {matchedResults.map(({ candidate, score }) => {
              const isAssigned = assignedCandidateIds.includes(candidate.id);
              
              // Score styling
              const scoreBadgeColor =
                score.overallScore >= 85
                  ? "from-emerald-600 to-teal-600 text-white"
                  : score.overallScore >= 70
                  ? "from-blue-600 to-indigo-600 text-white"
                  : "from-amber-600 to-orange-600 text-white";

              return (
                <div
                  key={candidate.id}
                  className={`p-6 rounded-2xl bg-white dark:bg-slate-900 border transition-all ${
                    isAssigned
                      ? "border-emerald-500 ring-2 ring-emerald-500/20 shadow-md"
                      : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    {/* Candidate Info */}
                    <div className="flex items-start gap-3">
                      <div className="w-11 h-11 rounded-2xl bg-brand-500/10 text-brand-600 dark:text-brand-400 font-black text-sm flex items-center justify-center flex-shrink-0">
                        {candidate.fullName.slice(0, 2)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-base font-bold text-slate-900 dark:text-white">
                            {candidate.fullName}
                          </h4>
                          <span className="text-[11px] font-mono text-slate-400">
                            {candidate.id}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                          {candidate.currentTitle} • {candidate.yearsOfExperience} {language === "ar" ? "سنوات خبرة" : "yrs exp"} • {candidate.city}
                        </p>
                      </div>
                    </div>

                    {/* Overall Match Score Badge */}
                    <div className="flex items-center gap-3 self-end sm:self-start">
                      <div className={`px-3 py-1.5 rounded-xl bg-gradient-to-r ${scoreBadgeColor} font-black text-sm shadow-sm flex items-center gap-1.5`}>
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>{score.overallScore}%</span>
                        <span className="text-[10px] font-medium opacity-90">
                          {t("matchScore")}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Skills Breakdown */}
                  <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
                    {/* Matched Skills */}
                    {score.matchedSkills.length > 0 && (
                      <div className="flex flex-wrap items-center gap-1.5 text-xs">
                        <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 me-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>{t("skillsMatched")}:</span>
                        </span>
                        {score.matchedSkills.map((s, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-semibold text-[11px] border border-emerald-500/20"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Missing Skills */}
                    {score.missingSkills.length > 0 && (
                      <div className="flex flex-wrap items-center gap-1.5 text-xs">
                        <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1 me-1">
                          <XCircle className="w-3.5 h-3.5" />
                          <span>{t("missingSkills")}:</span>
                        </span>
                        {score.missingSkills.map((s, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500 font-medium text-[11px]"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Actions Footer */}
                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      {language === "ar" ? "الراتب المتوقع:" : "Expected:"} {formatCurrency(candidate.expectedSalary, candidate.currency, language)}
                    </span>

                    <button
                      onClick={() => handleToggleShortlist(candidate.id)}
                      className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                        isAssigned
                          ? "bg-emerald-600 text-white shadow-md shadow-emerald-500/20"
                          : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-brand-600 hover:text-white"
                      }`}
                    >
                      {isAssigned ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>{language === "ar" ? "في القائمة المختصرة" : "Shortlisted"}</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-3.5 h-3.5" />
                          <span>{t("addToShortlist")}</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 4 Cols: Current Shortlist Drawer */}
        <div className="lg:col-span-4 sticky top-24 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Users className="w-4 h-4 text-brand-500" />
              <span>{t("currentShortlist")}</span>
            </h3>
            <span className="px-2.5 py-0.5 rounded-full bg-brand-500/10 text-brand-600 dark:text-brand-400 font-bold text-xs">
              {shortlistedCandidates.length}
            </span>
          </div>

          {shortlistedCandidates.length === 0 ? (
            <p className="text-xs text-slate-400 leading-relaxed py-6 text-center italic">
              {t("shortlistEmpty")}
            </p>
          ) : (
            <div className="space-y-3">
              {shortlistedCandidates.map((cand) => (
                <div
                  key={cand.id}
                  className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-3 text-xs"
                >
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white block">
                      {cand.fullName}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      {cand.currentTitle}
                    </span>
                  </div>

                  <button
                    onClick={() => handleToggleShortlist(cand.id)}
                    className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-500/10"
                    title={t("removeFromShortlist")}
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                </div>
              ))}

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  onClick={() => setShortlistModalOpen(true)}
                  className="w-full py-3 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 shadow-md shadow-brand-500/20 transition-all flex items-center justify-center gap-2"
                >
                  <FileText className="w-4 h-4" />
                  <span>{t("exportShortlistBtn")}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Shortlist Client Export Dossier Modal */}
      {shortlistModalOpen && currentOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto p-6 sm:p-10 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-6">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-brand-600 text-white flex items-center justify-center">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900 dark:text-white">
                    {t("shortlistModalTitle")}
                  </h3>
                  <p className="text-xs text-brand-600 dark:text-brand-400 font-semibold">
                    Al-Ekhlas Executive Search Dossier
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrintShortlist}
                  className="p-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 transition-colors flex items-center gap-1.5"
                  title="Print"
                >
                  <Printer className="w-4 h-4" />
                  <span className="hidden sm:inline">{t("printExportBtn")}</span>
                </button>
                <button
                  onClick={() => setShortlistModalOpen(false)}
                  className="p-2 rounded-xl text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Dossier Header Info */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-xs">
              <div>
                <span className="text-slate-400 block">{t("shortlistPreparedFor")}</span>
                <span className="font-bold text-slate-900 dark:text-white text-sm">
                  {currentOrder.companyName}
                </span>
                <span className="text-slate-500 block">{currentOrder.contactPerson}</span>
              </div>
              <div>
                <span className="text-slate-400 block">{t("shortlistPosition")}</span>
                <span className="font-bold text-brand-600 dark:text-brand-400 text-sm">
                  {currentOrder.jobTitle}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block">{t("shortlistDate")}</span>
                <span className="font-bold text-slate-900 dark:text-white text-sm">
                  {formatDate(new Date().toISOString(), language)}
                </span>
              </div>
            </div>

            {/* Candidates Dossier Profiles */}
            <div className="space-y-4">
              {shortlistedCandidates.map((cand, idx) => (
                <div
                  key={cand.id}
                  className="p-6 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-4 text-xs"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-700/80 pb-3">
                    <div className="flex items-center gap-3">
                      <span className="w-7 h-7 rounded-lg bg-brand-500 text-white font-bold flex items-center justify-center text-xs">
                        #{idx + 1}
                      </span>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                          {cand.fullName}
                        </h4>
                        <span className="text-slate-400 text-[11px]">
                          {cand.targetTitle} • {cand.yearsOfExperience} {language === "ar" ? "سنوات خبرة" : "yrs exp"}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold">
                        {formatCurrency(cand.expectedSalary, cand.currency, language)}
                      </span>
                    </div>
                  </div>

                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                    {cand.summary}
                  </p>

                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {cand.skills.map((s, sIdx) => (
                      <span
                        key={sIdx}
                        className="px-2.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-medium text-[11px]"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800">
              <button
                onClick={() => setShortlistModalOpen(false)}
                className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200"
              >
                {t("close")}
              </button>

              <button
                onClick={handleSendToClient}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 shadow-md shadow-emerald-500/20"
              >
                <Send className="w-4 h-4" />
                <span>{t("sendToClientEmailBtn")}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function SmartMatchmakerPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-sm font-semibold text-slate-400">جاري تحميل المطابق الذكي...</div>}>
      <MatchmakerContent />
    </Suspense>
  );
}
