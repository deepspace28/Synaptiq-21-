import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Add debugging to your middleware
  console.log("Middleware called for path:", request.nextUrl.pathname)

  // Get the pathname of the request
  const path = request.nextUrl.pathname

  // Make sure your middleware is correctly handling API routes
  if (path.startsWith("/api/")) {
    console.log("Middleware processing API route:", path)
    // Clone the request headers
    const requestHeaders = new Headers(request.headers)

    // Get response
    const response = NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    })

    // Add CORS headers to all API responses
    response.headers.set("Access-Control-Allow-Origin", "*")
    response.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
    response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization")

    return response
  }

  // For non-API routes, just continue
  return NextResponse.next()
}

// Only run the middleware on API routes
export const config = {
  matcher: "/api/:path*",
}
