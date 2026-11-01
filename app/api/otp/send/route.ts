
import {
  getTwilioConfig,
  jsonError,
  normalizePhone,
  readTwilioError,
  twilioAuth,
} from "../../_lib/server";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);
    const phone = normalizePhone(body?.phone);

    if (!phone) {
      return jsonError("נא להזין מספר טלפון תקין.");
    }

    const {
      accountSid,
      authToken,
      verifyServiceSid,
    } = getTwilioConfig();

    const form = new URLSearchParams({
      To: phone,
      Channel: "sms",
    });

    const response = await fetch(
      `https://verify.twilio.com/v2/Services/${verifyServiceSid}/Verifications`,
      {
        method: "POST",
        headers: {
          Authorization: twilioAuth(authToken, accountSid),
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: form,
        cache: "no-store",
      }
    );

    if (!response.ok) {
      return jsonError(await readTwilioError(response), 502);
    }

    return Response.json({ success: true });

  } catch (error) {
    console.error("OTP send error:", error);

    return jsonError(
      error instanceof Error
        ? error.message
        : "לא ניתן לשלוח קוד אימות.",
      500
    );
  }
}
