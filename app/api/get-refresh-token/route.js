import { google } from "googleapis";
import { NextResponse } from "next/server";

export async function GET() {
  const oauth2Client = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    process.env.REDIRECT_URI2
  );

  const authUrl = oauth2Client.generateAuthUrl({
    access_type: "offline", // This is crucial to get a refresh token
    scope: ["https://www.googleapis.com/auth/gmail.send"],
  });

  return NextResponse.redirect(authUrl);
}
