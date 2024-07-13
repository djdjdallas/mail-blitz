"use client";

import { useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { fetchGoogleCalendarEvents } from "@/utils/fetchGoogleCalendarEvents";
import { Button } from "@/components/ui/button";

export default function CalendarPage() {
  const [events, setEvents] = useState([]);
  const [error, setError] = useState(null);
  const supabase = createClientComponentClient();
  const [accessToken, setAccessToken] = useState("");

  useEffect(() => {
    async function getSession() {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session) {
        console.log("Session:", session);
        setAccessToken(session.provider_token);
      }
    }

    getSession();
  }, [supabase]);

  useEffect(() => {
    async function fetchData() {
      if (!accessToken) return;

      try {
        const { data, error } = await supabase
          .from("new_events")
          .select("*")
          .order("start_time", { ascending: true });

        if (error) {
          console.log("Error fetching events:", error);
          setError("Failed to fetch events from Supabase");
          return;
        }

        const googleEvents = await fetchGoogleCalendarEvents(accessToken);
        console.log("Google Events:", googleEvents); // Log the events
        setEvents([...data, ...googleEvents]);
      } catch (error) {
        console.error("Error fetching events:", error);
        setError(error.message);
      }
    }

    fetchData();
  }, [accessToken, supabase]);

  useEffect(() => {
    console.log("Updated events state:", events); // Log the updated state
  }, [events]);

  return (
    <div className="flex min-h-screen w-full bg-background">
      <aside className="hidden w-64 border-r bg-background p-6 md:block ml-10">
        <div className="mb-6">
          <h2 className="text-lg font-semibold">Upcoming Events</h2>
        </div>
        <div className="space-y-4">
          {events.map((event) => (
            <div className="flex items-center justify-between" key={event.id}>
              <div>
                <h3 className="text-sm font-medium">
                  {event.summary || event.title}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {new Date(
                    event.start.dateTime || event.start_time
                  ).toLocaleString()}
                </p>
              </div>
              <Button size="sm" variant="outline">
                Edit
              </Button>
            </div>
          ))}
          <Button size="sm" className="w-full">
            Add New Event
          </Button>
        </div>
      </aside>
      <div className="flex-1 p-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Calendar</h1>
            <p className="text-muted-foreground">
              {new Date().toLocaleString("default", {
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Button size="sm" variant="outline">
              <ChevronLeftIcon className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="outline">
              <ChevronRightIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-7 gap-4">
          <div className="flex h-12 items-center justify-center text-sm font-medium text-muted-foreground">
            Sun
          </div>
          <div className="flex h-12 items-center justify-center text-sm font-medium text-muted-foreground">
            Mon
          </div>
          <div className="flex h-12 items-center justify-center text-sm font-medium text-muted-foreground">
            Tue
          </div>
          <div className="flex h-12 items-center justify-center text-sm font-medium text-muted-foreground">
            Wed
          </div>
          <div className="flex h-12 items-center justify-center text-sm font-medium text-muted-foreground">
            Thu
          </div>
          <div className="flex h-12 items-center justify-center text-sm font-medium text-muted-foreground">
            Fri
          </div>
          <div className="flex h-12 items-center justify-center text-sm font-medium text-muted-foreground">
            Sat
          </div>
          {[...Array(30)].map((_, day) => (
            <div
              key={day}
              className="relative flex h-20 cursor-pointer items-center justify-center rounded-md bg-muted/20 hover:bg-muted/30"
            >
              <span className="text-sm font-medium">{day + 1}</span>
              {events.some(
                (event) =>
                  new Date(
                    event.start.dateTime || event.start_time
                  ).getDate() ===
                  day + 1
              ) && (
                <div className="absolute bottom-1 h-1 w-1 rounded-full bg-primary" />
              )}
            </div>
          ))}
        </div>
      </div>
      {error && <div className="error-message">{error}</div>}
    </div>
  );
}

function ChevronLeftIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
}

function ChevronRightIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}
