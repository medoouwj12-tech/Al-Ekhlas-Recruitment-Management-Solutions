import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db/mongodb";
import { EmployerRequestModel } from "@/lib/models/EmployerRequest";
import { NotificationModel } from "@/lib/models/Notification";
import { initialEmployerRequests } from "@/lib/mockData";

export async function GET(req: NextRequest) {
  try {
    const conn = await connectToDatabase();
    if (!conn) {
      // Fallback if MONGODB_URI not set
      return NextResponse.json({ success: true, source: "mock", data: initialEmployerRequests });
    }

    let orders = await EmployerRequestModel.find({}).sort({ createdAt: -1 }).lean();
    
    // Auto-seed if empty
    if (!orders || orders.length === 0) {
      await EmployerRequestModel.insertMany(initialEmployerRequests);
      orders = await EmployerRequestModel.find({}).sort({ createdAt: -1 }).lean();
    }

    return NextResponse.json({ success: true, source: "mongodb", data: orders });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const conn = await connectToDatabase();

    const newId = `EMP-2026-${Date.now().toString().slice(-4)}`;
    const now = new Date().toISOString();

    const orderData = {
      ...body,
      id: newId,
      status: "new",
      submittedAt: now,
      updatedAt: now,
      assignedCandidateIds: [],
    };

    if (conn) {
      const created = await EmployerRequestModel.create(orderData);
      
      // Create notification
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

      return NextResponse.json({ success: true, data: created, id: newId });
    }

    return NextResponse.json({ success: true, source: "mock", data: orderData, id: newId });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
