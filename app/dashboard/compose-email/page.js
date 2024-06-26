"use client";

import { useEffect, useState } from "react";
import { useTemplate } from "@/app/context/TemplateContext";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  CalendarIcon,
  SendIcon,
  BoldIcon,
  ItalicIcon,
  UnderlineIcon,
  ImageIcon,
} from "lucide-react";

export default function ComposeEmail() {
  const { selectedTemplate } = useTemplate();
  const [emailTemplate, setEmailTemplate] = useState(null);

  useEffect(() => {
    if (selectedTemplate) {
      setEmailTemplate(selectedTemplate);
    }
  }, [selectedTemplate]);

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
              <Button>
                <SendIcon className="h-5 w-5" />
                <span>Send</span>
              </Button>
            </div>
          </div>
          <div className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="to">To</Label>
                <Input id="to" placeholder="Enter email address" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  placeholder="Enter subject"
                  defaultValue={emailTemplate?.subject || ""}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                placeholder="Type your message here..."
                className="h-[300px] resize-none"
                defaultValue={emailTemplate?.body || ""}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button variant="outline">
                  <BoldIcon className="h-5 w-5" />
                </Button>
                <Button variant="outline">
                  <ItalicIcon className="h-5 w-5" />
                </Button>
                <Button variant="outline">
                  <UnderlineIcon className="h-5 w-5" />
                </Button>
                <Button variant="outline">
                  <ImageIcon className="h-5 w-5" />
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                You can format your email using the toolbar above.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
