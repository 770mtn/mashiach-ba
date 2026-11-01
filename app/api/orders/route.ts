
import {
  jsonError,
  normalizePhone,
  verifyVerificationToken,
} from "../_lib/server";

export const runtime = "nodejs";

const allowedProducts: Record<string, string> = {
  flag: "דגלי קבלת המלכות",
  sign: "שלטי קבלת המלכות",
  sticker: "מדבקות קמפיין",
  kit: "ערכת פרסום לבית",
};

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);

    if (!body || typeof body !== "object") {
      return jsonError("נתוני ההזמנה אינם תקינים.");
    }

    const fullName =
      typeof body.full_name === "string"
        ? body.full_name.trim()
        : "";

    const phone = normalizePhone(body.phone);

    const address =
      typeof body.address === "string"
        ? body.address.trim()
        : "";

    const notes =
      typeof body.notes === "string"
        ? body.notes.trim()
        : "";

    if (fullName.length < 2 || fullName.length > 120) {
      return jsonError("נא להזין שם מלא תקין.");
    }

    if (!phone) {
      return jsonError("מספר הטלפון אינו תקין.");
    }

    if (!verifyVerificationToken(body.verificationToken, phone)) {
      return jsonError(
        "יש לאמת מחדש את מספר הטלפון.",
        401
      );
    }

    if (address.length < 4 || address.length > 250) {
      return jsonError("נא להזין כתובת מלאה.");
    }

    if (notes.length > 2000) {
      return jsonError("ההערות ארוכות מדי.");
    }

    if (
      !Array.isArray(body.items) ||
      body.items.length < 1 ||
      body.items.length > 4
    ) {
      return jsonError("נא לבחור לפחות מוצר אחד.");
    }

    const seen = new Set<string>();
    const items = [];

    for (const item of body.items) {
      const id =
        typeof item?.product_id === "string"
          ? item.product_id
          : "";

      const quantity = Number(item?.quantity);

      if (
        !allowedProducts[id] ||
        seen.has(id) ||
        !Number.isInteger(quantity) ||
        quantity < 1 ||
        quantity > 99
      ) {
        return jsonError(
          "רשימת המוצרים או הכמויות אינה תקינה."
        );
      }

      seen.add(id);

      items.push({
        product_id: id,
        name: allowedProducts[id],
        quantity,
      });
    }

    const supabaseUrl =
      process.env.SUPABASE_URL?.replace(/\/$/, "");

    const serviceRoleKey =
      process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceRoleKey) {
      return jsonError(
        "חיבור מסד הנתונים עדיין לא הוגדר.",
        503
      );
    }

    const response = await fetch(
      `${supabaseUrl}/rest/v1/orders`,
      {
        method: "POST",
        headers: {
          apikey: serviceRoleKey,
          Authorization: `Bearer ${serviceRoleKey}`,
          "Content-Type": "application/json",
          Prefer: "return=minimal",
        },
        body: JSON.stringify({
          full_name: fullName,
          phone,
          address,
          items,
          installation_required:
            body.installation_required === true,
          notes,
          status: "new",
        }),
        cache: "no-store",
      }
    );

    if (!response.ok) {
      console.error(
        "Supabase insert failed:",
        response.status,
        await response.text()
      );

      return jsonError(
        "שמירת ההזמנה נכשלה.",
        502
      );
    }

    return Response.json({ success: true });

  } catch (error) {
    console.error("Order submission error:", error);

    return jsonError(
      "אירעה שגיאה בקבלת ההזמנה.",
      500
    );
  }
}
