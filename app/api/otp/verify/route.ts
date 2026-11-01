
import {
  createVerificationToken,
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
    const code =
      typeof body?.code === "string"
        ? body.code.trim()
        : "";

    if (!phone) {
      return jsonError("מספר הטלפון אינו תקין.");
    }

    if (!/^\d{4,10}$/.test(code)) {
      return jsonError("קוד האימות אינו תקין.");
    }

    const {
      accountSid,
      authToken,
      verifyServiceSid,
    } = getTwilioConfig();

    const form = new URLSearchParams({
      To: phone,
      Code: code,
    });

    const response = await fetch(
      `https://verify.twilio.com/v2/Services/${verifyServiceSid}/VerificationCheck`,
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
      return jsonError(
        await readTwilioError(response),
        400
      );
    }

    const result = await response.json();

    if (result.status !== "approved") {
      return jsonError("קוד האימות שגוי או שפג תוקפו.");
    }

    return Response.json({
      success: true,
      verificationToken:
        createVerificationToken(phone),
    });

  } catch (error) {
    console.error("OTP verify error:", error);

    return jsonError(
      error instanceof Error
        ? error.message
        : "האימות נכשל.",
      500
    );
  }
}
