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
import { Textarea } from "@/components/ui/textarea";

export default function InboxPage() {
  const supabase = createClientComponentClient();
  const [emails, setEmails] = useState([]);
  const [accessToken, setAccessToken] = useState("");
  const [selectedEmail, setSelectedEmail] = useState(null);

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

  const fetchEmails = async (token) => {
    try {
      console.log("Fetching emails with token:", token);

      const response = await fetch("/api/fetch-emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
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

  const getEmailContent = (email) => {
    if (!email.payload || !email.payload.parts) return "";

    const part = email.payload.parts.find(
      (part) => part.mimeType === "text/html" || part.mimeType === "text/plain"
    );
    if (part && part.body && part.body.data) {
      return atob(part.body.data.replace(/-/g, "+").replace(/_/g, "/"));
    }

    return "";
  };

  return (
    <div className="flex h-screen ml-10">
      <nav className="bg-gray-100 border-r px-6 py-8 flex flex-col gap-6 w-1/6">
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
      <div className="flex flex-1 p-8 ml-6 bg-white shadow rounded-lg">
        <div className="w-2/3 pr-4">
          <div className="mb-6 flex items-center justify-between">
            <h1 className="text-3xl font-bold">Inbox</h1>
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
                  <DropdownMenuCheckboxItem>
                    Attachments
                  </DropdownMenuCheckboxItem>
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
          <div className="grid gap-6">
            {emails.map((email) => (
              <Card
                key={email.id}
                className="p-6 cursor-pointer hover:bg-gray-50 transition-colors border border-gray-200 rounded-lg shadow-sm"
                onClick={() => setSelectedEmail(email)}
              >
                <div className="flex items-start gap-6">
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
                      <div className="font-semibold text-lg">
                        {
                          email.payload.headers.find(
                            (header) => header.name === "From"
                          ).value
                        }
                      </div>
                      <div className="text-xs text-gray-500">
                        {new Date(
                          parseInt(email.internalDate)
                        ).toLocaleString()}
                      </div>
                    </div>
                    <div className="text-sm font-semibold text-gray-800">
                      {
                        email.payload.headers.find(
                          (header) => header.name === "Subject"
                        ).value
                      }
                    </div>
                    <div className="text-sm text-gray-600 line-clamp-2">
                      {email.snippet}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
        <div className="flex flex-col w-1/3 p-4 border-l">
          <h3 className="text-lg font-bold mb-4">Email Content</h3>
          <Textarea
            value={selectedEmail ? getEmailContent(selectedEmail) : ""}
            readOnly
            placeholder="Select an email to read its content..."
            className="flex-1 min-h-[300px]"
          />
          <Button variant="primary" className="mt-4">
            Send
          </Button>
        </div>
      </div>
    </div>
  );
}
