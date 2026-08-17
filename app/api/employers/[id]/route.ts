import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db/mongodb";
import { EmployerRequestModel } from "@/lib/models/EmployerRequest";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const conn = await connectToDatabase();
    if (!conn) {
      return NextResponse.json({ success: true, message: "Mock mode" });
    }

    const order = await EmployerRequestModel.findOne({ id }).lean();
    if (!order) {
      return NextResponse.json({ success: false, error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: order });
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
      const updated = await EmployerRequestModel.findOneAndUpdate(
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
      await EmployerRequestModel.findOneAndDelete({ id });
      return NextResponse.json({ success: true, message: "Deleted successfully" });
    }

    return NextResponse.json({ success: true, source: "mock" });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
