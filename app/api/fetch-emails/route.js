import { google } from "googleapis";
import { NextResponse } from "next/server";

export async function POST(req) {
  const { token } = await req.json();

  if (!token) {
    console.error("Missing token");
    return NextResponse.json({ error: "Missing token" }, { status: 400 });
  }

  try {
    const auth = new google.auth.OAuth2();
    auth.setCredentials({ access_token: token });

    const gmail = google.gmail({ version: "v1", auth });
    const result = await gmail.users.messages.list({
      userId: "me",
      maxResults: 10,
    });
    const messages = result.data.messages || [];

    console.log("Messages list:", messages);

    const emails = await Promise.all(
      messages.map(async (message) => {
        const msg = await gmail.users.messages.get({
          userId: "me",
          id: message.id,
        });
        console.log("Fetched message:", msg.data);
        return msg.data;
      })
    );

    console.log("Emails:", emails);
    return NextResponse.json(emails);
  } catch (error) {
    console.error("Error fetching emails:", error);
    return NextResponse.json(
      { error: "Failed to fetch emails" },
      { status: 500 }
    );
  }
}
