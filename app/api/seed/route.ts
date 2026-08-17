import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db/mongodb";
import { EmployerRequestModel } from "@/lib/models/EmployerRequest";
import { CandidateModel } from "@/lib/models/Candidate";
import { NotificationModel } from "@/lib/models/Notification";
import { initialCandidates, initialEmployerRequests, initialNotifications } from "@/lib/mockData";

export async function POST(req: NextRequest) {
  try {
    const conn = await connectToDatabase();
    if (!conn) {
      return NextResponse.json({
        success: false,
        message: "MongoDB is not connected. Please provide MONGODB_URI.",
      }, { status: 400 });
    }

    // Clear existing
    await EmployerRequestModel.deleteMany({});
    await CandidateModel.deleteMany({});
    await NotificationModel.deleteMany({});

    // Insert fresh seed data
    await EmployerRequestModel.insertMany(initialEmployerRequests);
    await CandidateModel.insertMany(initialCandidates);
    await NotificationModel.insertMany(initialNotifications);

    return NextResponse.json({
      success: true,
      message: "Database seeded successfully with initial data!",
      counts: {
        orders: initialEmployerRequests.length,
        candidates: initialCandidates.length,
        notifications: initialNotifications.length,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
