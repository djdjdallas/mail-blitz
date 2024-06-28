// app/api/fetch-emails/route.js

import { google } from "googleapis";
import { NextResponse } from "next/server";

async function fetchEmailsWithToken(token) {
  const auth = new google.auth.OAuth2();
  auth.setCredentials({ access_token: token });

  const gmail = google.gmail({ version: "v1", auth });
  try {
    const result = await gmail.users.messages.list({
      userId: "me",
      maxResults: 10,
    });
    const messages = result.data.messages || [];
    console.log(`Fetched ${messages.length} messages`);

    const emails = await Promise.all(
      messages.map(async (message) => {
        const msg = await gmail.users.messages.get({
          userId: "me",
          id: message.id,
        });
        return msg.data;
      })
    );

    return emails;
  } catch (error) {
    console.error(
      "Error fetching emails with token:",
      error.response?.data || error.message
    );
    throw error;
  }
}

export async function POST(req) {
  const { token } = await req.json();

  if (!token) {
    console.error("Missing token");
    return NextResponse.json({ error: "Missing token" }, { status: 400 });
  }

  try {
    const emails = await fetchEmailsWithToken(token);
    return NextResponse.json(emails);
  } catch (error) {
    console.error(
      "Error fetching emails:",
      error.response?.data || error.message
    );
    return NextResponse.json(
      { error: "Failed to fetch emails" },
      { status: 500 }
    );
  }
}
