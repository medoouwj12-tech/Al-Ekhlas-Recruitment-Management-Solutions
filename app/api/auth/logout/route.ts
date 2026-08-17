import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const response = NextResponse.json({ success: true, message: "تم تسجيل الخروج بنجاح" });
  response.cookies.delete("al_ekhlas_session");
  return response;
}

export async function GET(req: NextRequest) {
  const response = NextResponse.redirect(new URL("/admin/login", req.url));
  response.cookies.delete("al_ekhlas_session");
  return response;
}
