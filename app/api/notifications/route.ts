import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db/mongodb";
import { NotificationModel } from "@/lib/models/Notification";
import { initialNotifications } from "@/lib/mockData";

export async function GET(req: NextRequest) {
  try {
    const conn = await connectToDatabase();
    if (!conn) {
      return NextResponse.json({ success: true, source: "mock", data: initialNotifications });
    }

    let notifications = await NotificationModel.find({}).sort({ createdAt: -1 }).lean();

    if (!notifications || notifications.length === 0) {
      await NotificationModel.insertMany(initialNotifications);
      notifications = await NotificationModel.find({}).sort({ createdAt: -1 }).lean();
    }

    return NextResponse.json({ success: true, source: "mongodb", data: notifications });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const conn = await connectToDatabase();

    if (conn) {
      if (body.markAll) {
        await NotificationModel.updateMany({}, { read: true });
      } else if (body.id) {
        await NotificationModel.findOneAndUpdate({ id: body.id }, { read: true });
      }
      const notifications = await NotificationModel.find({}).sort({ createdAt: -1 }).lean();
      return NextResponse.json({ success: true, data: notifications });
    }

    return NextResponse.json({ success: true, source: "mock" });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
