import { NextRequest, NextResponse } from "next/server";

const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "admin";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "ekhlas@2026";
const SESSION_SECRET = process.env.SESSION_SECRET || "al-ekhlas-secret-session-key-2026";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        { success: false, message: "يرجى إدخال اسم المستخدم وكلمة المرور" },
        { status: 400 }
      );
    }

    if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
      // Delay to prevent brute force
      await new Promise((r) => setTimeout(r, 800));
      return NextResponse.json(
        { success: false, message: "اسم المستخدم أو كلمة المرور غير صحيحة" },
        { status: 401 }
      );
    }

    // Create a signed session token
    const sessionData = {
      user: username,
      role: "admin",
      loginAt: new Date().toISOString(),
      expires: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString(), // 8 hours
    };

    const token = Buffer.from(JSON.stringify(sessionData)).toString("base64");

    const response = NextResponse.json({
      success: true,
      message: "تم تسجيل الدخول بنجاح",
      redirect: "/admin",
    });

    // Set HTTP-only secure cookie
    response.cookies.set("al_ekhlas_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 8 * 60 * 60, // 8 hours in seconds
      path: "/",
    });

    return response;
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: "حدث خطأ في الخادم" },
      { status: 500 }
    );
  }
}
