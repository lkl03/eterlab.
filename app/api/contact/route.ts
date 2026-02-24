import { NextResponse } from "next/server";

const RESEND_ENDPOINT = "https://api.resend.com/emails";

function escapeHtml(s: string) {
  return s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const name = String(body?.name ?? "").trim();
    const email = String(body?.email ?? "").trim();
    const subject = String(body?.subject ?? "").trim();
    const message = String(body?.message ?? "").trim();

    if (!email || !message) {
      return NextResponse.json({ ok: false, error: "missing_fields" }, { status: 400 });
    }

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ ok: false, error: "missing_resend_key" }, { status: 500 });
    }

    const to = process.env.CONTACT_TO_EMAIL || "contact.eterlab@gmail.com";

    // NOTE: Resend requires a verified sender domain for production.
    // Leave this as placeholder and replace with your verified sender.
    const from = process.env.CONTACT_FROM_EMAIL || "eterlab <onboarding@resend.dev>";

    const safeName = escapeHtml(name || "(no name)");
    const safeEmail = escapeHtml(email);
    const safeSubject = escapeHtml(subject || "Contact");
    const safeMessage = escapeHtml(message).replaceAll("\n", "<br/>");

    const html = `
      <div style="font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial; line-height: 1.5;">
        <h2 style="margin:0 0 12px 0;">New message from eterlab.com</h2>
        <p style="margin:0 0 6px 0;"><strong>Name:</strong> ${safeName}</p>
        <p style="margin:0 0 6px 0;"><strong>Email:</strong> ${safeEmail}</p>
        <p style="margin:0 0 12px 0;"><strong>Subject:</strong> ${safeSubject}</p>
        <div style="padding:12px 14px; border:1px solid #e4e4e7; border-radius:12px; background:#fafafa;">
          ${safeMessage}
        </div>
      </div>
    `.trim();

    const res = await fetch(RESEND_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [to],
        subject: `[eterlab] ${subject || "New message"}`,
        reply_to: email,
        html,
      }),
    });

    if (!res.ok) {
      const errText = await res.text().catch(() => "");
      return NextResponse.json({ ok: false, error: "resend_error", details: errText }, { status: 502 });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, error: "bad_request" }, { status: 400 });
  }
}
