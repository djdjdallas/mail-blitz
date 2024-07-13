// app/inbox/[id]/page.js

"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";

export default function EmailViewPage() {
  const router = useRouter();
  const { id } = router.query;
  const supabase = createClientComponentClient();
  const [email, setEmail] = useState(null);
  const [accessToken, setAccessToken] = useState("");

  useEffect(() => {
    const getSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session) {
        console.log("Session:", session);
        setAccessToken(session.provider_token);
      }
    };

    getSession();
  }, [supabase]);

  const fetchEmail = async (token) => {
    try {
      console.log("Fetching email with token:", token);

      const response = await fetch("/api/fetch-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token, emailId: id }),
      });

      if (response.ok) {
        const email = await response.json();
        console.log("Fetched email:", email);
        setEmail(email);
      } else {
        console.error("Failed to fetch email");
      }
    } catch (error) {
      console.error("Error fetching email:", error);
    }
  };

  useEffect(() => {
    if (accessToken && id) {
      fetchEmail(accessToken);
    }
  }, [accessToken, id]);

  if (!email) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex h-screen">
      <div className="flex-1 p-6 ml-4">
        <Card>
          <CardHeader className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Avatar>
                <AvatarImage src="/placeholder-user.jpg" />
                <AvatarFallback>
                  {
                    email.payload.headers.find(
                      (header) => header.name === "From"
                    ).value[0]
                  }
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle>
                  {
                    email.payload.headers.find(
                      (header) => header.name === "From"
                    ).value
                  }
                </CardTitle>
                <div className="text-sm text-muted-foreground">
                  {new Date(email.internalDate).toLocaleString()}
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <h2 className="text-xl font-bold">
                {
                  email.payload.headers.find(
                    (header) => header.name === "Subject"
                  ).value
                }
              </h2>
              <p className="text-muted-foreground text-sm">
                {
                  email.payload.headers.find((header) => header.name === "To")
                    .value
                }
              </p>
            </div>
            <div className="mb-4 text-sm">{email.payload.body.data}</div>
            <Textarea placeholder="Reply..." className="min-h-[100px]" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
