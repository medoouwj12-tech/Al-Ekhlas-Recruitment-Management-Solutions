import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db/mongodb";
import { NotificationModel } from "@/lib/models/Notification";
import { getStoredNotifications, updateStoredNotifications } from "@/lib/db/fileStorage";

export async function GET(req: NextRequest) {
  try {
    const conn = await connectToDatabase();
    if (!conn) {
      const fileNotifs = getStoredNotifications();
      return NextResponse.json({ success: true, source: "file_db", data: fileNotifs });
    }

    let notifications = await NotificationModel.find({}).sort({ createdAt: -1 }).lean();
    if (!notifications || notifications.length === 0) {
      const fileNotifs = getStoredNotifications();
      await NotificationModel.insertMany(fileNotifs);
      notifications = await NotificationModel.find({}).sort({ createdAt: -1 }).lean();
    }

    return NextResponse.json({ success: true, source: "mongodb", data: notifications });
  } catch (error: any) {
    const fileNotifs = getStoredNotifications();
    return NextResponse.json({ success: true, source: "file_db_fallback", data: fileNotifs });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const conn = await connectToDatabase();

    // Update in file DB
    const updated = updateStoredNotifications(body.id, body.markAll);

    // Update in MongoDB if connected
    if (conn) {
      if (body.markAll) {
        await NotificationModel.updateMany({}, { read: true });
      } else if (body.id) {
        await NotificationModel.findOneAndUpdate({ id: body.id }, { read: true });
      }
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
