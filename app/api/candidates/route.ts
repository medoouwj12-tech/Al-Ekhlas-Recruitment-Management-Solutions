import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db/mongodb";
import { CandidateModel } from "@/lib/models/Candidate";
import { NotificationModel } from "@/lib/models/Notification";
import { getStoredCandidates, saveStoredCandidate } from "@/lib/db/fileStorage";
import { Candidate } from "@/lib/types";

export async function GET(req: NextRequest) {
  try {
    const conn = await connectToDatabase();
    if (!conn) {
      const fileCandidates = getStoredCandidates();
      return NextResponse.json({ success: true, source: "file_db", data: fileCandidates });
    }

    let candidates = await CandidateModel.find({}).sort({ createdAt: -1 }).lean();
    if (!candidates || candidates.length === 0) {
      const fileCandidates = getStoredCandidates();
      await CandidateModel.insertMany(fileCandidates);
      candidates = await CandidateModel.find({}).sort({ createdAt: -1 }).lean();
    }

    return NextResponse.json({ success: true, source: "mongodb", data: candidates });
  } catch (error: any) {
    const fileCandidates = getStoredCandidates();
    return NextResponse.json({ success: true, source: "file_db_fallback", data: fileCandidates });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const conn = await connectToDatabase();

    const newId = `CAND-${Date.now().toString().slice(-4)}`;
    const now = new Date().toISOString();

    const candidateData: Candidate = {
      ...body,
      id: newId,
      status: "available",
      rating: 5,
      submittedAt: now,
      updatedAt: now,
      matchedEmployerIds: [],
    };

    // Always persist to local file DB immediately
    saveStoredCandidate(candidateData);

    // Also persist to MongoDB if connected
    if (conn) {
      try {
        await CandidateModel.create(candidateData);
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
      } catch (dbErr) {
        console.warn("MongoDB write error, persisted to file DB:", dbErr);
      }
    }

    return NextResponse.json({ success: true, data: candidateData, id: newId });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
