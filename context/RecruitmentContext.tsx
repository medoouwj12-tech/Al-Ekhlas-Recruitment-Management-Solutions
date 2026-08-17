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

export interface DbStatusInfo {
  connected: boolean;
  provider: string;
  message: string;
  counts?: {
    orders: number;
    candidates: number;
    notifications: number;
  };
}

interface RecruitmentContextType {
  employerRequests: EmployerRequest[];
  candidates: Candidate[];
  notifications: NotificationItem[];
  unreadNotificationCount: number;
  toasts: ToastData[];
  dbStatus: DbStatusInfo;
  
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
  
  // Reset & Sync
  refreshFromDatabase: () => Promise<void>;
  resetToDefaultData: () => Promise<void>;
}

const RecruitmentContext = createContext<RecruitmentContextType | undefined>(undefined);

export const RecruitmentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [employerRequests, setEmployerRequests] = useState<EmployerRequest[]>(initialEmployerRequests);
  const [candidates, setCandidates] = useState<Candidate[]>(initialCandidates);
  const [notifications, setNotifications] = useState<NotificationItem[]>(initialNotifications);
  const [toasts, setToasts] = useState<ToastData[]>([]);
  const [mounted, setMounted] = useState(false);
  const [dbStatus, setDbStatus] = useState<DbStatusInfo>({
    connected: false,
    provider: "MongoDB Atlas / Local Cache",
    message: "Initializing database...",
  });

  // Fetch from MongoDB / API routes and fallback to localStorage
  const refreshFromDatabase = async () => {
    try {
      // 1. Check DB Health
      const statusRes = await fetch("/api/status");
      if (statusRes.ok) {
        const statusData = await statusRes.json();
        setDbStatus({
          connected: statusData.connected,
          provider: statusData.provider || "MongoDB Atlas",
          message: statusData.message || (statusData.connected ? "Connected" : "Disconnected"),
          counts: statusData.counts,
        });
      }

      // 2. Fetch Orders
      const ordersRes = await fetch("/api/employers");
      if (ordersRes.ok) {
        const ordersData = await ordersRes.json();
        if (ordersData.success && Array.isArray(ordersData.data) && ordersData.data.length > 0) {
          setEmployerRequests(ordersData.data);
          localStorage.setItem("al_ekhlas_orders", JSON.stringify(ordersData.data));
        }
      }

      // 3. Fetch Candidates
      const candRes = await fetch("/api/candidates");
      if (candRes.ok) {
        const candData = await candRes.json();
        if (candData.success && Array.isArray(candData.data) && candData.data.length > 0) {
          setCandidates(candData.data);
          localStorage.setItem("al_ekhlas_candidates", JSON.stringify(candData.data));
        }
      }

      // 4. Fetch Notifications
      const notifRes = await fetch("/api/notifications");
      if (notifRes.ok) {
        const notifData = await notifRes.json();
        if (notifData.success && Array.isArray(notifData.data)) {
          setNotifications(notifData.data);
          localStorage.setItem("al_ekhlas_notifications", JSON.stringify(notifData.data));
        }
      }
    } catch (e) {
      console.warn("Using offline / local storage state mode.", e);
    }
  };

  // Initialize data on mount
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
    refreshFromDatabase();
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

    // Async sync with MongoDB API
    fetch("/api/employers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newRequest),
    }).catch((err) => console.warn("API sync background error", err));

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

    fetch(`/api/employers/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    }).catch((err) => console.warn("API sync error", err));
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

    fetch(`/api/employers/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ notes }),
    }).catch((err) => console.warn("API sync error", err));
  };

  const deleteEmployerRequest = (id: string) => {
    setEmployerRequests((prev) => prev.filter((o) => o.id !== id));
    triggerToast("تم حذف الطلب", `تمت إزالة الطلب ${id}`, "warning");

    fetch(`/api/employers/${id}`, {
      method: "DELETE",
    }).catch((err) => console.warn("API sync error", err));
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

    fetch("/api/candidates", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newCand),
    }).catch((err) => console.warn("API sync error", err));

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

    fetch(`/api/candidates/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    }).catch((err) => console.warn("API sync error", err));
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

    fetch(`/api/candidates/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ hrNotes }),
    }).catch((err) => console.warn("API sync error", err));
  };

  const deleteCandidate = (id: string) => {
    setCandidates((prev) => prev.filter((c) => c.id !== id));
    triggerToast("تم حذف المرشح", `تمت إزالة ملف المرشح ${id}`, "warning");

    fetch(`/api/candidates/${id}`, {
      method: "DELETE",
    }).catch((err) => console.warn("API sync error", err));
  };

  // Assign / Remove Candidate to Order
  const assignCandidateToOrder = (orderId: string, candidateId: string) => {
    setEmployerRequests((prev) =>
      prev.map((order) => {
        if (order.id === orderId) {
          const current = order.assignedCandidateIds || [];
          if (!current.includes(candidateId)) {
            const updated = {
              ...order,
              assignedCandidateIds: [...current, candidateId],
              status: (order.status === "new" ? "shortlisting" : order.status) as RequestStatus,
              updatedAt: new Date().toISOString(),
            };
            fetch(`/api/employers/${orderId}`, {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(updated),
            }).catch(() => {});
            return updated;
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
            const updated = {
              ...cand,
              matchedEmployerIds: [...current, orderId],
              status: (cand.status === "available" ? "shortlisted" : cand.status) as CandidateStatus,
              updatedAt: new Date().toISOString(),
            };
            fetch(`/api/candidates/${candidateId}`, {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(updated),
            }).catch(() => {});
            return updated;
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
          const updated = {
            ...order,
            assignedCandidateIds: (order.assignedCandidateIds || []).filter((cid) => cid !== candidateId),
            updatedAt: new Date().toISOString(),
          };
          fetch(`/api/employers/${orderId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updated),
          }).catch(() => {});
          return updated;
        }
        return order;
      })
    );

    setCandidates((prev) =>
      prev.map((cand) => {
        if (cand.id === candidateId) {
          const updated = {
            ...cand,
            matchedEmployerIds: (cand.matchedEmployerIds || []).filter((oid) => oid !== orderId),
            updatedAt: new Date().toISOString(),
          };
          fetch(`/api/candidates/${candidateId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updated),
          }).catch(() => {});
          return updated;
        }
        return cand;
      })
    );

    triggerToast("تمت إزالة المرشح", `تم فك ارتباط المرشح ${candidateId} من الطلب ${orderId}`, "info");
  };

  // Smart Matching Engine
  const calculateMatchScore = (order: EmployerRequest, candidate: Candidate): MatchScore => {
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
    fetch("/api/notifications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    }).catch(() => {});
  };

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    triggerToast("تم تحديد الإشعارات كمقروءة", "تم تحديث كافة التنبيهات", "info");
    fetch("/api/notifications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ markAll: true }),
    }).catch(() => {});
  };

  const resetToDefaultData = async () => {
    setEmployerRequests(initialEmployerRequests);
    setCandidates(initialCandidates);
    setNotifications(initialNotifications);
    localStorage.setItem("al_ekhlas_orders", JSON.stringify(initialEmployerRequests));
    localStorage.setItem("al_ekhlas_candidates", JSON.stringify(initialCandidates));
    localStorage.setItem("al_ekhlas_notifications", JSON.stringify(initialNotifications));
    
    try {
      await fetch("/api/seed", { method: "POST" });
    } catch {}

    triggerToast("تمت استعادة البيانات الافتراضية", "تمت مزامنة قاعدة البيانات والأوامر", "info");
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
        dbStatus,
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
        refreshFromDatabase,
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
