import { google } from "googleapis";
import { NextResponse } from "next/server";

export async function POST(req) {
  const { to, from, subject, message, accessToken } = await req.json();

  if (!to || !from || !subject || !message || !accessToken) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  const oauth2Client = new google.auth.OAuth2();
  oauth2Client.setCredentials({ access_token: accessToken });

  const gmail = google.gmail({ version: "v1", auth: oauth2Client });

  const emailLines = [
    `To: ${to}`,
    `From: ${from}`,
    `Subject: ${subject}`,
    "",
    message,
  ];

  const email = emailLines.join("\n");
  const base64EncodedEmail = Buffer.from(email)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");

  try {
    await gmail.users.messages.send({
      userId: "me",
      requestBody: {
        raw: base64EncodedEmail,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(
      "Error sending email:",
      error.response?.data || error.message
    );
    return NextResponse.json(
      { error: "Failed to send email" },
      { status: 500 }
    );
  }
}
