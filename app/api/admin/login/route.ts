
import {
  createAdminCookie,
  verifyAdminPassword,
} from "../../_lib/admin";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);

    if (!verifyAdminPassword(body?.password)) {
      return Response.json(
        { error: "הסיסמה שגויה." },
        { status: 401 }
      );
    }

    return Response.json(
      { success: true },
      {
        headers: {
          "Set-Cookie": createAdminCookie(),
          "Cache-Control": "no-store",
        },
      }
    );
  } catch (error) {
    console.error("Admin login error:", error);

    return Response.json(
      { error: "שגיאה בהתחברות למערכת." },
      { status: 500 }
    );
  }
}
