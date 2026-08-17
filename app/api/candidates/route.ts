import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db/mongodb";
import { CandidateModel } from "@/lib/models/Candidate";
import { NotificationModel } from "@/lib/models/Notification";
import { initialCandidates } from "@/lib/mockData";

export async function GET(req: NextRequest) {
  try {
    const conn = await connectToDatabase();
    if (!conn) {
      return NextResponse.json({ success: true, source: "mock", data: initialCandidates });
    }

    let candidates = await CandidateModel.find({}).sort({ createdAt: -1 }).lean();

    // Auto-seed if empty
    if (!candidates || candidates.length === 0) {
      await CandidateModel.insertMany(initialCandidates);
      candidates = await CandidateModel.find({}).sort({ createdAt: -1 }).lean();
    }

    return NextResponse.json({ success: true, source: "mongodb", data: candidates });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const conn = await connectToDatabase();

    const newId = `CAND-${Date.now().toString().slice(-4)}`;
    const now = new Date().toISOString();

    const candidateData = {
      ...body,
      id: newId,
      status: "available",
      rating: 5,
      submittedAt: now,
      updatedAt: now,
      matchedEmployerIds: [],
    };

    if (conn) {
      const created = await CandidateModel.create(candidateData);

      // Create notification
      await NotificationModel.create({
        id: `NOTIF-${Date.now()}`,
        title: `مرشح جديد: ${body.fullName}`,
        titleEn: `New Candidate: ${body.fullName}`,
        message: `تم تسجيل ملف مهني جديد في تخصص "${body.category}" (${body.targetTitle})`,
        messageEn: `New profile registered for "${body.targetTitle}"`,
        type: "candidate_applied",
        createdAt: now,
        read: false,
        link: "/admin/candidates",
      });

      return NextResponse.json({ success: true, data: created, id: newId });
    }

    return NextResponse.json({ success: true, source: "mock", data: candidateData, id: newId });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
