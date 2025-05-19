import nodemailer from "nodemailer"

// Check if we're in a preview environment
const isPreview =
  process.env.VERCEL_ENV === "preview" ||
  !process.env.ZOHO_USER ||
  !process.env.ZOHO_APP_PASSWORD ||
  typeof window !== "undefined"

// Create a mock transporter for preview environments
const mockTransporter = {
  sendMail: async (mailOptions) => {
    console.log("MOCK EMAIL SENT (Preview Mode):", mailOptions)
    return {
      accepted: [mailOptions.to],
      rejected: [],
      response: "Mock email sent successfully",
      messageId: `mock-${Date.now()}@preview.synaptiq.com`,
    }
  },
}

// Export the appropriate transporter based on environment
export const transporter = isPreview
  ? mockTransporter
  : nodemailer.createTransport({
      host: "smtp.zoho.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.ZOHO_USER,
        pass: process.env.ZOHO_APP_PASSWORD,
      },
    })
