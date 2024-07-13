import { google } from "googleapis";
import { NextResponse } from "next/server";

export async function GET(req) {
  const code = new URL(req.url).searchParams.get("code");

  if (!code) {
    return NextResponse.json(
      { error: "Missing authorization code" },
      { status: 400 }
    );
  }

  const oauth2Client = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    process.env.REDIRECT_URI
  );

  try {
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    // Save the refresh token securely (e.g., in a database)
    console.log("Refresh Token:", tokens.refresh_token);

    return NextResponse.json({ refreshToken: tokens.refresh_token });
  } catch (error) {
    console.error(
      "Error exchanging code for tokens:",
      error.response?.data || error.message
    );
    return NextResponse.json(
      { error: "Failed to exchange code for tokens" },
      { status: 500 }
    );
  }
}
