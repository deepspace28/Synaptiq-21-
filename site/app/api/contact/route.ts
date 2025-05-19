export const dynamic = "force-dynamic"
export const runtime = "nodejs"

import { NextResponse } from "next/server"
import { transporter } from "@/lib/mail"

// Check if we're in a preview environment
const isPreview = process.env.VERCEL_ENV === "preview" || !process.env.ZOHO_USER || !process.env.ZOHO_APP_PASSWORD

export async function POST(req: Request) {
  try {
    const { name, email, institution, message } = await req.json()

    // Log the form submission in preview environments
    if (isPreview) {
      console.log("Contact form submission (PREVIEW):", { name, email, institution, message })
    }

    // Use the transporter (will be mock in preview, real in production)
    await transporter.sendMail({
      from: `"Synaptiq Contact" <${process.env.ZOHO_USER || "preview@example.com"}>`,
      to: process.env.ZOHO_USER || "preview@example.com",
      subject: "New Contact Form Submission",
      html: `
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Institution:</strong> ${institution || "N/A"}</p>
        <p><strong>Message:</strong><br>${message}</p>
      `,
    })

    return NextResponse.json({
      success: true,
      preview: isPreview,
    })
  } catch (err) {
    console.error("Email send error:", err)

    // In preview, return success anyway to allow testing the UI flow
    if (isPreview) {
      console.log("Returning mock success response for preview environment")
      return NextResponse.json({
        success: true,
        preview: true,
        error: err.message,
      })
    }

    return NextResponse.json(
      {
        success: false,
        error: "Email failed to send.",
      },
      { status: 500 },
    )
  }
}
