import { NextResponse } from "next/server"

export async function GET() {
  const envVars = {
    GOOGLE_API_KEY: Boolean(process.env.GOOGLE_API_KEY),
    SEARCH_ENGINE_ID: Boolean(process.env.SEARCH_ENGINE_ID),
    NODE_ENV: process.env.NODE_ENV,
  }

  return NextResponse.json({
    message: "Environment variables status",
    envVars,
  })
}
