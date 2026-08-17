import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db/mongodb";
import { EmployerRequestModel } from "@/lib/models/EmployerRequest";
import { CandidateModel } from "@/lib/models/Candidate";
import { NotificationModel } from "@/lib/models/Notification";
import { resetStoredDb, getStoredOrders, getStoredCandidates, getStoredNotifications } from "@/lib/db/fileStorage";

export async function POST(req: NextRequest) {
  try {
    // Always reset local file DB
    const freshDb = resetStoredDb();

    const conn = await connectToDatabase();
    if (conn) {
      await EmployerRequestModel.deleteMany({});
      await CandidateModel.deleteMany({});
      await NotificationModel.deleteMany({});
      await EmployerRequestModel.insertMany(freshDb.orders);
      await CandidateModel.insertMany(freshDb.candidates);
      await NotificationModel.insertMany(freshDb.notifications);
    }

    return NextResponse.json({
      success: true,
      message: "Database seeded successfully with initial data!",
      counts: {
        orders: freshDb.orders.length,
        candidates: freshDb.candidates.length,
        notifications: freshDb.notifications.length,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
