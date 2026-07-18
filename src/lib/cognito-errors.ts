import { NextResponse } from "next/server";

/**
 * Maps AWS Cognito exceptions to appropriate HTTP status codes and
 * user-friendly messages.
 *
 * Cognito's Admin API throws typed exceptions (e.g. UsernameExistsException)
 * with an HTTP 400 status. Surfacing every one of these as a generic 500 is
 * misleading — a duplicate email or weak password is a client error the admin
 * can act on, not a server crash. This helper translates the known exceptions
 * into the correct status code and a clear message, falling back to 500 for
 * anything genuinely unexpected.
 */

// Known Cognito exception name -> { status, message }
const COGNITO_ERROR_MAP: Record<string, { status: number; message: string }> = {
  UsernameExistsException: {
    status: 409,
    message: "A user with this email already exists.",
  },
  AliasExistsException: {
    status: 409,
    message: "This email is already associated with another account.",
  },
  InvalidPasswordException: {
    status: 400,
    message:
      "Password does not meet the requirements. Use at least 8 characters with uppercase, lowercase, numbers, and symbols.",
  },
  InvalidParameterException: {
    status: 400,
    message: "One or more values are invalid. Please check the details and try again.",
  },
  UserNotFoundException: {
    status: 404,
    message: "User not found.",
  },
  ResourceNotFoundException: {
    status: 404,
    message: "The requested resource was not found.",
  },
  NotAuthorizedException: {
    status: 403,
    message: "Not authorized to perform this action.",
  },
  TooManyRequestsException: {
    status: 429,
    message: "Too many requests. Please wait a moment and try again.",
  },
  LimitExceededException: {
    status: 429,
    message: "Request limit exceeded. Please wait a moment and try again.",
  },
};

/**
 * Builds a NextResponse for an error thrown by a Cognito command.
 *
 * @param error   The caught error (unknown).
 * @param fallbackMessage Message used when the error is not a recognised
 *                        Cognito exception (returned with a 500 status).
 */
export function cognitoErrorResponse(
  error: unknown,
  fallbackMessage: string
): NextResponse {
  // AWS SDK v3 errors expose the exception type via the `name` property.
  const name =
    error && typeof error === "object" && "name" in error
      ? String((error as { name: unknown }).name)
      : undefined;

  if (name && COGNITO_ERROR_MAP[name]) {
    const { status, message } = COGNITO_ERROR_MAP[name];
    return NextResponse.json({ error: message }, { status });
  }

  return NextResponse.json({ error: fallbackMessage }, { status: 500 });
}
