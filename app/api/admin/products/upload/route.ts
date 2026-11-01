
import { randomUUID } from "node:crypto";
import { isAdminRequest } from "../../../_lib/admin";

export const runtime = "nodejs";

const allowedTypes: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

export async function POST(request: Request) {
  if (!isAdminRequest(request)) {
    return Response.json({ error: "אין הרשאה." }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return Response.json(
        { error: "לא נבחר קובץ תמונה." },
        { status: 400 }
      );
    }

    const extension = allowedTypes[file.type];

    if (!extension) {
      return Response.json(
        { error: "אפשר להעלות JPG, PNG או WEBP בלבד." },
        { status: 400 }
      );
    }

    if (file.size === 0 || file.size > 5 * 1024 * 1024) {
      return Response.json(
        { error: "התמונה חייבת להיות עד 5MB." },
        { status: 400 }
      );
    }

    const url = process.env.SUPABASE_URL?.replace(/\/$/, "");
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!url || !key) {
      throw new Error("פרטי Supabase חסרים.");
    }

    const filename = `${randomUUID()}.${extension}`;
    const storagePath = `products/${filename}`;

    const uploadResponse = await fetch(
      `${url}/storage/v1/object/campaign-products/${storagePath}`,
      {
        method: "POST",
        headers: {
          apikey: key,
          Authorization: `Bearer ${key}`,
          "Content-Type": file.type,
          "x-upsert": "false",
        },
        body: await file.arrayBuffer(),
        cache: "no-store",
      }
    );

    if (!uploadResponse.ok) {
      console.error(
        "Image upload error:",
        await uploadResponse.text()
      );

      return Response.json(
        { error: "העלאת התמונה נכשלה." },
        { status: 502 }
      );
    }

    const imageUrl =
      `${url}/storage/v1/object/public/campaign-products/${storagePath}`;

    return Response.json({
      success: true,
      image_url: imageUrl,
    });
  } catch (error) {
    console.error("Product image upload error:", error);

    return Response.json(
      { error: "אירעה שגיאה בהעלאת התמונה." },
      { status: 500 }
    );
  }
}
