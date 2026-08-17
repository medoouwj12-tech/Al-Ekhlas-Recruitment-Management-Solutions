import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db/mongodb";
import { EmployerRequestModel } from "@/lib/models/EmployerRequest";
import { CandidateModel } from "@/lib/models/Candidate";
import { NotificationModel } from "@/lib/models/Notification";

export async function GET(req: NextRequest) {
  try {
    const hasEnv = Boolean(process.env.MONGODB_URI);
    const conn = await connectToDatabase();

    if (!conn) {
      return NextResponse.json({
        connected: false,
        status: "disconnected",
        provider: "Local Storage / Mock Mode",
        hasEnv,
        message: "MONGODB_URI is not configured in .env.local",
      });
    }

    const orderCount = await EmployerRequestModel.countDocuments();
    const candidateCount = await CandidateModel.countDocuments();
    const notifCount = await NotificationModel.countDocuments();

    return NextResponse.json({
      connected: true,
      status: "connected",
      provider: "MongoDB Atlas (Cloud NoSQL)",
      counts: {
        orders: orderCount,
        candidates: candidateCount,
        notifications: notifCount,
      },
      databaseName: conn.connection.name,
      host: conn.connection.host,
      message: "Connected and synchronized with MongoDB Atlas cloud database.",
    });
  } catch (error: any) {
    return NextResponse.json({
      connected: false,
      status: "error",
      error: error.message,
    }, { status: 500 });
  }
}
