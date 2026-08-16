"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { Candidate, CandidateStatus, EmployerRequest, MatchScore, NotificationItem, RequestStatus } from "@/lib/types";
import { initialCandidates, initialEmployerRequests, initialNotifications } from "@/lib/mockData";

export interface ToastData {
  id: string;
  title: string;
  message: string;
  type: "success" | "info" | "warning";
}

interface RecruitmentContextType {
  employerRequests: EmployerRequest[];
  candidates: Candidate[];
  notifications: NotificationItem[];
  unreadNotificationCount: number;
  toasts: ToastData[];
  
  // Employer Actions
  addEmployerRequest: (data: Omit<EmployerRequest, "id" | "status" | "submittedAt" | "updatedAt" | "assignedCandidateIds">) => string;
  updateEmployerStatus: (id: string, status: RequestStatus) => void;
  updateEmployerNotes: (id: string, notes: string) => void;
  deleteEmployerRequest: (id: string) => void;
  
  // Candidate Actions
  addCandidate: (data: Omit<Candidate, "id" | "status" | "rating" | "submittedAt" | "updatedAt" | "matchedEmployerIds">) => string;
  updateCandidateStatus: (id: string, status: CandidateStatus) => void;
  updateCandidateNotes: (id: string, hrNotes: string) => void;
  deleteCandidate: (id: string) => void;
  
  // Matching & Assignment
  assignCandidateToOrder: (orderId: string, candidateId: string) => void;
  removeCandidateFromOrder: (orderId: string, candidateId: string) => void;
  calculateMatchScore: (order: EmployerRequest, candidate: Candidate) => MatchScore;
  getMatchesForOrder: (orderId: string) => { candidate: Candidate; score: MatchScore }[];
  
  // Notifications & Toasts
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  triggerToast: (title: string, message: string, type?: "success" | "info" | "warning") => void;
  removeToast: (id: string) => void;
  
  // Reset demo
  resetToDefaultData: () => void;
}

const RecruitmentContext = createContext<RecruitmentContextType | undefined>(undefined);

export const RecruitmentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [employerRequests, setEmployerRequests] = useState<EmployerRequest[]>(initialEmployerRequests);
  const [candidates, setCandidates] = useState<Candidate[]>(initialCandidates);
  const [notifications, setNotifications] = useState<NotificationItem[]>(initialNotifications);
  const [toasts, setToasts] = useState<ToastData[]>([]);
  const [mounted, setMounted] = useState(false);

  // Initialize data from localStorage safely
  useEffect(() => {
    try {
      const savedOrders = localStorage.getItem("al_ekhlas_orders");
      if (savedOrders && savedOrders !== "undefined" && savedOrders !== "null") {
        const parsed = JSON.parse(savedOrders);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setEmployerRequests(parsed);
        }
      }
    } catch {}

    try {
      const savedCandidates = localStorage.getItem("al_ekhlas_candidates");
      if (savedCandidates && savedCandidates !== "undefined" && savedCandidates !== "null") {
        const parsed = JSON.parse(savedCandidates);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setCandidates(parsed);
        }
      }
    } catch {}

    try {
      const savedNotifications = localStorage.getItem("al_ekhlas_notifications");
      if (savedNotifications && savedNotifications !== "undefined" && savedNotifications !== "null") {
        const parsed = JSON.parse(savedNotifications);
        if (Array.isArray(parsed)) {
          setNotifications(parsed);
        }
      }
    } catch {}

    setMounted(true);
  }, []);

  // Save to localStorage on state changes
  useEffect(() => {
    if (mounted) {
      localStorage.setItem("al_ekhlas_orders", JSON.stringify(employerRequests));
    }
  }, [employerRequests, mounted]);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem("al_ekhlas_candidates", JSON.stringify(candidates));
    }
  }, [candidates, mounted]);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem("al_ekhlas_notifications", JSON.stringify(notifications));
    }
  }, [notifications, mounted]);

  // Toast System
  const triggerToast = (title: string, message: string, type: "success" | "info" | "warning" = "success") => {
    const id = "toast-" + Date.now() + Math.random().toString(36).substring(2, 5);
    const newToast: ToastData = { id, title, message, type };
    setToasts((prev) => [...prev, newToast]);

    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Employer Actions
  const addEmployerRequest = (data: Omit<EmployerRequest, "id" | "status" | "submittedAt" | "updatedAt" | "assignedCandidateIds">): string => {
    const newId = `EMP-2026-${String(employerRequests.length + 1).padStart(3, "0")}`;
    const now = new Date().toISOString();
    
    const newRequest: EmployerRequest = {
      ...data,
      id: newId,
      status: "new",
      submittedAt: now,
      updatedAt: now,
      assignedCandidateIds: [],
    };

    setEmployerRequests((prev) => [newRequest, ...prev]);

    // Create Notification
    const notifId = "NOTIF-" + Date.now();
    const newNotif: NotificationItem = {
      id: notifId,
      title: `طلب توظيف جديد من ${data.companyName}`,
      titleEn: `New Hiring Request from ${data.companyName}`,
      message: `تم تقديم طلب لشغل وظيفة "${data.jobTitle}" بنجاح`,
      messageEn: `Job request submitted for "${data.jobTitle}"`,
      type: "employer_request",
      createdAt: now,
      read: false,
      link: "/admin/employers",
    };

    setNotifications((prev) => [newNotif, ...prev]);
    triggerToast("تم استلام طلب الشركة بنجاح", `تم تسجيل طلب ${data.companyName} (${data.jobTitle})`, "success");

    return newId;
  };

  const updateEmployerStatus = (id: string, status: RequestStatus) => {
    setEmployerRequests((prev) =>
      prev.map((order) => {
        if (order.id === id) {
          return { ...order, status, updatedAt: new Date().toISOString() };
        }
        return order;
      })
    );
    triggerToast("تم تحديث حالة الطلب", `تم تغيير حالة الطلب ${id} إلى "${status}"`, "info");
  };

  const updateEmployerNotes = (id: string, notes: string) => {
    setEmployerRequests((prev) =>
      prev.map((order) => {
        if (order.id === id) {
          return { ...order, notes, updatedAt: new Date().toISOString() };
        }
        return order;
      })
    );
    triggerToast("تم حفظ الملاحظات", `تم تحديث الملاحظات الخاصة بالطلب ${id}`, "success");
  };

  const deleteEmployerRequest = (id: string) => {
    setEmployerRequests((prev) => prev.filter((o) => o.id !== id));
    triggerToast("تم حذف الطلب", `تمت إزالة الطلب ${id}`, "warning");
  };

  // Candidate Actions
  const addCandidate = (data: Omit<Candidate, "id" | "status" | "rating" | "submittedAt" | "updatedAt" | "matchedEmployerIds">): string => {
    const newId = `CAND-${100 + candidates.length + 1}`;
    const now = new Date().toISOString();

    const newCand: Candidate = {
      ...data,
      id: newId,
      status: "available",
      rating: 5,
      submittedAt: now,
      updatedAt: now,
      matchedEmployerIds: [],
    };

    setCandidates((prev) => [newCand, ...prev]);

    // Create Notification
    const notifId = "NOTIF-" + Date.now();
    const newNotif: NotificationItem = {
      id: notifId,
      title: `مرشح جديد: ${data.fullName}`,
      titleEn: `New Candidate: ${data.fullName}`,
      message: `تم تسجيل ملف مهني جديد في تخصص "${data.category}" (${data.targetTitle})`,
      messageEn: `New profile registered for "${data.targetTitle}"`,
      type: "candidate_applied",
      createdAt: now,
      read: false,
      link: "/admin/candidates",
    };

    setNotifications((prev) => [newNotif, ...prev]);
    triggerToast("تم استلام السيرة الذاتية", `تم تسجيل ${data.fullName} في شبكة الكفاءات بنجاح`, "success");

    return newId;
  };

  const updateCandidateStatus = (id: string, status: CandidateStatus) => {
    setCandidates((prev) =>
      prev.map((cand) => {
        if (cand.id === id) {
          return { ...cand, status, updatedAt: new Date().toISOString() };
        }
        return cand;
      })
    );
    triggerToast("تم تحديث حالة المرشح", `تم تغيير حالة ${id} بنجاح`, "info");
  };

  const updateCandidateNotes = (id: string, hrNotes: string) => {
    setCandidates((prev) =>
      prev.map((cand) => {
        if (cand.id === id) {
          return { ...cand, hrNotes, updatedAt: new Date().toISOString() };
        }
        return cand;
      })
    );
    triggerToast("تم حفظ ملاحظات HR", `تم تحديث الملاحظات السرية للمرشح ${id}`, "success");
  };

  const deleteCandidate = (id: string) => {
    setCandidates((prev) => prev.filter((c) => c.id !== id));
    triggerToast("تم حذف المرشح", `تمت إزالة ملف المرشح ${id}`, "warning");
  };

  // Assign / Remove Candidate to Order
  const assignCandidateToOrder = (orderId: string, candidateId: string) => {
    setEmployerRequests((prev) =>
      prev.map((order) => {
        if (order.id === orderId) {
          const current = order.assignedCandidateIds || [];
          if (!current.includes(candidateId)) {
            return {
              ...order,
              assignedCandidateIds: [...current, candidateId],
              status: order.status === "new" ? "shortlisting" : order.status,
              updatedAt: new Date().toISOString(),
            };
          }
        }
        return order;
      })
    );

    setCandidates((prev) =>
      prev.map((cand) => {
        if (cand.id === candidateId) {
          const current = cand.matchedEmployerIds || [];
          if (!current.includes(orderId)) {
            return {
              ...cand,
              matchedEmployerIds: [...current, orderId],
              status: cand.status === "available" ? "shortlisted" : cand.status,
              updatedAt: new Date().toISOString(),
            };
          }
        }
        return cand;
      })
    );

    triggerToast("تمت إضافة المرشح للقائمة المختصرة", `تم ربط المرشح ${candidateId} بالطلب ${orderId}`, "success");
  };

  const removeCandidateFromOrder = (orderId: string, candidateId: string) => {
    setEmployerRequests((prev) =>
      prev.map((order) => {
        if (order.id === orderId) {
          return {
            ...order,
            assignedCandidateIds: (order.assignedCandidateIds || []).filter((cid) => cid !== candidateId),
            updatedAt: new Date().toISOString(),
          };
        }
        return order;
      })
    );

    setCandidates((prev) =>
      prev.map((cand) => {
        if (cand.id === candidateId) {
          return {
            ...cand,
            matchedEmployerIds: (cand.matchedEmployerIds || []).filter((oid) => oid !== orderId),
            updatedAt: new Date().toISOString(),
          };
        }
        return cand;
      })
    );

    triggerToast("تمت إزالة المرشح", `تم فك ارتباط المرشح ${candidateId} من الطلب ${orderId}`, "info");
  };

  // Smart Matching Engine
  const calculateMatchScore = (order: EmployerRequest, candidate: Candidate): MatchScore => {
    // 1. Category Match (30%)
    let categoryScore = 0;
    if (order.industry === candidate.category) {
      categoryScore = 100;
    } else if (
      (order.industry === "technology" && candidate.skills.some((s) => ["React", "AWS", "Python", "Node.js", "Docker"].includes(s))) ||
      (order.industry === "finance_banking" && candidate.skills.some((s) => ["Risk Management", "SAMA Regulations", "AML"].includes(s)))
    ) {
      categoryScore = 65;
    } else {
      categoryScore = 30;
    }

    // 2. Skills Match (40%)
    const orderSkills = order.requiredSkills.map((s) => s.trim().toLowerCase());
    const candSkills = candidate.skills.map((s) => s.trim().toLowerCase());
    
    const matchedSkills: string[] = [];
    const missingSkills: string[] = [];

    orderSkills.forEach((reqSkill) => {
      const found = candSkills.some((cSkill) => cSkill.includes(reqSkill) || reqSkill.includes(cSkill));
      if (found) {
        matchedSkills.push(reqSkill);
      } else {
        missingSkills.push(reqSkill);
      }
    });

    const skillsScore = orderSkills.length > 0 ? Math.round((matchedSkills.length / orderSkills.length) * 100) : 70;

    // 3. Experience Match (20%)
    let expScore = 70;
    const years = candidate.yearsOfExperience;
    if (order.experienceLevel === "lead" || order.experienceLevel === "executive") {
      expScore = years >= 8 ? 100 : years >= 6 ? 80 : 50;
    } else if (order.experienceLevel === "senior") {
      expScore = years >= 5 ? 100 : years >= 3 ? 75 : 45;
    } else if (order.experienceLevel === "mid") {
      expScore = years >= 3 && years <= 7 ? 100 : years >= 2 ? 80 : 60;
    } else {
      expScore = years >= 1 ? 100 : 70;
    }

    // 4. Salary Budget Match (10%)
    let salaryScore = 80;
    if (candidate.expectedSalary <= order.maxSalary && candidate.expectedSalary >= order.minSalary * 0.9) {
      salaryScore = 100;
    } else if (candidate.expectedSalary <= order.maxSalary * 1.15) {
      salaryScore = 75;
    } else {
      salaryScore = 40;
    }

    const overallScore = Math.min(
      100,
      Math.round(categoryScore * 0.3 + skillsScore * 0.4 + expScore * 0.2 + salaryScore * 0.1)
    );

    return {
      candidateId: candidate.id,
      jobId: order.id,
      overallScore,
      breakdown: {
        categoryMatch: categoryScore,
        skillsMatch: skillsScore,
        experienceMatch: expScore,
        salaryMatch: salaryScore,
      },
      matchedSkills: order.requiredSkills.filter((s) => matchedSkills.includes(s.trim().toLowerCase())),
      missingSkills: order.requiredSkills.filter((s) => missingSkills.includes(s.trim().toLowerCase())),
    };
  };

  const getMatchesForOrder = (orderId: string): { candidate: Candidate; score: MatchScore }[] => {
    const order = employerRequests.find((o) => o.id === orderId);
    if (!order) return [];

    return candidates
      .map((candidate) => ({
        candidate,
        score: calculateMatchScore(order, candidate),
      }))
      .sort((a, b) => b.score.overallScore - a.score.overallScore);
  };

  // Notifications
  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    triggerToast("تم تحديد الإشعارات كمقروءة", "تم تحديث كافة التنبيهات", "info");
  };

  const resetToDefaultData = () => {
    setEmployerRequests(initialEmployerRequests);
    setCandidates(initialCandidates);
    setNotifications(initialNotifications);
    localStorage.setItem("al_ekhlas_orders", JSON.stringify(initialEmployerRequests));
    localStorage.setItem("al_ekhlas_candidates", JSON.stringify(initialCandidates));
    localStorage.setItem("al_ekhlas_notifications", JSON.stringify(initialNotifications));
    triggerToast("تمت استعادة البيانات التجريبية", "تمت إعادة ضبط كافة الأوامر وقاعدة الكفاءات", "info");
  };

  const unreadNotificationCount = notifications.filter((n) => !n.read).length;

  return (
    <RecruitmentContext.Provider
      value={{
        employerRequests,
        candidates,
        notifications,
        unreadNotificationCount,
        toasts,
        addEmployerRequest,
        updateEmployerStatus,
        updateEmployerNotes,
        deleteEmployerRequest,
        addCandidate,
        updateCandidateStatus,
        updateCandidateNotes,
        deleteCandidate,
        assignCandidateToOrder,
        removeCandidateFromOrder,
        calculateMatchScore,
        getMatchesForOrder,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        triggerToast,
        removeToast,
        resetToDefaultData,
      }}
    >
      {children}
    </RecruitmentContext.Provider>
  );
};

export const useRecruitment = (): RecruitmentContextType => {
  const context = useContext(RecruitmentContext);
  if (!context) {
    throw new Error("useRecruitment must be used within a RecruitmentProvider");
  }
  return context;
};
