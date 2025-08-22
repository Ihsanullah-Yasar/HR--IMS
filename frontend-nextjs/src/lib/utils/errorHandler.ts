import { ApiError } from "@/lib/Types/api";

// Status mapping
const errorMessages: Record<number, string> = {
    0: "Unable to connect. Please check your internet connection.",
    408: "The request took too long. Please try again.",
    401: "You are not authorized. Please log in again.",
    403: "You do not have permission to perform this action.",
    404: "The requested resource could not be found.",
    422: "There was a validation error. Please check your input.",
    500: "A server error occurred. Please try again later.",
    503: "The service is temporarily unavailable. Try again later.",
  };

export function handleServiceError(error: unknown, fallbackMessage: string): ApiError {
  const rawErr = error as ApiError;

  // Base normalized error
  let normalized: ApiError = {
    status: rawErr.status ?? 500,
    message: fallbackMessage, // general fallbackMessage
    errors: rawErr.errors,
  };

  normalized.message = errorMessages[normalized.status] ?? fallbackMessage;

  if (process.env.NODE_ENV === "development") {
    console.log("Service Error Normalized:", { raw: rawErr, normalized });
  }

  return normalized;
}