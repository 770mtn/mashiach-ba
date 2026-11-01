
import { clearAdminCookie } from "../../_lib/admin";

export async function POST() {
  return Response.json(
    { success: true },
    {
      headers: {
        "Set-Cookie": clearAdminCookie(),
        "Cache-Control": "no-store",
      },
    }
  );
}
