// app/dashboard/analytics/page.js
"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { ResponsiveLine } from "@nivo/line";
import { useState, useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export default function AnalyticsPage() {
  const supabase = createClientComponentClient();
  const [emailStats, setEmailStats] = useState({});

  useEffect(() => {
    // Fetch email stats
    const fetchAnalytics = async () => {
      const { data: statsData, error: statsError } = await supabase
        .from("email_stats")
        .select("*")
        .single();

      if (statsError) {
        console.error("Error fetching analytics data:", statsError);
      } else {
        setEmailStats(statsData);
      }
    };

    fetchAnalytics();
  }, [supabase]);

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 grid gap-6 p-4 md:p-6 ml-16">
        {" "}
        {/* Added ml-16 for margin-left */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Total Emails Sent</CardTitle>
              <CardDescription>All-time emails sent</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {emailStats.total_emails_sent}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Open Rate</CardTitle>
              <CardDescription>Average email open rate</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{emailStats.open_rate}%</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Click-through Rate</CardTitle>
              <CardDescription>
                Average email click-through rate
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {emailStats.click_through_rate}%
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Conversion Rate</CardTitle>
              <CardDescription>Average email conversion rate</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {emailStats.conversion_rate}%
              </div>
            </CardContent>
          </Card>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Email Performance</CardTitle>
            <CardDescription>
              Metrics for your latest email campaigns
            </CardDescription>
          </CardHeader>
          <CardContent className="h-[400px]">
            {" "}
            {/* Adjusted height */}
            <LineChart className="h-full" />
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

function LineChart(props) {
  return (
    <div {...props}>
      <ResponsiveLine
        data={[
          {
            id: "Desktop",
            data: [
              { x: "Jan", y: 43 },
              { x: "Feb", y: 137 },
              { x: "Mar", y: 61 },
              { x: "Apr", y: 145 },
              { x: "May", y: 26 },
              { x: "Jun", y: 154 },
              { x: "Jul", y: 300 },
              { x: "Aug", y: 230 },
              { x: "Sep", y: 180 },
              { x: "Oct", y: 350 },
              { x: "Nov", y: 420 },
              { x: "Dec", y: 470 },
            ],
          },
          {
            id: "Mobile",
            data: [
              { x: "Jan", y: 60 },
              { x: "Feb", y: 48 },
              { x: "Mar", y: 177 },
              { x: "Apr", y: 78 },
              { x: "May", y: 96 },
              { x: "Jun", y: 204 },
              { x: "Jul", y: 280 },
              { x: "Aug", y: 210 },
              { x: "Sep", y: 160 },
              { x: "Oct", y: 340 },
              { x: "Nov", y: 400 },
              { x: "Dec", y: 450 },
            ],
          },
        ]}
        margin={{ top: 10, right: 10, bottom: 40, left: 40 }}
        xScale={{
          type: "point",
        }}
        yScale={{
          type: "linear",
          min: 0,
          max: 500,
        }}
        axisTop={null}
        axisRight={null}
        axisBottom={{
          tickSize: 0,
          tickPadding: 16,
        }}
        axisLeft={{
          tickSize: 0,
          tickValues: 5,
          tickPadding: 16,
        }}
        colors={["#2563eb", "#e11d48"]}
        pointSize={6}
        useMesh={true}
        gridYValues={5}
        theme={{
          tooltip: {
            chip: {
              borderRadius: "9999px",
            },
            container: {
              fontSize: "12px",
              textTransform: "capitalize",
              borderRadius: "6px",
            },
          },
          grid: {
            line: {
              stroke: "#f3f4f6",
            },
          },
        }}
        role="application"
      />
    </div>
  );
}

function MoveVerticalIcon(props) {
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
      <polyline points="8 18 12 22 16 18" />
      <polyline points="8 6 12 2 16 6" />
      <line x1="12" x2="12" y1="2" y2="22" />
    </svg>
  );
}
