import { NextRequest, NextResponse } from "next/server";
import { jwtVerify, createRemoteJWKSet } from "jose";

// Check if we're in dev mode
const isDevMode = process.env.NEXT_PUBLIC_DEV_MODE === "true";

const COGNITO_USER_POOL_ID = process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID || "";
const COGNITO_REGION = "us-east-1";

// Cognito JWKS URL for token verification
const JWKS_URL = `https://cognito-idp.${COGNITO_REGION}.amazonaws.com/${COGNITO_USER_POOL_ID}/.well-known/jwks.json`;

// Cache the JWKS
let jwks: ReturnType<typeof createRemoteJWKSet> | null = null;

function getJWKS() {
  if (!jwks) {
    jwks = createRemoteJWKSet(new URL(JWKS_URL));
  }
  return jwks;
}

export interface AuthenticatedUser {
  username: string;
  email: string;
  groups: string[];
  isAdmin: boolean;
}

/**
 * Verify the JWT token from the Authorization header
 */
export async function verifyToken(token: string): Promise<AuthenticatedUser | null> {
  // Dev mode: accept any token
  if (isDevMode && token === "dev-mode-token") {
    return {
      username: "dev-admin",
      email: "admin@localhost",
      groups: ["Admins"],
      isAdmin: true,
    };
  }

  try {
    const { payload } = await jwtVerify(token, getJWKS(), {
      issuer: `https://cognito-idp.${COGNITO_REGION}.amazonaws.com/${COGNITO_USER_POOL_ID}`,
    });

    const groups = (payload["cognito:groups"] as string[]) || [];
    const username = payload["cognito:username"] as string || payload.sub as string;
    const email = payload.email as string || "";

    return {
      username,
      email,
      groups,
      isAdmin: groups.includes("Admins"),
    };
  } catch (error) {
    console.error("Token verification failed:", error);
    return null;
  }
}

/**
 * Extract token from Authorization header
 */
export function extractToken(request: NextRequest): string | null {
  const authHeader = request.headers.get("authorization");
  if (!authHeader) return null;

  const parts = authHeader.split(" ");
  if (parts.length !== 2 || parts[0].toLowerCase() !== "bearer") {
    return null;
  }

  return parts[1];
}

/**
 * Middleware to require authentication for API routes
 * Returns the authenticated user if valid, or a 401 response if not
 */
export async function requireAuth(
  request: NextRequest
): Promise<{ user: AuthenticatedUser } | NextResponse> {
  const token = extractToken(request);

  if (!token) {
    return NextResponse.json(
      { error: "Authentication required" },
      { status: 401 }
    );
  }

  const user = await verifyToken(token);

  if (!user) {
    return NextResponse.json(
      { error: "Invalid or expired token" },
      { status: 401 }
    );
  }

  return { user };
}

/**
 * Middleware to require admin role for API routes
 * Returns the authenticated admin user if valid, or a 401/403 response if not
 */
export async function requireAdmin(
  request: NextRequest
): Promise<{ user: AuthenticatedUser } | NextResponse> {
  const result = await requireAuth(request);

  // If it's a NextResponse, it means auth failed
  if (result instanceof NextResponse) {
    return result;
  }

  // Check if user is admin
  if (!result.user.isAdmin) {
    return NextResponse.json(
      { error: "Admin access required" },
      { status: 403 }
    );
  }

  return result;
}

/**
 * Helper to check if a result is an error response
 */
export function isAuthError(
  result: { user: AuthenticatedUser } | NextResponse
): result is NextResponse {
  return result instanceof NextResponse;
}
