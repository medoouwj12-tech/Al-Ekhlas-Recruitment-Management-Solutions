"use client";

import React, { useState } from "react";
import { useRecruitment } from "@/context/RecruitmentContext";
import { useLanguage } from "@/context/LanguageContext";
import { Candidate, CandidateStatus, IndustryCategory } from "@/lib/types";
import { 
  Users, 
  Search, 
  Filter, 
  Plus, 
  Eye, 
  FileText, 
  Star, 
  Trash2, 
  X, 
  Mail, 
  Phone, 
  MapPin, 
  Globe, 
  Link2, 
  Code2, 
  CheckCircle2, 
  Clock, 
  Briefcase, 
  GraduationCap,
  Save
} from "lucide-react";
import Link from "next/link";
import { formatCurrency, formatDate, getStatusColor } from "@/lib/utils";

export default function AdminCandidatesPage() {
  const { candidates, updateCandidateStatus, updateCandidateNotes, deleteCandidate } = useRecruitment();
  const { t, language, dir } = useLanguage();

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [activeModalTab, setActiveModalTab] = useState<"summary" | "document" | "notes">("summary");
  const [hrNotesInput, setHrNotesInput] = useState("");

  // Filter candidates
  const filteredCandidates = candidates.filter((cand) => {
    const query = search.toLowerCase();
    const matchesSearch =
      cand.fullName.toLowerCase().includes(query) ||
      cand.currentTitle.toLowerCase().includes(query) ||
      cand.targetTitle.toLowerCase().includes(query) ||
      cand.id.toLowerCase().includes(query) ||
      cand.skills.some((s) => s.toLowerCase().includes(query));

    const matchesCategory = selectedCategory === "all" || cand.category === selectedCategory;
    const matchesStatus = selectedStatus === "all" || cand.status === selectedStatus;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const openCandidateModal = (cand: Candidate) => {
    setSelectedCandidate(cand);
    setHrNotesInput(cand.hrNotes || "");
    setActiveModalTab("summary");
  };

  const handleSaveHrNotes = () => {
    if (selectedCandidate) {
      updateCandidateNotes(selectedCandidate.id, hrNotesInput);
      setSelectedCandidate({ ...selectedCandidate, hrNotes: hrNotesInput });
    }
  };

  const handleStatusChange = (status: CandidateStatus) => {
    if (selectedCandidate) {
      updateCandidateStatus(selectedCandidate.id, status);
      setSelectedCandidate({ ...selectedCandidate, status });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            {t("candidatesTitle")}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            {t("candidatesSubtitle")}
          </p>
        </div>

        <Link
          href="/candidates"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-brand-600 hover:bg-brand-500 shadow-md shadow-brand-500/20 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>{t("newCandidateBtn")}</span>
        </Link>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-center gap-3">
        {/* Search */}
        <div className="relative w-full md:flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute top-1/2 -translate-y-1/2 start-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t("searchCandidatesPlaceholder")}
            className="w-full ps-9 pe-4 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>

        {/* Category Filter */}
        <div className="w-full md:w-48">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            <option value="all">{t("all")}</option>
            <option value="technology">{t("ind_technology")}</option>
            <option value="finance_banking">{t("ind_finance_banking")}</option>
            <option value="engineering">{t("ind_engineering")}</option>
            <option value="healthcare">{t("ind_healthcare")}</option>
            <option value="marketing_sales">{t("ind_marketing_sales")}</option>
            <option value="operations_logistics">{t("ind_operations_logistics")}</option>
            <option value="hr_admin">{t("ind_hr_admin")}</option>
          </select>
        </div>

        {/* Status Filter */}
        <div className="w-full md:w-48">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            <option value="all">{t("allStatuses")}</option>
            <option value="available">{t("status_available")}</option>
            <option value="under_review">{t("status_under_review")}</option>
            <option value="shortlisted">{t("status_shortlisted")}</option>
            <option value="interviewed">{t("status_interviewed")}</option>
            <option value="placed">{t("status_placed")}</option>
            <option value="archived">{t("status_archived")}</option>
          </select>
        </div>
      </div>

      {/* Candidate Data Table */}
      <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-start text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 text-slate-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4 text-start">{t("tableColCandidate")}</th>
                <th className="py-3.5 px-4 text-start">{t("tableColCategory")}</th>
                <th className="py-3.5 px-4 text-start">{t("tableColExp")}</th>
                <th className="py-3.5 px-4 text-start">{t("tableColExpectedSalary")}</th>
                <th className="py-3.5 px-4 text-start">{t("tableColStatus")}</th>
                <th className="py-3.5 px-4 text-end">{t("tableColActions")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredCandidates.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    {t("noCandidatesFound")}
                  </td>
                </tr>
              ) : (
                filteredCandidates.map((cand) => {
                  const statusStyle = getStatusColor(cand.status);
                  return (
                    <tr
                      key={cand.id}
                      className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      {/* Name & Contact */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-brand-500/10 text-brand-600 dark:text-brand-400 font-bold flex items-center justify-center text-xs flex-shrink-0">
                            {cand.fullName.slice(0, 2)}
                          </div>
                          <div>
                            <span className="font-bold text-slate-900 dark:text-white block">
                              {cand.fullName}
                            </span>
                            <span className="text-[11px] text-slate-400 font-mono">
                              {cand.id} • {cand.city}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Category & Current Title */}
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-900 dark:text-white">
                          {cand.currentTitle}
                        </div>
                        <div className="text-[11px] text-brand-600 dark:text-brand-400">
                          {(t as any)(`ind_${cand.category}`)}
                        </div>
                      </td>

                      {/* Experience & Education */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-800 dark:text-slate-200">
                          {cand.yearsOfExperience} {language === "ar" ? "سنوات خبرة" : "yrs exp"}
                        </div>
                        <div className="text-[11px] text-slate-400 truncate max-w-[180px]">
                          {cand.education}
                        </div>
                      </td>

                      {/* Salary */}
                      <td className="py-3.5 px-4 font-bold text-emerald-600 dark:text-emerald-400">
                        {formatCurrency(cand.expectedSalary, cand.currency, language)}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-bold border ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border}`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${statusStyle.dot}`} />
                          <span>{(t as any)(`status_${cand.status}`)}</span>
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-end">
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            onClick={() => openCandidateModal(cand)}
                            className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-brand-500 transition-colors"
                            title={t("viewResume")}
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => deleteCandidate(cand.id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:bg-rose-500/10 hover:text-rose-500 transition-colors"
                            title={t("delete")}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Candidate CV Profile Preview Modal */}
      {selectedCandidate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-6">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-brand-500/10 text-brand-600 dark:text-brand-400 font-black text-base flex items-center justify-center">
                  {selectedCandidate.fullName.slice(0, 2)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                      {selectedCandidate.fullName}
                    </h3>
                    <span className="text-xs font-mono font-bold text-brand-500 px-2 py-0.5 rounded bg-brand-500/10">
                      {selectedCandidate.id}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {selectedCandidate.currentTitle} • {selectedCandidate.city}, {selectedCandidate.country}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedCandidate(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Tabs */}
            <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
              <button
                onClick={() => setActiveModalTab("summary")}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeModalTab === "summary"
                    ? "bg-brand-600 text-white shadow-sm"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                {t("cvSummaryTab")}
              </button>

              <button
                onClick={() => setActiveModalTab("document")}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeModalTab === "document"
                    ? "bg-brand-600 text-white shadow-sm"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                {t("cvDocumentTab")}
              </button>

              <button
                onClick={() => setActiveModalTab("notes")}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeModalTab === "notes"
                    ? "bg-brand-600 text-white shadow-sm"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                {t("cvHrNotesTab")}
              </button>
            </div>

            {/* TAB 1: Summary */}
            {activeModalTab === "summary" && (
              <div className="space-y-5 animate-in fade-in">
                {/* Status Switcher */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 flex flex-wrap items-center justify-between gap-3">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    {t("changeStatus")}:
                  </span>
                  <div className="flex flex-wrap items-center gap-1.5">
                    {(["available", "under_review", "shortlisted", "interviewed", "placed", "archived"] as CandidateStatus[]).map((st) => (
                      <button
                        key={st}
                        onClick={() => handleStatusChange(st)}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                          selectedCandidate.status === st
                            ? "bg-brand-600 text-white"
                            : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700"
                        }`}
                      >
                        {(t as any)(`status_${st}`)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 text-xs">
                  <div>
                    <span className="text-slate-400 block">{t("yearsExpLabel")}</span>
                    <span className="font-bold text-slate-900 dark:text-white">
                      {selectedCandidate.yearsOfExperience} {language === "ar" ? "سنوات" : "years"}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">{t("expectedSalaryLabel")}</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">
                      {formatCurrency(selectedCandidate.expectedSalary, selectedCandidate.currency, language)}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">{t("noticePeriodLabel")}</span>
                    <span className="font-bold text-slate-900 dark:text-white">
                      {(t as any)(`notice_${selectedCandidate.noticePeriod.replace("-", "_")}`)}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">{t("tableColRating")}</span>
                    <div className="flex items-center gap-1 text-amber-400 font-bold">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      <span>{selectedCandidate.rating} / 5.0</span>
                    </div>
                  </div>
                </div>

                {/* Contact Links */}
                <div className="flex flex-wrap items-center gap-4 text-xs">
                  <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                    <Mail className="w-4 h-4 text-brand-500" />
                    <span dir="ltr">{selectedCandidate.email}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                    <Phone className="w-4 h-4 text-emerald-500" />
                    <span dir="ltr">{selectedCandidate.phone}</span>
                  </div>
                  {selectedCandidate.linkedinUrl && (
                    <a
                      href={selectedCandidate.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-blue-500 hover:underline"
                    >
                      <Link2 className="w-4 h-4" />
                      <span>LinkedIn</span>
                    </a>
                  )}
                  {selectedCandidate.githubUrl && (
                    <a
                      href={selectedCandidate.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 hover:underline"
                    >
                      <Code2 className="w-4 h-4" />
                      <span>GitHub / Portfolio</span>
                    </a>
                  )}
                </div>

                {/* Summary Bio */}
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white mb-1.5">
                    {t("professionalSummaryLabel")}
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/50 p-3.5 rounded-xl border border-slate-100 dark:border-slate-800">
                    {selectedCandidate.summary}
                  </p>
                </div>

                {/* Skills */}
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white mb-2">
                    {t("candidateSkills")}
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedCandidate.skills.map((skill, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-lg bg-brand-500/10 text-brand-600 dark:text-brand-400 text-xs font-bold border border-brand-500/20"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: Document / Resume Preview */}
            {activeModalTab === "document" && (
              <div className="p-6 sm:p-8 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-6 text-xs animate-in fade-in">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-4">
                  <div>
                    <h3 className="text-lg font-black text-slate-900 dark:text-white">
                      {selectedCandidate.fullName}
                    </h3>
                    <p className="text-brand-600 dark:text-brand-400 font-bold">
                      {selectedCandidate.targetTitle}
                    </p>
                  </div>
                  <div className="text-end text-[11px] text-slate-400">
                    <div>{selectedCandidate.city}, {selectedCandidate.country}</div>
                    <div dir="ltr">{selectedCandidate.email}</div>
                  </div>
                </div>

                {/* Section: Summary */}
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider mb-1 border-b border-slate-200 dark:border-slate-700 pb-1">
                    {language === "ar" ? "الملخص التنفيذي" : "Executive Summary"}
                  </h4>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed mt-2">
                    {selectedCandidate.summary}
                  </p>
                </div>

                {/* Section: Experience */}
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider mb-2 border-b border-slate-200 dark:border-slate-700 pb-1">
                    {language === "ar" ? "الخبرات المهنية" : "Work Experience"}
                  </h4>
                  <div className="space-y-3">
                    <div>
                      <div className="flex items-center justify-between font-bold text-slate-900 dark:text-white">
                        <span>{selectedCandidate.currentTitle}</span>
                        <span className="text-slate-400 text-[11px]">2021 - {language === "ar" ? "حتى الآن" : "Present"}</span>
                      </div>
                      <p className="text-slate-500">{selectedCandidate.currentCompany || "Leading Enterprise KSA"}</p>
                    </div>
                  </div>
                </div>

                {/* Section: Education */}
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider mb-2 border-b border-slate-200 dark:border-slate-700 pb-1">
                    {language === "ar" ? "التعليم والمؤهلات" : "Education & Credentials"}
                  </h4>
                  <p className="font-semibold text-slate-800 dark:text-slate-200">
                    {selectedCandidate.education}
                  </p>
                </div>
              </div>
            )}

            {/* TAB 3: HR Notes */}
            {activeModalTab === "notes" && (
              <div className="space-y-4 animate-in fade-in">
                <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-700 dark:text-amber-300 flex items-start gap-2">
                  <Star className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span>
                    {language === "ar"
                      ? "هذه الملاحظات سرية وخاصة بفريق الموارد البشرية والاستقطاب فقط ولن يتم إظهارها للمرشح أو العميل."
                      : "These notes are confidential and visible only to Al-Ekhlas internal HR and recruiters."}
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-900 dark:text-white mb-2">
                    {language === "ar" ? "تقييم المقابلات وملاحظات الاستشاري" : "Recruiter Evaluation Notes"}
                  </label>
                  <textarea
                    rows={6}
                    value={hrNotesInput}
                    onChange={(e) => setHrNotesInput(e.target.value)}
                    placeholder={language === "ar" ? "أدخل تقييم المرشح، نقاط القوة، التوافق الثقافي..." : "Enter candidate evaluation notes, strengths, cultural fit..."}
                    className="w-full p-4 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500 outline-none leading-relaxed"
                  />
                </div>

                <button
                  onClick={handleSaveHrNotes}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-brand-600 hover:bg-brand-500 shadow-md transition-all"
                >
                  <Save className="w-4 h-4" />
                  <span>{t("saveNotesBtn")}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
