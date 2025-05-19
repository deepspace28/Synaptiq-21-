import { NextResponse } from "next/server"

export interface ApiError {
  code: string
  message: string
  status: number
}

export const ApiErrors = {
  RATE_LIMIT_EXCEEDED: {
    code: "rate_limit_exceeded",
    message: "Rate limit exceeded. Please try again later.",
    status: 429,
  },
  UNAUTHORIZED: {
    code: "unauthorized",
    message: "Unauthorized. Please log in to continue.",
    status: 401,
  },
  FORBIDDEN: {
    code: "forbidden",
    message: "Forbidden. You do not have permission to access this resource.",
    status: 403,
  },
  NOT_FOUND: {
    code: "not_found",
    message: "Resource not found.",
    status: 404,
  },
  INTERNAL_SERVER_ERROR: {
    code: "internal_server_error",
    message: "An internal server error occurred. Please try again later.",
    status: 500,
  },
}

export function handleApiError(error: unknown, defaultError = ApiErrors.INTERNAL_SERVER_ERROR) {
  console.error("API Error:", error)

  // If the error is already an ApiError, return it
  if ((error as ApiError).code && (error as ApiError).status) {
    const apiError = error as ApiError
    return NextResponse.json({ error: apiError.code, message: apiError.message }, { status: apiError.status })
  }

  // Otherwise, return the default error
  return NextResponse.json({ error: defaultError.code, message: defaultError.message }, { status: defaultError.status })
}
