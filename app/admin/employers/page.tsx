"use client";

import React, { useState } from "react";
import { useRecruitment } from "@/context/RecruitmentContext";
import { useLanguage } from "@/context/LanguageContext";
import { EmployerRequest, RequestStatus, IndustryCategory } from "@/lib/types";
import { 
  Building2, 
  Search, 
  Filter, 
  Plus, 
  Eye, 
  Download, 
  Sparkles, 
  Trash2, 
  CheckCircle2, 
  X, 
  Clock, 
  Users, 
  FileText,
  Mail,
  Phone,
  Globe,
  MapPin,
  Briefcase
} from "lucide-react";
import Link from "next/link";
import { formatCurrency, formatDate, getStatusColor } from "@/lib/utils";

export default function AdminEmployersPage() {
  const { employerRequests, candidates, updateEmployerStatus, updateEmployerNotes, deleteEmployerRequest, removeCandidateFromOrder } = useRecruitment();
  const { t, language, dir } = useLanguage();

  const [search, setSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedIndustry, setSelectedIndustry] = useState<string>("all");
  const [selectedOrder, setSelectedOrder] = useState<EmployerRequest | null>(null);
  const [orderNotes, setOrderNotes] = useState("");

  // Filters
  const filteredOrders = employerRequests.filter((order) => {
    const matchesSearch =
      order.companyName.toLowerCase().includes(search.toLowerCase()) ||
      order.jobTitle.toLowerCase().includes(search.toLowerCase()) ||
      order.id.toLowerCase().includes(search.toLowerCase()) ||
      order.contactPerson.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = selectedStatus === "all" || order.status === selectedStatus;
    const matchesIndustry = selectedIndustry === "all" || order.industry === selectedIndustry;

    return matchesSearch && matchesStatus && matchesIndustry;
  });

  const openOrderModal = (order: EmployerRequest) => {
    setSelectedOrder(order);
    setOrderNotes(order.notes || "");
  };

  const handleSaveNotes = () => {
    if (selectedOrder) {
      updateEmployerNotes(selectedOrder.id, orderNotes);
      setSelectedOrder({ ...selectedOrder, notes: orderNotes });
    }
  };

  const handleStatusChange = (newStatus: RequestStatus) => {
    if (selectedOrder) {
      updateEmployerStatus(selectedOrder.id, newStatus);
      setSelectedOrder({ ...selectedOrder, status: newStatus });
    }
  };

  const assignedCandidates = selectedOrder
    ? candidates.filter((c) => selectedOrder.assignedCandidateIds?.includes(c.id))
    : [];

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            {t("ordersTitle")}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            {t("ordersSubtitle")}
          </p>
        </div>

        <Link
          href="/employers"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-brand-600 hover:bg-brand-500 shadow-md shadow-brand-500/20 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>{t("newOrderBtn")}</span>
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
            placeholder={t("adminSearchPlaceholder")}
            className="w-full ps-9 pe-4 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>

        {/* Status Filter */}
        <div className="w-full md:w-48">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            <option value="all">{t("allStatuses")}</option>
            <option value="new">{t("status_new")}</option>
            <option value="in_progress">{t("status_in_progress")}</option>
            <option value="shortlisting">{t("status_shortlisting")}</option>
            <option value="interviewing">{t("status_interviewing")}</option>
            <option value="completed">{t("status_completed")}</option>
            <option value="cancelled">{t("status_cancelled")}</option>
          </select>
        </div>

        {/* Industry Filter */}
        <div className="w-full md:w-48">
          <select
            value={selectedIndustry}
            onChange={(e) => setSelectedIndustry(e.target.value)}
            className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            <option value="all">{t("allIndustries")}</option>
            <option value="technology">{t("ind_technology")}</option>
            <option value="finance_banking">{t("ind_finance_banking")}</option>
            <option value="engineering">{t("ind_engineering")}</option>
            <option value="healthcare">{t("ind_healthcare")}</option>
            <option value="marketing_sales">{t("ind_marketing_sales")}</option>
            <option value="operations_logistics">{t("ind_operations_logistics")}</option>
            <option value="hr_admin">{t("ind_hr_admin")}</option>
          </select>
        </div>
      </div>

      {/* Orders Data Table */}
      <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-start text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 text-slate-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4 text-start">{t("tableColCompany")}</th>
                <th className="py-3.5 px-4 text-start">{t("tableColJobTitle")}</th>
                <th className="py-3.5 px-4 text-start">{t("tableColIndustry")}</th>
                <th className="py-3.5 px-4 text-start">{t("tableColLevel")}</th>
                <th className="py-3.5 px-4 text-start">{t("tableColDate")}</th>
                <th className="py-3.5 px-4 text-start">{t("tableColStatus")}</th>
                <th className="py-3.5 px-4 text-end">{t("tableColActions")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    {t("noOrdersFound")}
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => {
                  const statusStyle = getStatusColor(order.status);
                  return (
                    <tr
                      key={order.id}
                      className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      {/* Company & Contact */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900 dark:text-white">
                          {order.companyName}
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5">
                          {order.contactPerson} • {order.city}
                        </div>
                      </td>

                      {/* Job Title & Salary */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900 dark:text-white">
                          {order.jobTitle}
                        </div>
                        <div className="text-[11px] text-brand-600 dark:text-brand-400 font-semibold mt-0.5">
                          {formatCurrency(order.minSalary, order.currency, language)} - {formatCurrency(order.maxSalary, order.currency, language)}
                        </div>
                      </td>

                      {/* Industry */}
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium">
                          {(t as any)(`ind_${order.industry}`)}
                        </span>
                      </td>

                      {/* Level & Type */}
                      <td className="py-3.5 px-4">
                        <div className="font-medium text-slate-700 dark:text-slate-300">
                          {(t as any)(`exp_${order.experienceLevel}`)}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {(t as any)(`type_${order.jobType.replace("-", "_")}`)}
                        </div>
                      </td>

                      {/* Date */}
                      <td className="py-3.5 px-4 text-slate-500">
                        {formatDate(order.submittedAt, language)}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-bold border ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border}`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${statusStyle.dot}`} />
                          <span>{(t as any)(`status_${order.status}`)}</span>
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-end">
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            onClick={() => openOrderModal(order)}
                            className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-brand-500 transition-colors"
                            title={t("viewDetails")}
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <Link
                            href={`/admin/matchmaker?orderId=${order.id}`}
                            className="p-1.5 rounded-lg text-amber-500 hover:bg-amber-500/10 transition-colors"
                            title={t("assignCandidate")}
                          >
                            <Sparkles className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => deleteEmployerRequest(order.id)}
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

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-6">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-brand-500 px-2 py-0.5 rounded bg-brand-500/10">
                    {selectedOrder.id}
                  </span>
                  <span className="text-xs text-slate-400">
                    {formatDate(selectedOrder.submittedAt, language)}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-1">
                  {selectedOrder.jobTitle}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {selectedOrder.companyName} • {selectedOrder.contactPerson}
                </p>
              </div>

              <button
                onClick={() => setSelectedOrder(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Status Change Control */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  {t("changeStatus")}:
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-1.5">
                {(["new", "in_progress", "shortlisting", "interviewing", "completed", "cancelled"] as RequestStatus[]).map((st) => (
                  <button
                    key={st}
                    onClick={() => handleStatusChange(st)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      selectedOrder.status === st
                        ? "bg-brand-600 text-white shadow-sm"
                        : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    {(t as any)(`status_${st}`)}
                  </button>
                ))}
              </div>
            </div>

            {/* Specs Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 text-xs">
              <div>
                <span className="text-slate-400 block">{t("tableColIndustry")}</span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {(t as any)(`ind_${selectedOrder.industry}`)}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block">{t("experienceLevelLabel")}</span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {(t as any)(`exp_${selectedOrder.experienceLevel}`)}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block">{t("salaryRangeLabel")}</span>
                <span className="font-bold text-brand-600 dark:text-brand-400">
                  {formatCurrency(selectedOrder.minSalary, selectedOrder.currency, language)} - {formatCurrency(selectedOrder.maxSalary, selectedOrder.currency, language)}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block">{t("openingsCountLabel")}</span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {selectedOrder.numberOfOpenings} {language === "ar" ? "شواغر" : "positions"}
                </span>
              </div>
            </div>

            {/* Contact Details */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                <Mail className="w-4 h-4 text-brand-500 flex-shrink-0" />
                <span dir="ltr">{selectedOrder.email}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                <Phone className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                <span dir="ltr">{selectedOrder.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                <MapPin className="w-4 h-4 text-amber-500 flex-shrink-0" />
                <span>{selectedOrder.city}, {selectedOrder.country}</span>
              </div>
            </div>

            {/* Description & Requirements */}
            <div className="space-y-3 text-xs">
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white mb-1">
                  {t("jobDescriptionLabel")}
                </h4>
                <p className="text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl leading-relaxed">
                  {selectedOrder.jobDescription}
                </p>
              </div>

              {selectedOrder.requiredSkills?.length > 0 && (
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white mb-1.5">
                    {t("requiredSkillsLabel")}
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedOrder.requiredSkills.map((skill, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-lg bg-brand-500/10 text-brand-600 dark:text-brand-400 font-semibold border border-brand-500/20"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Assigned Shortlisted Candidates */}
            <div className="space-y-3 pt-3 border-t border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Users className="w-4 h-4 text-brand-500" />
                  <span>{language === "ar" ? "المرشحون المخصصون في القائمة المختصرة" : "Assigned Shortlist Candidates"}</span>
                  <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-[10px] font-bold">
                    {assignedCandidates.length}
                  </span>
                </h4>

                <Link
                  href={`/admin/matchmaker?orderId=${selectedOrder.id}`}
                  className="text-xs font-bold text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{language === "ar" ? "إضافة مرشحين عبر المطابق الذكي" : "Match More"}</span>
                </Link>
              </div>

              {assignedCandidates.length === 0 ? (
                <p className="text-xs text-slate-400 italic">
                  {language === "ar" ? "لم يتم ربط أي مرشحين بهذا الطلب بعد." : "No candidates assigned to this order yet."}
                </p>
              ) : (
                <div className="space-y-2">
                  {assignedCandidates.map((cand) => (
                    <div
                      key={cand.id}
                      className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-3 text-xs"
                    >
                      <div>
                        <span className="font-bold text-slate-900 dark:text-white block">
                          {cand.fullName}
                        </span>
                        <span className="text-slate-400 text-[11px]">
                          {cand.currentTitle} • {cand.yearsOfExperience} {language === "ar" ? "سنوات خبرة" : "yrs exp"}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => removeCandidateFromOrder(selectedOrder.id, cand.id)}
                          className="px-2.5 py-1 rounded-lg text-rose-500 hover:bg-rose-500/10 text-[11px] font-semibold"
                        >
                          {language === "ar" ? "إزالة من القائمة" : "Remove"}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Internal Notes Editor */}
            <div className="space-y-2 pt-3 border-t border-slate-200 dark:border-slate-800">
              <label className="block text-xs font-bold text-slate-900 dark:text-white">
                {language === "ar" ? "ملاحظات فريق التوظيف الداخلية" : "Internal Recruitment Notes"}
              </label>
              <textarea
                rows={3}
                value={orderNotes}
                onChange={(e) => setOrderNotes(e.target.value)}
                placeholder={language === "ar" ? "أدخل أي ملاحظات خاصة بالعميل أو نتائج المقابلات..." : "Enter internal notes or client preferences..."}
                className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500 outline-none"
              />
              <button
                onClick={handleSaveNotes}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-brand-600 hover:bg-brand-500 shadow-sm"
              >
                {t("save")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
