import { NextRequest, NextResponse } from "next/server";
import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";

const RECIPIENT_EMAIL = "whiterosespeaker@gmail.com";
const SENDER_EMAIL = process.env.SES_SENDER_EMAIL || "noreply@whiterosespeakers.co.uk";

// Initialize SES client
const sesClient = new SESClient({
  region: process.env.AWS_REGION || "us-east-1",
});

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

function validateFormData(data: unknown): data is ContactFormData {
  if (typeof data !== "object" || data === null) return false;
  const d = data as Record<string, unknown>;
  return (
    typeof d.name === "string" &&
    typeof d.email === "string" &&
    typeof d.subject === "string" &&
    typeof d.message === "string" &&
    d.name.length > 0 &&
    d.email.length > 0 &&
    d.message.length > 0
  );
}

function sanitizeInput(input: string): string {
  return input
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .trim();
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!validateFormData(body)) {
      return NextResponse.json(
        { error: "Invalid form data. Please fill in all required fields." },
        { status: 400 }
      );
    }

    const { name, email, subject, message } = body;

    // Sanitize inputs
    const sanitizedName = sanitizeInput(name);
    const sanitizedEmail = sanitizeInput(email);
    const sanitizedSubject = sanitizeInput(subject || "New Contact Form Submission");
    const sanitizedMessage = sanitizeInput(message);

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Please provide a valid email address." },
        { status: 400 }
      );
    }

    // Prepare email content
    const emailBody = `
New message from White Rose Speakers website contact form:

Name: ${sanitizedName}
Email: ${sanitizedEmail}
Subject: ${sanitizedSubject}

Message:
${sanitizedMessage}

---
This email was sent from the White Rose Speakers website contact form.
    `.trim();

    const htmlBody = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #8B0000; color: white; padding: 20px; text-align: center; }
    .content { padding: 20px; background: #f9f9f9; }
    .field { margin-bottom: 15px; }
    .label { font-weight: bold; color: #8B0000; }
    .message { background: white; padding: 15px; border-left: 4px solid #8B0000; margin-top: 20px; }
    .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>New Contact Form Submission</h1>
    </div>
    <div class="content">
      <div class="field">
        <span class="label">Name:</span> ${sanitizedName}
      </div>
      <div class="field">
        <span class="label">Email:</span> <a href="mailto:${sanitizedEmail}">${sanitizedEmail}</a>
      </div>
      <div class="field">
        <span class="label">Subject:</span> ${sanitizedSubject}
      </div>
      <div class="message">
        <span class="label">Message:</span>
        <p>${sanitizedMessage.replace(/\n/g, "<br>")}</p>
      </div>
    </div>
    <div class="footer">
      This email was sent from the White Rose Speakers website contact form.
    </div>
  </div>
</body>
</html>
    `.trim();

    // Check if AWS credentials are configured
    if (process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY) {
      // Send email using AWS SES
      const command = new SendEmailCommand({
        Source: SENDER_EMAIL,
        Destination: {
          ToAddresses: [RECIPIENT_EMAIL],
        },
        Message: {
          Subject: {
            Data: `[White Rose Speakers] ${sanitizedSubject}`,
            Charset: "UTF-8",
          },
          Body: {
            Text: {
              Data: emailBody,
              Charset: "UTF-8",
            },
            Html: {
              Data: htmlBody,
              Charset: "UTF-8",
            },
          },
        },
        ReplyToAddresses: [sanitizedEmail],
      });

      await sesClient.send(command);

      return NextResponse.json(
        { message: "Your message has been sent successfully. We'll get back to you soon!" },
        { status: 200 }
      );
    } else {
      // Development mode - log the email details
      console.log("=== Contact Form Submission ===");
      console.log(`To: ${RECIPIENT_EMAIL}`);
      console.log(`From: ${sanitizedName} <${sanitizedEmail}>`);
      console.log(`Subject: ${sanitizedSubject}`);
      console.log(`Message: ${sanitizedMessage}`);
      console.log("===============================");

      // In development, return success but note that email wasn't actually sent
      return NextResponse.json(
        {
          message: "Your message has been received. We'll get back to you soon!",
          dev_note: "Email sending is disabled in development mode. Configure AWS SES for production."
        },
        { status: 200 }
      );
    }
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "An error occurred while sending your message. Please try again later." },
      { status: 500 }
    );
  }
}
