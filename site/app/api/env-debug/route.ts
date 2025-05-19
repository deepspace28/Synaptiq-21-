import { NextResponse } from "next/server"

// CORS headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders,
  })
}

export async function GET() {
  // NEVER log the actual API key value - just check if it exists
  const hasGroqKey = !!process.env.GROQ_API_KEY
  const groqKeyLength = process.env.GROQ_API_KEY ? process.env.GROQ_API_KEY.length : 0

  // Log environment info (safely)
  console.log({
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    hasGroqKey,
    groqKeyLength,
    vercelEnv: process.env.VERCEL_ENV || "not set",
  })

  return NextResponse.json(
    {
      environment: process.env.NODE_ENV,
      hasGroqKey,
      groqKeyLength,
      vercelEnv: process.env.VERCEL_ENV || "not set",
    },
    {
      headers: corsHeaders,
    },
  )
}
