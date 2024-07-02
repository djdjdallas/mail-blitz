"use client";
import { useState } from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Video } from "lucide-react";

export default function emailPage() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState("welcome");

  const handleTemplateChange = (value) => {
    setSelectedTemplate(value);
  };

  const handleSendMessage = () => {
    if (newMessage.trim() !== "") {
      setMessages([
        ...messages,
        { content: newMessage, sender: "You", timestamp: new Date() },
      ]);
      setNewMessage("");
    }
  };

  const generateWithChatGPT = async () => {
    try {
      const response = await fetch("/api/generation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          template: selectedTemplate,
          message: newMessage,
        }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      const generatedMessage = data.generatedMessage;

      setMessages([
        ...messages,
        { content: generatedMessage, sender: "ChatGPT", timestamp: new Date() },
      ]);
    } catch (error) {
      console.error("Error generating message with ChatGPT:", error);
    }
  };

  return (
    <div className="container mx-auto max-w-4xl px-4 py-12 md:px-6 md:py-16">
      <div className="grid gap-8 lg:grid-cols-2">
        <div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Customize Your Emails
          </h1>
          <p className="mt-4 text-muted-foreground">
            Communicate with your contacts in real-time with our email feature.
          </p>
        </div>
        <div className="space-y-4">
          <div>
            <label htmlFor="template" className="block font-medium">
              Select Email Template
            </label>
            <Select
              id="template"
              name="template"
              className="mt-1 w-full"
              value={selectedTemplate}
              onValueChange={handleTemplateChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a template" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="welcome">Welcome Email</SelectItem>
                <SelectItem value="project-update">Project Update</SelectItem>
                <SelectItem value="meeting-request">Meeting Request</SelectItem>
                <SelectItem value="follow-up">Follow Up</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label htmlFor="content" className="block font-medium">
              Email Preview
            </label>
            <Textarea
              id="content"
              name="content"
              rows={12} // Increase the number of rows for a bigger textarea
              className="mt-1 w-full resize-none"
              placeholder="Enter your email message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              className="flex items-center gap-2"
              onClick={generateWithChatGPT}
            >
              <Video className="h-5 w-5" />
              Generate with ChatGPT
            </Button>
          </div>
        </div>
      </div>
      <div className="mt-12">
        <h2 className="text-2xl font-bold">Email History</h2>
        <div className="mt-4 rounded-lg border">
          <div className="bg-muted p-4">
            {messages.map((message, index) => (
              <div key={index} className="flex items-start gap-4 mb-4">
                <Avatar>
                  <AvatarImage src="/placeholder-user.jpg" />
                  <AvatarFallback>{message.sender[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="font-medium">{message.sender}</p>
                  <p className="text-xs text-muted-foreground">
                    {message.timestamp.toLocaleString()}
                  </p>
                  <p className="text-sm mt-2">{message.content}</p>{" "}
                  {/* Display message content */}
                </div>
                <div className="ml-auto text-xs text-muted-foreground">
                  {message.timestamp.toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
