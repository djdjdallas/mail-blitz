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
import DOMPurify from "dompurify";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Inbox, Send, Trash2, Archive, FileText } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationEllipsis,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

// Define LoadingComponent
function LoadingComponent() {
  return (
    <div className="flex items-center justify-center h-screen bg-background">
      <div className="space-y-4 text-center">
        <div className="animate-spin rounded-full border-4 border-primary border-t-transparent h-12 w-12" />
        <p className="text-primary-foreground font-medium">
          Loading content...
        </p>
      </div>
    </div>
  );
}

export default function InboxPage() {
  const supabase = createClientComponentClient();
  const [emails, setEmails] = useState([]);
  const [accessToken, setAccessToken] = useState(null);
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [nextPageToken, setNextPageToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchEmails = async (token, pageToken = null) => {
    setIsLoading(true);
    try {
      console.log("Fetching emails with token:", token);

      const response = await fetch("/api/fetch-emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token, page: pageToken, limit: 25 }),
      });

      if (!response.ok) throw new Error("Failed to fetch emails");

      const { emails, nextPageToken } = await response.json();
      console.log("Fetched emails:", emails);
      setEmails(emails);
      setNextPageToken(nextPageToken);
      setTotalPages(Math.ceil(200 / 25)); // Assuming 200 emails total
    } catch (error) {
      console.error("Error fetching emails:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const getSessionAndFetchEmails = async () => {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();
        if (error) throw error;
        if (session) {
          console.log("Session:", session);
          const token = session.provider_token;
          if (token) {
            setAccessToken(token);
            await fetchEmails(token); // Fetch emails immediately after getting the token
          } else {
            console.error("No provider token available in session");
          }
        }
      } catch (error) {
        console.error("Error getting session:", error);
      }
    };

    getSessionAndFetchEmails();
  }, [supabase]);

  useEffect(() => {
    if (accessToken) {
      fetchEmails(accessToken, nextPageToken);
    }
  }, [accessToken, currentPage]);

  const getEmailContent = (email) => {
    if (!email.payload) return "";

    const getContent = (parts) => {
      for (const part of parts) {
        if (part.mimeType === "text/html" || part.mimeType === "text/plain") {
          const decodedContent = atob(
            part.body.data.replace(/-/g, "+").replace(/_/g, "/")
          );
          const utf8Decoder = new TextDecoder("utf-8");
          return utf8Decoder.decode(
            new Uint8Array(
              [...decodedContent].map((char) => char.charCodeAt(0))
            )
          );
        }
        if (part.parts) {
          const content = getContent(part.parts);
          if (content) return content;
        }
      }
      return "";
    };

    return getContent([email.payload]);
  };

  const countEmailsByLabel = (label) => {
    return emails.filter((email) => email.labelIds.includes(label)).length;
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="flex h-screen ml-10">
      <aside className="w-48 p-4 mt-20 ml-2">
        <nav className="space-y-2">
          <Link
            href="#"
            className="flex items-center justify-between p-2 text-sm font-medium bg-gray-200 rounded-md"
            prefetch={false}
          >
            <span className="flex items-center">
              <Inbox className="w-5 h-5 mr-2" />
              Inbox
            </span>
            <Badge>{countEmailsByLabel("INBOX")}</Badge>
          </Link>
          <Link
            href="#"
            className="flex items-center justify-between p-2 text-sm font-medium rounded-md"
            prefetch={false}
          >
            <span className="flex items-center">
              <FileText className="w-5 h-5 mr-2" />
              Drafts
            </span>
            <Badge variant="secondary">{countEmailsByLabel("DRAFT")}</Badge>
          </Link>
          <Link
            href="#"
            className="flex items-center justify-between p-2 text-sm font-medium rounded-md"
            prefetch={false}
          >
            <span className="flex items-center">
              <Send className="w-5 h-5 mr-2" />
              Sent
            </span>
            <Badge variant="secondary">{countEmailsByLabel("SENT")}</Badge>
          </Link>
          <Link
            href="#"
            className="flex items-center justify-between p-2 text-sm font-medium rounded-md"
            prefetch={false}
          >
            <span className="flex items-center">
              <Trash2 className="w-5 h-5 mr-2" />
              Trash
            </span>
            <Badge variant="secondary">{countEmailsByLabel("TRASH")}</Badge>
          </Link>
          <Link
            href="#"
            className="flex items-center justify-between p-2 text-sm font-medium rounded-md"
            prefetch={false}
          >
            <span className="flex items-center">
              <Archive className="w-5 h-5 mr-2" />
              Archive
            </span>
          </Link>
        </nav>
      </aside>
      <div className="flex flex-1 flex-col p-8 ml-6 bg-white shadow rounded-lg">
        {isLoading ? (
          <LoadingComponent />
        ) : (
          <div className="flex-1 flex overflow-hidden">
            <div
              className="w-1/2 pr-4 h-full overflow-y-auto"
              style={{ minWidth: "400px" }}
            >
              <div className="mb-6 flex items-center justify-between">
                <h1 className="text-3xl font-bold">Inbox</h1>
                <div className="flex items-center gap-4">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        className="flex items-center gap-2"
                      >
                        Filter
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-48">
                      <DropdownMenuLabel>Filter by:</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuCheckboxItem>
                        Unread
                      </DropdownMenuCheckboxItem>
                      <DropdownMenuCheckboxItem>
                        Flagged
                      </DropdownMenuCheckboxItem>
                      <DropdownMenuCheckboxItem>
                        Attachments
                      </DropdownMenuCheckboxItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        className="flex items-center gap-2"
                      >
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
                        <div className="text-sm text-gray-600">
                          {email.snippet}
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
            <div className="flex flex-col w-1/2 p-4 border-l h-full overflow-y-auto">
              <h3 className="text-lg font-bold mb-4">Email Content</h3>
              <div
                className="flex-1 p-4 bg-gray-50 border rounded overflow-y-auto"
                style={{ minHeight: "300px" }}
                dangerouslySetInnerHTML={{
                  __html: selectedEmail
                    ? DOMPurify.sanitize(getEmailContent(selectedEmail))
                    : "Select an email to read its content...",
                }}
              />
              <Button variant="primary" className="mt-4">
                Reply
              </Button>
            </div>
          </div>
        )}
        <Pagination className="mt-auto">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={() => handlePageChange(currentPage - 1)}
              />
            </PaginationItem>
            {Array.from({ length: totalPages }, (_, index) => (
              <PaginationItem key={index}>
                <PaginationLink
                  href="#"
                  onClick={() => handlePageChange(index + 1)}
                >
                  {index + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={() => handlePageChange(currentPage + 1)}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}
