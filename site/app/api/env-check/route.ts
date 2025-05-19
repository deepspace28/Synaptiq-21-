import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Only check if variables exist, don't expose actual values
    const envStatus = {
      GROQ_API_KEY: !!process.env.GROQ_API_KEY,
      NEXT_PUBLIC_GROQ_API_KEY: !!process.env.NEXT_PUBLIC_GROQ_API_KEY,
      NODE_ENV: process.env.NODE_ENV,
      VERCEL_ENV: process.env.VERCEL_ENV,
    }

    return NextResponse.json({
      status: "ok",
      environment: envStatus,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Environment check error:", error)
    return NextResponse.json(
      {
        status: "error",
        message: "Failed to check environment variables",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
