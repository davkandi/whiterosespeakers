import { NextRequest, NextResponse } from "next/server";
import {
  CognitoIdentityProviderClient,
  ListUsersCommand,
  AdminCreateUserCommand,
  AdminDeleteUserCommand,
  AdminAddUserToGroupCommand,
  AdminRemoveUserFromGroupCommand,
  AdminListGroupsForUserCommand,
  AdminSetUserPasswordCommand,
} from "@aws-sdk/client-cognito-identity-provider";
import { requireAdmin } from "@/lib/api-auth";

const cognitoClient = new CognitoIdentityProviderClient({
  region: process.env.AWS_REGION || "us-east-1",
});

const USER_POOL_ID = "us-east-1_K6fqek0I4";
const ADMIN_GROUP = "Admins";

// GET /api/admin/users - List all users
export async function GET(request: NextRequest) {
  const authResult = await requireAdmin(request);
  if (authResult instanceof NextResponse) return authResult;

  try {
    const command = new ListUsersCommand({
      UserPoolId: USER_POOL_ID,
    });

    const response = await cognitoClient.send(command);

    // Get groups for each user
    const usersWithGroups = await Promise.all(
      (response.Users || []).map(async (user) => {
        const groupsCommand = new AdminListGroupsForUserCommand({
          UserPoolId: USER_POOL_ID,
          Username: user.Username!,
        });
        const groupsResponse = await cognitoClient.send(groupsCommand);

        const email = user.Attributes?.find((attr) => attr.Name === "email")?.Value;
        const name = user.Attributes?.find((attr) => attr.Name === "name")?.Value;

        return {
          username: user.Username,
          email,
          name,
          status: user.UserStatus,
          enabled: user.Enabled,
          createdAt: user.UserCreateDate?.toISOString(),
          groups: groupsResponse.Groups?.map((g) => g.GroupName) || [],
          isAdmin: groupsResponse.Groups?.some((g) => g.GroupName === ADMIN_GROUP) || false,
        };
      })
    );

    return NextResponse.json(usersWithGroups);
  } catch (error) {
    console.error("Error listing users:", error);
    return NextResponse.json(
      { error: "Failed to list users" },
      { status: 500 }
    );
  }
}

// POST /api/admin/users - Create a new user
export async function POST(request: NextRequest) {
  const authResult = await requireAdmin(request);
  if (authResult instanceof NextResponse) return authResult;

  try {
    const { email, name, temporaryPassword, isAdmin } = await request.json();

    if (!email || !temporaryPassword) {
      return NextResponse.json(
        { error: "Email and temporary password are required" },
        { status: 400 }
      );
    }

    // Create the user
    const createCommand = new AdminCreateUserCommand({
      UserPoolId: USER_POOL_ID,
      Username: email,
      UserAttributes: [
        { Name: "email", Value: email },
        { Name: "email_verified", Value: "true" },
        ...(name ? [{ Name: "name", Value: name }] : []),
      ],
      TemporaryPassword: temporaryPassword,
      MessageAction: "SUPPRESS", // Don't send welcome email
    });

    await cognitoClient.send(createCommand);

    // Add to admin group if requested
    if (isAdmin) {
      const addToGroupCommand = new AdminAddUserToGroupCommand({
        UserPoolId: USER_POOL_ID,
        Username: email,
        GroupName: ADMIN_GROUP,
      });
      await cognitoClient.send(addToGroupCommand);
    }

    return NextResponse.json({ success: true, username: email });
  } catch (error: unknown) {
    console.error("Error creating user:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to create user";
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
