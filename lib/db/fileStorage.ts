import fs from "fs";
import path from "path";
import { Candidate, EmployerRequest, NotificationItem } from "../types";
import { initialCandidates, initialEmployerRequests, initialNotifications } from "../mockData";

const DATA_DIR = path.join(process.cwd(), "data");
const DB_FILE = path.join(DATA_DIR, "recruitment_db.json");

export interface DatabaseSchema {
  orders: EmployerRequest[];
  candidates: Candidate[];
  notifications: NotificationItem[];
  lastUpdated: string;
}

function ensureDbFile(): DatabaseSchema {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    if (!fs.existsSync(DB_FILE)) {
      const initialDb: DatabaseSchema = {
        orders: initialEmployerRequests,
        candidates: initialCandidates,
        notifications: initialNotifications,
        lastUpdated: new Date().toISOString(),
      };
      fs.writeFileSync(DB_FILE, JSON.stringify(initialDb, null, 2), "utf-8");
      return initialDb;
    }

    const content = fs.readFileSync(DB_FILE, "utf-8");
    if (!content.trim()) {
      const initialDb: DatabaseSchema = {
        orders: initialEmployerRequests,
        candidates: initialCandidates,
        notifications: initialNotifications,
        lastUpdated: new Date().toISOString(),
      };
      fs.writeFileSync(DB_FILE, JSON.stringify(initialDb, null, 2), "utf-8");
      return initialDb;
    }

    return JSON.parse(content);
  } catch (error) {
    console.error("Error reading database file, using default data:", error);
    return {
      orders: initialEmployerRequests,
      candidates: initialCandidates,
      notifications: initialNotifications,
      lastUpdated: new Date().toISOString(),
    };
  }
}

function saveDb(data: DatabaseSchema): void {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    data.lastUpdated = new Date().toISOString();
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf-8");
  } catch (error) {
    console.error("Error writing to database file:", error);
  }
}

// ----------------- ORDERS -----------------
export function getStoredOrders(): EmployerRequest[] {
  const db = ensureDbFile();
  return db.orders || [];
}

export function saveStoredOrder(order: EmployerRequest): EmployerRequest {
  const db = ensureDbFile();
  const existingIdx = db.orders.findIndex((o) => o.id === order.id);
  if (existingIdx >= 0) {
    db.orders[existingIdx] = order;
  } else {
    db.orders.unshift(order);
  }

  // Create notification
  const notif: NotificationItem = {
    id: `NOTIF-${Date.now()}`,
    title: `طلب توظيف جديد من ${order.companyName}`,
    titleEn: `New Hiring Request from ${order.companyName}`,
    message: `تم تقديم طلب لشغل وظيفة "${order.jobTitle}" بنجاح`,
    messageEn: `Job request submitted for "${order.jobTitle}"`,
    type: "employer_request",
    createdAt: new Date().toISOString(),
    read: false,
    link: "/admin/employers",
  };
  db.notifications.unshift(notif);

  saveDb(db);
  return order;
}

export function updateStoredOrder(id: string, updates: Partial<EmployerRequest>): EmployerRequest | null {
  const db = ensureDbFile();
  const idx = db.orders.findIndex((o) => o.id === id);
  if (idx >= 0) {
    db.orders[idx] = { ...db.orders[idx], ...updates, updatedAt: new Date().toISOString() };
    saveDb(db);
    return db.orders[idx];
  }
  return null;
}

export function deleteStoredOrder(id: string): boolean {
  const db = ensureDbFile();
  const initialLength = db.orders.length;
  db.orders = db.orders.filter((o) => o.id !== id);
  if (db.orders.length !== initialLength) {
    saveDb(db);
    return true;
  }
  return false;
}

// ----------------- CANDIDATES -----------------
export function getStoredCandidates(): Candidate[] {
  const db = ensureDbFile();
  return db.candidates || [];
}

export function saveStoredCandidate(candidate: Candidate): Candidate {
  const db = ensureDbFile();
  const existingIdx = db.candidates.findIndex((c) => c.id === candidate.id);
  if (existingIdx >= 0) {
    db.candidates[existingIdx] = candidate;
  } else {
    db.candidates.unshift(candidate);
  }

  // Create notification
  const notif: NotificationItem = {
    id: `NOTIF-${Date.now()}`,
    title: `مرشح جديد: ${candidate.fullName}`,
    titleEn: `New Candidate: ${candidate.fullName}`,
    message: `تم تسجيل ملف مهني جديد في تخصص "${candidate.category}" (${candidate.targetTitle})`,
    messageEn: `New profile registered for "${candidate.targetTitle}"`,
    type: "candidate_applied",
    createdAt: new Date().toISOString(),
    read: false,
    link: "/admin/candidates",
  };
  db.notifications.unshift(notif);

  saveDb(db);
  return candidate;
}

export function updateStoredCandidate(id: string, updates: Partial<Candidate>): Candidate | null {
  const db = ensureDbFile();
  const idx = db.candidates.findIndex((c) => c.id === id);
  if (idx >= 0) {
    db.candidates[idx] = { ...db.candidates[idx], ...updates, updatedAt: new Date().toISOString() };
    saveDb(db);
    return db.candidates[idx];
  }
  return null;
}

export function deleteStoredCandidate(id: string): boolean {
  const db = ensureDbFile();
  const initialLength = db.candidates.length;
  db.candidates = db.candidates.filter((c) => c.id !== id);
  if (db.candidates.length !== initialLength) {
    saveDb(db);
    return true;
  }
  return false;
}

// ----------------- NOTIFICATIONS -----------------
export function getStoredNotifications(): NotificationItem[] {
  const db = ensureDbFile();
  return db.notifications || [];
}

export function updateStoredNotifications(id?: string, markAll?: boolean): NotificationItem[] {
  const db = ensureDbFile();
  if (markAll) {
    db.notifications = db.notifications.map((n) => ({ ...n, read: true }));
  } else if (id) {
    db.notifications = db.notifications.map((n) => (n.id === id ? { ...n, read: true } : n));
  }
  saveDb(db);
  return db.notifications;
}

// ----------------- RESET / SEED -----------------
export function resetStoredDb(): DatabaseSchema {
  const initialDb: DatabaseSchema = {
    orders: initialEmployerRequests,
    candidates: initialCandidates,
    notifications: initialNotifications,
    lastUpdated: new Date().toISOString(),
  };
  saveDb(initialDb);
  return initialDb;
}
