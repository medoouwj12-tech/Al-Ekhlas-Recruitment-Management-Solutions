import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db/mongodb";
import { CandidateModel } from "@/lib/models/Candidate";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const conn = await connectToDatabase();
    if (!conn) {
      return NextResponse.json({ success: true, message: "Mock mode" });
    }

    const candidate = await CandidateModel.findOne({ id }).lean();
    if (!candidate) {
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

    if (conn) {
      const updated = await CandidateModel.findOneAndUpdate(
        { id },
        { ...body, updatedAt: new Date().toISOString() },
        { new: true }
      );
      return NextResponse.json({ success: true, data: updated });
    }

    return NextResponse.json({ success: true, source: "mock", data: { id, ...body } });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const conn = await connectToDatabase();

    if (conn) {
      await CandidateModel.findOneAndDelete({ id });
      return NextResponse.json({ success: true, message: "Candidate deleted successfully" });
    }

    return NextResponse.json({ success: true, source: "mock" });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
