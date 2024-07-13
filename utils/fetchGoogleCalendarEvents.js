export async function fetchGoogleCalendarEvents(accessToken) {
  if (!accessToken) {
    console.error("No access token found");
    throw new Error("No access token found for Google Calendar");
  }

  try {
    console.log(
      "Fetching Google Calendar events with access token:",
      accessToken
    );
    const response = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/primary/events?access_token=${accessToken}`
    );
    const data = await response.json();
    return data.items || [];
  } catch (error) {
    console.error("Error fetching Google Calendar events:", error);
    throw new Error("Failed to fetch events from Google Calendar");
  }
}
