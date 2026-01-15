import { Amplify } from "aws-amplify";
import {
  signIn,
  signOut,
  getCurrentUser,
  fetchAuthSession,
} from "aws-amplify/auth";

// Check if we're in dev mode
const isDevMode = process.env.NEXT_PUBLIC_DEV_MODE === "true";

// Configure Amplify (only if not in dev mode)
const amplifyConfig = {
  Auth: {
    Cognito: {
      userPoolId: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID || "",
      userPoolClientId: process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID || "",
      loginWith: {
        email: true,
      },
    },
  },
};

// Initialize Amplify (only in browser and not in dev mode)
if (typeof window !== "undefined" && !isDevMode) {
  Amplify.configure(amplifyConfig);
}

export interface User {
  username: string;
  email: string;
  isAdmin: boolean;
}

// Dev mode user storage
let devModeUser: User | null = null;

/**
 * Sign in with username and password
 */
export async function login(
  username: string,
  password: string
): Promise<boolean> {
  // Dev mode: accept any credentials
  if (isDevMode) {
    devModeUser = {
      username: username,
      email: username,
      isAdmin: true,
    };
    // Store in localStorage for persistence
    if (typeof window !== "undefined") {
      localStorage.setItem("devModeUser", JSON.stringify(devModeUser));
    }
    return true;
  }

  try {
    const { isSignedIn } = await signIn({
      username,
      password,
    });
    return isSignedIn;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
}

/**
 * Sign out the current user
 */
export async function logout(): Promise<void> {
  if (isDevMode) {
    devModeUser = null;
    if (typeof window !== "undefined") {
      localStorage.removeItem("devModeUser");
    }
    return;
  }

  try {
    await signOut();
  } catch (error) {
    console.error("Logout error:", error);
    throw error;
  }
}

/**
 * Get the current authenticated user
 */
export async function getUser(): Promise<User | null> {
  // Dev mode: return stored user
  if (isDevMode) {
    if (devModeUser) return devModeUser;
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("devModeUser");
      if (stored) {
        devModeUser = JSON.parse(stored);
        return devModeUser;
      }
    }
    return null;
  }

  try {
    const user = await getCurrentUser();
    const session = await fetchAuthSession();

    // Check if user is in admin group
    const groups =
      (session.tokens?.accessToken?.payload?.["cognito:groups"] as string[]) ||
      [];
    const isAdmin = groups.includes("Admins");

    return {
      username: user.username,
      email: user.signInDetails?.loginId || "",
      isAdmin,
    };
  } catch {
    return null;
  }
}

/**
 * Check if user is authenticated
 */
export async function isAuthenticated(): Promise<boolean> {
  if (isDevMode) {
    return (await getUser()) !== null;
  }

  try {
    await getCurrentUser();
    return true;
  } catch {
    return false;
  }
}

/**
 * Get the current session token
 */
export async function getAccessToken(): Promise<string | null> {
  // Dev mode: return a fake token
  if (isDevMode) {
    const user = await getUser();
    if (user) return "dev-mode-token";
    return null;
  }

  try {
    const session = await fetchAuthSession();
    return session.tokens?.accessToken?.toString() || null;
  } catch {
    return null;
  }
}

/**
 * Check if user has admin role
 */
export async function isAdmin(): Promise<boolean> {
  const user = await getUser();
  return user?.isAdmin || false;
}

/**
 * Auth hook for use in React components
 */
export function useAuth() {
  return {
    getAccessToken,
    getUser,
    login,
    logout,
    isAuthenticated,
    isAdmin,
  };
}
