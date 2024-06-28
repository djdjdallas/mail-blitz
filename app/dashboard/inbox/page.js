// app/inbox/page.js

"use client";
import { useState, useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

export default function InboxPage() {
  const supabase = createClientComponentClient();
  const [emails, setEmails] = useState([]);
  const [accessToken, setAccessToken] = useState("");

  useEffect(() => {
    const getSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session) {
        console.log("Session:", session);
        setAccessToken(session.provider_token); // Ensure this is the correct token for Google API
      }
    };

    getSession();
  }, [supabase]);

  const fetchEmails = async (token) => {
    try {
      console.log("Fetching emails with token:", token);

      const response = await fetch("/api/fetch-emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }), // Only send the token needed for Gmail API
      });

      if (response.ok) {
        const emails = await response.json();
        console.log("Fetched emails:", emails);
        setEmails(emails);
      } else {
        console.error("Failed to fetch emails");
      }
    } catch (error) {
      console.error("Error fetching emails:", error);
    }
  };

  useEffect(() => {
    if (accessToken) {
      fetchEmails(accessToken);
    }
  }, [accessToken]);

  return (
    <div className="flex h-screen">
      <nav className="bg-muted border-r px-4 py-6 flex flex-col gap-4 w-1/4">
        <Button variant="ghost" className="justify-start gap-2 text-left">
          Inbox
        </Button>
        <Button variant="ghost" className="justify-start gap-2 text-left">
          Sent
        </Button>
        <Button variant="ghost" className="justify-start gap-2 text-left">
          Drafts
        </Button>
        <Button variant="ghost" className="justify-start gap-2 text-left">
          Trash
        </Button>
      </nav>
      <div className="flex-1 p-6 ml-4">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Inbox</h1>
          <div className="flex items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  Filter
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-48">
                <DropdownMenuLabel>Filter by:</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuCheckboxItem>Unread</DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem>Flagged</DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem>Attachments</DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  Sort
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-48">
                <DropdownMenuLabel>Sort by:</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuRadioGroup>
                  <DropdownMenuRadioItem>Date</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem>Sender</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem>Subject</DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <div className="grid gap-4">
          {emails.map((email) => (
            <Card
              key={email.id}
              className="p-4 cursor-pointer hover:bg-muted transition-colors"
            >
              <div className="flex items-start gap-4">
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
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div className="font-medium">
                      {
                        email.payload.headers.find(
                          (header) => header.name === "From"
                        ).value
                      }
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(email.internalDate).toLocaleString()}
                    </div>
                  </div>
                  <div className="text-sm font-medium">
                    {
                      email.payload.headers.find(
                        (header) => header.name === "Subject"
                      ).value
                    }
                  </div>
                  <div className="text-sm text-muted-foreground line-clamp-2">
                    {email.snippet}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
