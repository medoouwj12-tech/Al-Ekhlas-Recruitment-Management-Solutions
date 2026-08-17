import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db/mongodb";
import { EmployerRequestModel } from "@/lib/models/EmployerRequest";
import { CandidateModel } from "@/lib/models/Candidate";
import { NotificationModel } from "@/lib/models/Notification";
import { getStoredOrders, getStoredCandidates, getStoredNotifications } from "@/lib/db/fileStorage";

export async function GET(req: NextRequest) {
  try {
    const hasEnv = Boolean(process.env.MONGODB_URI);
    const conn = await connectToDatabase();

    const fileOrders = getStoredOrders();
    const fileCandidates = getStoredCandidates();
    const fileNotifs = getStoredNotifications();

    if (!conn) {
      return NextResponse.json({
        connected: false,
        status: "file_storage",
        provider: "Persistent File Storage (recruitment_db.json)",
        hasEnv,
        message: "Data is permanently stored in the project file system. Configure MONGODB_URI for cloud sync.",
        counts: {
          orders: fileOrders.length,
          candidates: fileCandidates.length,
          notifications: fileNotifs.length,
        },
      });
    }

    const orderCount = await EmployerRequestModel.countDocuments();
    const candidateCount = await CandidateModel.countDocuments();
    const notifCount = await NotificationModel.countDocuments();

    return NextResponse.json({
      connected: true,
      status: "connected",
      provider: "MongoDB Atlas (Cloud NoSQL) + File Storage Backup",
      counts: {
        orders: Math.max(orderCount, fileOrders.length),
        candidates: Math.max(candidateCount, fileCandidates.length),
        notifications: Math.max(notifCount, fileNotifs.length),
      },
      databaseName: conn.connection.name,
      host: conn.connection.host,
      message: "Data is synchronized across MongoDB Atlas cloud database and local file backup.",
    });
  } catch (error: any) {
    return NextResponse.json({
      connected: false,
      status: "error",
      error: error.message,
    }, { status: 500 });
  }
}
