"use client";

import { useEffect, useState } from "react";
import { useTemplate } from "@/app/context/TemplateContext";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CalendarIcon, SendIcon } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Link from "next/link";

export default function ComposeEmail() {
  const supabase = createClientComponentClient();
  const { template } = useTemplate();
  const { toast } = useToast();
  const [emailTemplate, setEmailTemplate] = useState(null);
  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [from, setFrom] = useState("");
  const [accessToken, setAccessToken] = useState("");

  useEffect(() => {
    if (template) {
      setEmailTemplate(template);
      setSubject(template.subject || "");
      setMessage(template.body.replace(/\\n/g, "\n") || "");
    }
  }, [template]);

  useEffect(() => {
    const getUserEmailAndToken = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session) {
        setFrom(session.user.email);

        const refreshToken = session.refresh_token;
        if (!refreshToken) {
          throw new Error("Missing refresh token");
        }

        const response = await fetch("/api/get-access-token", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ refreshToken }),
        });

        if (response.ok) {
          const { accessToken } = await response.json();
          setAccessToken(accessToken);
        } else {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to fetch access token");
        }
      }
    };

    getUserEmailAndToken();
  }, [supabase]);

  const sendEmail = async () => {
    try {
      if (!accessToken) throw new Error("No access token found");

      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ to, from, subject, message, accessToken }),
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Email sent successfully!",
        });
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to send email");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
      });
    }
  };

  return (
    <div className="flex h-[100dvh] w-full flex-col items-center justify-center bg-background">
      <div className="container mx-auto max-w-4xl px-4 md:px-6">
        <div className="rounded-lg bg-card p-6 shadow-lg">
          <div className="mb-6 flex items-center justify-between">
            <h1 className="text-2xl font-bold">Compose Email</h1>
            <div className="flex items-center gap-2">
              <Button variant="outline">
                <CalendarIcon className="h-5 w-5" />
                <span>Schedule</span>
              </Button>
              <Button onClick={sendEmail}>
                <SendIcon className="h-5 w-5" />
                <span>Send</span>
              </Button>
            </div>
          </div>
          <div className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="to">To</Label>
                <Input
                  id="to"
                  placeholder="Enter email address"
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  placeholder="Enter subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                placeholder="Type your message here..."
                className="h-[300px] resize-none"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>
            <div className="mt-4">
              <Link href="/dashboard">
                <Button variant="outline">Back to Dashboard</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
