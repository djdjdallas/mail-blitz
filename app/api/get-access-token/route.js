import { google } from "googleapis";
import { NextResponse } from "next/server";

export async function POST(req) {
  const { refreshToken } = await req.json();

  if (!refreshToken) {
    return NextResponse.json(
      { error: "Missing refresh token" },
      { status: 400 }
    );
  }

  const oauth2Client = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    process.env.REDIRECT_URI
  );

  oauth2Client.setCredentials({ refresh_token: refreshToken });

  try {
    const { credentials } = await oauth2Client.refreshAccessToken();
    return NextResponse.json({ accessToken: credentials.access_token });
  } catch (error) {
    console.error("Error refreshing access token:", error);

    // Log the full error response if available
    if (error.response && error.response.data) {
      console.error("Error details:", error.response.data);
    }

    let errorMessage = "Failed to refresh access token";
    if (error.response?.data?.error_description) {
      errorMessage = error.response.data.error_description;
    } else if (error.message) {
      errorMessage = error.message;
    }

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
