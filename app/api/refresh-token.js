// pages/api/refresh-token.js

import { google } from "googleapis";
import { NextResponse } from "next/server";

export async function POST(req) {
  const { refreshToken } = await req.json();

  if (!refreshToken) {
    console.error("Missing refresh token");
    return NextResponse.json(
      { error: "Missing refresh token" },
      { status: 400 }
    );
  }

  const oauth2Client = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET
  );

  oauth2Client.setCredentials({ refresh_token: refreshToken });

  try {
    const { credentials } = await oauth2Client.refreshAccessToken();
    console.log("New access token:", credentials.access_token);
    return NextResponse.json({ accessToken: credentials.access_token });
  } catch (error) {
    console.error(
      "Error refreshing access token:",
      error.response?.data || error.message
    );
    return NextResponse.json(
      { error: "Failed to refresh access token" },
      { status: 500 }
    );
  }
}
