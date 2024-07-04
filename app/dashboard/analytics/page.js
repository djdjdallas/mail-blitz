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
  const [emailStats, setEmailStats] = useState({
    total_emails_sent: 0,
    open_rate: 0,
    emails_opened: 0,
  });
  const [emailPerformanceData, setEmailPerformanceData] = useState([]);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const { count: totalEmailsSent, error: emailsSentError } =
          await supabase
            .from("email_tracking")
            .select("id", { count: "exact" });

        if (emailsSentError) throw emailsSentError;

        const { count: totalEmailsTracked, error: emailsTrackedError } =
          await supabase
            .from("email_tracking")
            .select("id", { count: "exact" })
            .eq("tracked", true);

        if (emailsTrackedError) throw emailsTrackedError;

        const openRate = totalEmailsSent
          ? (totalEmailsTracked / totalEmailsSent) * 100
          : 0;

        setEmailStats({
          total_emails_sent: totalEmailsSent || 0,
          open_rate: openRate.toFixed(2),
          emails_opened: totalEmailsTracked || 0,
        });

        const { data: performanceData, error: performanceDataError } =
          await supabase
            .from("email_tracking")
            .select("created_at")
            .order("created_at", { ascending: true });

        if (performanceDataError) throw performanceDataError;

        const processedData = performanceData.map((item) => ({
          x: new Date(item.created_at).toLocaleDateString(),
          y: 1,
        }));

        setEmailPerformanceData([
          {
            id: "Emails",
            data: processedData.length
              ? processedData
              : [{ x: "No Data", y: 0 }],
          },
        ]);
      } catch (error) {
        console.error("Error fetching analytics data:", error);
      }
    };

    fetchAnalytics();
  }, [supabase]);

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 grid gap-6 p-4 md:p-6 ml-16">
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
              <CardTitle>Emails Opened</CardTitle>
              <CardDescription>Total emails opened</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {emailStats.emails_opened}
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
            <LineChart className="h-full" data={emailPerformanceData} />
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

function LineChart({ data, ...props }) {
  return (
    <div {...props}>
      <ResponsiveLine
        data={data}
        margin={{ top: 10, right: 10, bottom: 40, left: 40 }}
        xScale={{ type: "point" }}
        yScale={{ type: "linear", min: 0 }}
        axisTop={null}
        axisRight={null}
        axisBottom={{ tickSize: 0, tickPadding: 16 }}
        axisLeft={{ tickSize: 0, tickValues: 5, tickPadding: 16 }}
        colors={["#2563eb"]}
        pointSize={6}
        useMesh={true}
        gridYValues={5}
        theme={{
          tooltip: {
            chip: { borderRadius: "9999px" },
            container: {
              fontSize: "12px",
              textTransform: "capitalize",
              borderRadius: "6px",
            },
          },
          grid: { line: { stroke: "#f3f4f6" } },
        }}
        role="application"
      />
    </div>
  );
}
