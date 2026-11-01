
import { isAdminRequest } from "../../_lib/admin";

export const runtime = "nodejs";

type ProductInput = {
  name?: unknown;
  description?: unknown;
  image_url?: unknown;
  price?: unknown;
  special_price?: unknown;
  is_available?: unknown;
  is_visible?: unknown;
  allows_installation?: unknown;
  display_order?: unknown;
};

const allowedFields = [
  "name",
  "description",
  "image_url",
  "price",
  "special_price",
  "is_available",
  "is_visible",
  "allows_installation",
  "display_order",
] as const;

function getSupabaseConfig() {
  const url = process.env.SUPABASE_URL?.replace(/\/$/, "");
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error("פרטי Supabase חסרים.");
  }

  return { url, key };
}

function validId(id: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
}

function validateProduct(body: ProductInput, isNew: boolean) {
  const data: Record<string, unknown> = {};

  for (const field of allowedFields) {
    if (body[field] !== undefined) {
      data[field] = body[field];
    }
  }

  if (isNew && typeof data.name !== "string") {
    return { error: "יש להזין שם מוצר." };
  }

  if (
    data.name !== undefined &&
    (typeof data.name !== "string" ||
      !data.name.trim() ||
      data.name.length > 150)
  ) {
    return { error: "שם המוצר אינו תקין." };
  }

  for (const field of ["description", "image_url"] as const) {
    if (
      data[field] !== undefined &&
      data[field] !== null &&
      typeof data[field] !== "string"
    ) {
      return { error: "פרטי המוצר אינם תקינים." };
    }
  }

  if (
    typeof data.description === "string" &&
    data.description.length > 5000
  ) {
    return { error: "התיאור ארוך מדי." };
  }

  if (
    typeof data.image_url === "string" &&
    data.image_url.length > 2000
  ) {
    return { error: "כתובת התמונה ארוכה מדי." };
  }

  for (const field of ["price", "special_price"] as const) {
    const value = data[field];

    if (
      value !== undefined &&
      value !== null &&
      (typeof value !== "number" ||
        !Number.isFinite(value) ||
        value < 0 ||
        value > 10000000)
    ) {
      return { error: "המחיר אינו תקין." };
    }
  }

  for (const field of [
    "is_available",
    "is_visible",
    "allows_installation",
  ] as const) {
    if (
      data[field] !== undefined &&
      typeof data[field] !== "boolean"
    ) {
      return { error: "הגדרות המוצר אינן תקינות." };
    }
  }

  if (
    data.display_order !== undefined &&
    (!Number.isInteger(data.display_order) ||
      (data.display_order as number) < 0)
  ) {
    return { error: "סדר התצוגה אינו תקין." };
  }

  if (isNew) {
    data.name = (data.name as string).trim();
  }

  return { data };
}

async function supabaseRequest(
  path: string,
  options: RequestInit = {}
) {
  const { url, key } = getSupabaseConfig();

  return fetch(`${url}/rest/v1/${path}`, {
    ...options,
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      ...options.headers,
    },
    cache: "no-store",
  });
}

// הצגת כל המוצרים למנהל
export async function GET(request: Request) {
  if (!isAdminRequest(request)) {
    return Response.json({ error: "אין הרשאה." }, { status: 401 });
  }

  try {
    const response = await supabaseRequest(
      "products?select=*&order=display_order.asc,created_at.desc"
    );

    if (!response.ok) {
      console.error("Products GET:", await response.text());
      return Response.json(
        { error: "טעינת המוצרים נכשלה." },
        { status: 502 }
      );
    }

    const products = await response.json();
    return Response.json({ products });
  } catch (error) {
    console.error("Products GET error:", error);
    return Response.json(
      { error: "שגיאה בטעינת המוצרים." },
      { status: 500 }
    );
  }
}

// הוספת מוצר
export async function POST(request: Request) {
  if (!isAdminRequest(request)) {
    return Response.json({ error: "אין הרשאה." }, { status: 401 });
  }

  try {
    const body = await request.json().catch(() => null);

    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return Response.json(
        { error: "נתוני המוצר אינם תקינים." },
        { status: 400 }
      );
    }

    const validation = validateProduct(body as ProductInput, true);

    if (validation.error) {
      return Response.json(
        { error: validation.error },
        { status: 400 }
      );
    }

    const response = await supabaseRequest("products", {
      method: "POST",
      headers: { Prefer: "return=representation" },
      body: JSON.stringify(validation.data),
    });

    if (!response.ok) {
      console.error("Products POST:", await response.text());
      return Response.json(
        { error: "שמירת המוצר נכשלה." },
        { status: 502 }
      );
    }

    const products = await response.json();
    return Response.json(
      { success: true, product: products[0] },
      { status: 201 }
    );
  } catch (error) {
    console.error("Products POST error:", error);
    return Response.json(
      { error: "שגיאה בהוספת המוצר." },
      { status: 500 }
    );
  }
}

// עדכון מוצר
export async function PATCH(request: Request) {
  if (!isAdminRequest(request)) {
    return Response.json({ error: "אין הרשאה." }, { status: 401 });
  }

  try {
    const body = await request.json().catch(() => null);

    const id = typeof body?.id === "string" ? body.id : "";

    if (!validId(id)) {
      return Response.json(
        { error: "מזהה המוצר אינו תקין." },
        { status: 400 }
      );
    }

    const validation = validateProduct(body as ProductInput, false);

    if (validation.error || !validation.data ||
        Object.keys(validation.data).length === 0) {
      return Response.json(
        { error: validation.error || "לא נבחרו שדות לעדכון." },
        { status: 400 }
      );
    }

    const response = await supabaseRequest(
      `products?id=eq.${encodeURIComponent(id)}`,
      {
        method: "PATCH",
        headers: { Prefer: "return=representation" },
        body: JSON.stringify(validation.data),
      }
    );

    if (!response.ok) {
      console.error("Products PATCH:", await response.text());
      return Response.json(
        { error: "עדכון המוצר נכשל." },
        { status: 502 }
      );
    }

    const products = await response.json();

    if (!products.length) {
      return Response.json(
        { error: "המוצר לא נמצא." },
        { status: 404 }
      );
    }

    return Response.json({ success: true, product: products[0] });
  } catch (error) {
    console.error("Products PATCH error:", error);
    return Response.json(
      { error: "שגיאה בעדכון המוצר." },
      { status: 500 }
    );
  }
}

// מחיקת מוצר
export async function DELETE(request: Request) {
  if (!isAdminRequest(request)) {
    return Response.json({ error: "אין הרשאה." }, { status: 401 });
  }

  try {
    const body = await request.json().catch(() => null);
    const id = typeof body?.id === "string" ? body.id : "";

    if (!validId(id)) {
      return Response.json(
        { error: "מזהה המוצר אינו תקין." },
        { status: 400 }
      );
    }

    const response = await supabaseRequest(
      `products?id=eq.${encodeURIComponent(id)}`,
      {
        method: "DELETE",
        headers: { Prefer: "return=representation" },
      }
    );

    if (!response.ok) {
      console.error("Products DELETE:", await response.text());
      return Response.json(
        { error: "מחיקת המוצר נכשלה." },
        { status: 502 }
      );
    }

    const deleted = await response.json();

    if (!deleted.length) {
      return Response.json(
        { error: "המוצר לא נמצא." },
        { status: 404 }
      );
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error("Products DELETE error:", error);
    return Response.json(
      { error: "שגיאה במחיקת המוצר." },
      { status: 500 }
    );
  }
}
