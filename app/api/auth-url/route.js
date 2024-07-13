// pages/api/auth-url.js
import { google } from "googleapis";

export default function handler(req, res) {
  const oauth2Client = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    process.env.REDIRECT_URI
  );

  const scopes = [
    "https://www.googleapis.com/auth/userinfo.email",
    "https://www.googleapis.com/auth/userinfo.profile",
    // Add other scopes your application needs
  ];

  const authorizationUrl = oauth2Client.generateAuthUrl({
    access_type: "offline", // Will return a refresh token
    scope: scopes,
  });

  res.json({ authorizationUrl });
}
