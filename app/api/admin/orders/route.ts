
import { isAdminRequest } from "../../_lib/admin";

export const runtime = "nodejs";

const allowedStatuses = [
  "new",
  "in_progress",
  "completed",
  "cancelled",
];

function getSupabaseConfig() {
  const url = process.env.SUPABASE_URL?.replace(/\/$/, "");
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error("פרטי Supabase חסרים.");
  }

  return { url, key };
}

export async function GET(request: Request) {
  if (!isAdminRequest(request)) {
    return Response.json(
      { error: "אין הרשאה." },
      { status: 401 }
    );
  }

  try {
    const { url, key } = getSupabaseConfig();

    const response = await fetch(
      `${url}/rest/v1/orders?select=*&order=created_at.desc&limit=500`,
      {
        headers: {
          apikey: key,
          Authorization: `Bearer ${key}`,
        },
        cache: "no-store",
      }
    );

    if (!response.ok) {
      console.error("Orders fetch error:", await response.text());

      return Response.json(
        { error: "לא ניתן לטעון את ההזמנות." },
        { status: 502 }
      );
    }

    const orders = await response.json();

    return Response.json(
      { orders },
      {
        headers: {
          "Cache-Control": "no-store",
        },
      }
    );
  } catch (error) {
    console.error("Admin orders error:", error);

    return Response.json(
      { error: "שגיאה בטעינת ההזמנות." },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  if (!isAdminRequest(request)) {
    return Response.json(
      { error: "אין הרשאה." },
      { status: 401 }
    );
  }

  try {
    const body = await request.json().catch(() => null);

    const id =
      typeof body?.id === "string" ? body.id : "";

    const status =
      typeof body?.status === "string" ? body.status : "";

    if (
      !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id) ||
      !allowedStatuses.includes(status)
    ) {
      return Response.json(
        { error: "פרטי העדכון אינם תקינים." },
        { status: 400 }
      );
    }

    const { url, key } = getSupabaseConfig();

    const response = await fetch(
      `${url}/rest/v1/orders?id=eq.${encodeURIComponent(id)}`,
      {
        method: "PATCH",
        headers: {
          apikey: key,
          Authorization: `Bearer ${key}`,
          "Content-Type": "application/json",
          Prefer: "return=representation",
        },
        body: JSON.stringify({ status }),
        cache: "no-store",
      }
    );

    if (!response.ok) {
      console.error("Order update error:", await response.text());

      return Response.json(
        { error: "עדכון ההזמנה נכשל." },
        { status: 502 }
      );
    }

    const updated = await response.json();

    if (!updated.length) {
      return Response.json(
        { error: "ההזמנה לא נמצאה." },
        { status: 404 }
      );
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error("Order update error:", error);

    return Response.json(
      { error: "שגיאה בעדכון ההזמנה." },
      { status: 500 }
    );
  }
}
