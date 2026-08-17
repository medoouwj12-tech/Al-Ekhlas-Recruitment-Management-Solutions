import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db/mongodb";
import { EmployerRequestModel } from "@/lib/models/EmployerRequest";
import { CandidateModel } from "@/lib/models/Candidate";
import { NotificationModel } from "@/lib/models/Notification";
import { getStoredOrders, getStoredCandidates, getStoredNotifications } from "@/lib/db/fileStorage";

export async function POST(req: NextRequest) {
  try {
    // Never wipe the local file DB. This endpoint only syncs the file DB
    // into MongoDB (if connected) so partner/worker data is never lost.
    const fileOrders = getStoredOrders();
    const fileCandidates = getStoredCandidates();
    const fileNotifications = getStoredNotifications();

    const conn = await connectToDatabase();
    if (conn) {
      const orderCount = await EmployerRequestModel.countDocuments();
      if (orderCount === 0 && fileOrders.length > 0) {
        await EmployerRequestModel.insertMany(fileOrders);
      }
      const candidateCount = await CandidateModel.countDocuments();
      if (candidateCount === 0 && fileCandidates.length > 0) {
        await CandidateModel.insertMany(fileCandidates);
      }
      const notifCount = await NotificationModel.countDocuments();
      if (notifCount === 0 && fileNotifications.length > 0) {
        await NotificationModel.insertMany(fileNotifications);
      }
    }

    return NextResponse.json({
      success: true,
      message: "Data synchronized. Nothing was deleted.",
      synced: Boolean(conn),
      counts: {
        orders: fileOrders.length,
        candidates: fileCandidates.length,
        notifications: fileNotifications.length,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}