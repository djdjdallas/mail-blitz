// app/api/send/route.js
import { Resend } from "resend";
import React from "react";
import EmailTemplate from "../../../components/email-template";
import { NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req) {
  try {
    const { to, from, subject, firstName, message } = await req.json();

    if (!to || !from || !subject || !firstName || !message) {
      throw new Error("Missing required fields");
    }

    console.log("Sending email with data:", {
      to,
      from,
      subject,
      firstName,
      message,
    });

    const { data, error } = await resend.emails.send({
      from: "no-reply@mailblitz.io", // Update this to use your verified domain
      to: [to],
      subject,
      react: React.createElement(EmailTemplate, { firstName, message }),
    });

    if (error) {
      console.error("Error from Resend API:", error);
      return NextResponse.json({ error }, { status: 500 });
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Error in POST /api/send:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
