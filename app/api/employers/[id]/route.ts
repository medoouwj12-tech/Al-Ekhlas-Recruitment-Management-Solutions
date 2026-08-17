import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db/mongodb";
import { EmployerRequestModel } from "@/lib/models/EmployerRequest";
import { getStoredOrders, updateStoredOrder, deleteStoredOrder } from "@/lib/db/fileStorage";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const conn = await connectToDatabase();
    if (!conn) {
      const orders = getStoredOrders();
      const order = orders.find((o) => o.id === id);
      if (!order) return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });
      return NextResponse.json({ success: true, data: order });
    }

    const order = await EmployerRequestModel.findOne({ id }).lean();
    if (!order) {
      const orders = getStoredOrders();
      const fileOrder = orders.find((o) => o.id === id);
      if (fileOrder) return NextResponse.json({ success: true, data: fileOrder });
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

    // Update in local file DB
    const updatedFile = updateStoredOrder(id, body);

    // Update in MongoDB if connected
    if (conn) {
      await EmployerRequestModel.findOneAndUpdate(
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

    deleteStoredOrder(id);

    if (conn) {
      await EmployerRequestModel.findOneAndDelete({ id });
    }

    return NextResponse.json({ success: true, message: "Deleted successfully" });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
