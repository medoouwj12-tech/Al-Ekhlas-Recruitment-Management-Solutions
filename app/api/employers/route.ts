import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db/mongodb";
import { EmployerRequestModel } from "@/lib/models/EmployerRequest";
import { NotificationModel } from "@/lib/models/Notification";
import { getStoredOrders, saveStoredOrder } from "@/lib/db/fileStorage";
import { EmployerRequest } from "@/lib/types";

export async function GET(req: NextRequest) {
  try {
    const conn = await connectToDatabase();
    if (!conn) {
      const fileOrders = getStoredOrders();
      return NextResponse.json({ success: true, source: "file_db", data: fileOrders });
    }

    let orders = await EmployerRequestModel.find({}).sort({ createdAt: -1 }).lean();
    if (!orders || orders.length === 0) {
      const fileOrders = getStoredOrders();
      await EmployerRequestModel.insertMany(fileOrders);
      orders = await EmployerRequestModel.find({}).sort({ createdAt: -1 }).lean();
    }

    return NextResponse.json({ success: true, source: "mongodb", data: orders });
  } catch (error: any) {
    const fileOrders = getStoredOrders();
    return NextResponse.json({ success: true, source: "file_db_fallback", data: fileOrders });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const conn = await connectToDatabase();

    const newId = `EMP-2026-${Date.now().toString().slice(-4)}`;
    const now = new Date().toISOString();

    const orderData: EmployerRequest = {
      ...body,
      id: newId,
      status: "new",
      submittedAt: now,
      updatedAt: now,
      assignedCandidateIds: [],
    };

    // Always persist to local file DB immediately
    saveStoredOrder(orderData);

    // Also persist to MongoDB if connected
    if (conn) {
      try {
        await EmployerRequestModel.create(orderData);
        await NotificationModel.create({
          id: `NOTIF-${Date.now()}`,
          title: `طلب توظيف جديد من ${body.companyName}`,
          titleEn: `New Hiring Request from ${body.companyName}`,
          message: `تم تقديم طلب لشغل وظيفة "${body.jobTitle}" بنجاح`,
          messageEn: `Job request submitted for "${body.jobTitle}"`,
          type: "employer_request",
          createdAt: now,
          read: false,
          link: "/admin/employers",
        });
      } catch (dbErr) {
        console.warn("MongoDB write error, persisted to file DB:", dbErr);
      }
    }

    return NextResponse.json({ success: true, data: orderData, id: newId });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
