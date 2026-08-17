import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db/mongodb";
import { CandidateModel } from "@/lib/models/Candidate";
import { getStoredCandidates, updateStoredCandidate, deleteStoredCandidate } from "@/lib/db/fileStorage";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const conn = await connectToDatabase();
    if (!conn) {
      const candidates = getStoredCandidates();
      const candidate = candidates.find((c) => c.id === id);
      if (!candidate) return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });
      return NextResponse.json({ success: true, data: candidate });
    }

    const candidate = await CandidateModel.findOne({ id }).lean();
    if (!candidate) {
      const candidates = getStoredCandidates();
      const fileCandidate = candidates.find((c) => c.id === id);
      if (fileCandidate) return NextResponse.json({ success: true, data: fileCandidate });
      return NextResponse.json({ success: false, error: "Candidate not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: candidate });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const conn = await connectToDatabase();

    // Update in local file DB
    const updatedFile = updateStoredCandidate(id, body);

    // Update in MongoDB if connected
    if (conn) {
      await CandidateModel.findOneAndUpdate(
        { id },
        { ...body, updatedAt: new Date().toISOString() },
        { new: true }
      );
    }

    return NextResponse.json({ success: true, data: updatedFile || { id, ...body } });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const conn = await connectToDatabase();

    deleteStoredCandidate(id);

    if (conn) {
      await CandidateModel.findOneAndDelete({ id });
    }

    return NextResponse.json({ success: true, message: "Candidate deleted successfully" });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
