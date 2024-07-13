"use client";
import { useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { v4 as uuidv4 } from "uuid";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Tracking() {
  const [email, setEmail] = useState("");
  const [trackingUrl, setTrackingUrl] = useState("");
  const supabase = createClientComponentClient();

  const generateTrackingPixel = async () => {
    const userId = uuidv4();
    const ngrokUrl = "https://6c62-76-86-37-67.ngrok-free.app";
    const url = `${ngrokUrl}/api/track?email=${email}&user_id=${userId}`;
    setTrackingUrl(url);
    console.log("Generated tracking URL:", url);
  };

  const copyToClipboard = () => {
    const el = document.createElement("textarea");
    el.value = trackingUrl;
    document.body.appendChild(el);
    el.select();
    document.execCommand("copy");
    document.body.removeChild(el);
    alert("Tracking pixel URL copied to clipboard.");
  };

  return (
    <div
      style={{
        margin: "20px",
        fontFamily: "Arial, sans-serif",
        maxWidth: "600px",
        marginLeft: "auto",
        marginRight: "auto",
        padding: "24px",
        border: "1px solid #ddd",
        borderRadius: "8px",
      }}
    >
      <div style={{ textAlign: "center", marginBottom: "24px" }}>
        <h1 style={{ fontSize: "32px", fontWeight: "bold" }}>
          Generate Email Tracking Link
        </h1>
        <p style={{ color: "#666", fontSize: "18px" }}>
          Create a trackable link to include in your SaaS emails.
        </p>
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          generateTrackingPixel();
        }}
        style={{ marginBottom: "24px" }}
      >
        <div style={{ marginBottom: "16px" }}>
          <Label htmlFor="email" className="block text-sm font-medium">
            Recipient's Email
          </Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter recipient's email"
            style={{
              marginTop: "4px",
              padding: "10px",
              fontSize: "16px",
              width: "100%",
              borderRadius: "4px",
              border: "1px solid #ccc",
            }}
          />
        </div>
        <Button
          type="submit"
          className="w-full"
          style={{
            padding: "10px 20px",
            fontSize: "16px",
            backgroundColor: "#0070f3",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Generate Tracking Pixel
        </Button>
      </form>
      {trackingUrl && (
        <div
          style={{
            marginTop: "24px",
            padding: "16px",
            backgroundColor: "#f4f4f4",
            borderRadius: "8px",
            textAlign: "center",
          }}
        >
          <h2 style={{ fontSize: "24px", fontWeight: "bold" }}>
            Your Tracking Link
          </h2>
          <div
            style={{
              marginTop: "16px",
              display: "flex",
              justifyContent: "center",
              gap: "8px",
            }}
          >
            <Input
              value={trackingUrl}
              readOnly
              style={{
                flex: "1",
                padding: "10px",
                fontSize: "16px",
                borderRadius: "4px",
                border: "1px solid #ccc",
              }}
            />
            <Button
              onClick={copyToClipboard}
              variant="secondary"
              size="sm"
              style={{
                padding: "10px 20px",
                fontSize: "16px",
                backgroundColor: "#0070f3",
                color: "#fff",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Copy
            </Button>
          </div>
        </div>
      )}
      <Link href="/dashboard/compose-email" passHref>
        <Button
          className="w-full"
          style={{
            marginTop: "24px",
            padding: "10px 20px",
            fontSize: "16px",
            backgroundColor: "#0070f3",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            textAlign: "center",
          }}
        >
          Generate an Email with Tracking
        </Button>
      </Link>
    </div>
  );
}
