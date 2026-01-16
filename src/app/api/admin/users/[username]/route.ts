import { NextRequest, NextResponse } from "next/server";
import {
  CognitoIdentityProviderClient,
  AdminDeleteUserCommand,
  AdminAddUserToGroupCommand,
  AdminRemoveUserFromGroupCommand,
  AdminSetUserPasswordCommand,
  AdminEnableUserCommand,
  AdminDisableUserCommand,
} from "@aws-sdk/client-cognito-identity-provider";
import { requireAdmin } from "@/lib/api-auth";

const cognitoClient = new CognitoIdentityProviderClient({
  region: process.env.AWS_REGION || "us-east-1",
});

const USER_POOL_ID = "us-east-1_K6fqek0I4";
const ADMIN_GROUP = "Admins";

// DELETE /api/admin/users/[username] - Delete a user
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  const authResult = await requireAdmin(request);
  if (authResult instanceof NextResponse) return authResult;

  try {
    const { username } = await params;

    const command = new AdminDeleteUserCommand({
      UserPoolId: USER_POOL_ID,
      Username: username,
    });

    await cognitoClient.send(command);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      { error: "Failed to delete user" },
      { status: 500 }
    );
  }
}

// PUT /api/admin/users/[username] - Update a user
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  const authResult = await requireAdmin(request);
  if (authResult instanceof NextResponse) return authResult;

  try {
    const { username } = await params;
    const { isAdmin, enabled, newPassword } = await request.json();

    // Handle admin group membership
    if (typeof isAdmin === "boolean") {
      if (isAdmin) {
        const addCommand = new AdminAddUserToGroupCommand({
          UserPoolId: USER_POOL_ID,
          Username: username,
          GroupName: ADMIN_GROUP,
        });
        await cognitoClient.send(addCommand);
      } else {
        const removeCommand = new AdminRemoveUserFromGroupCommand({
          UserPoolId: USER_POOL_ID,
          Username: username,
          GroupName: ADMIN_GROUP,
        });
        await cognitoClient.send(removeCommand);
      }
    }

    // Handle enable/disable
    if (typeof enabled === "boolean") {
      if (enabled) {
        const enableCommand = new AdminEnableUserCommand({
          UserPoolId: USER_POOL_ID,
          Username: username,
        });
        await cognitoClient.send(enableCommand);
      } else {
        const disableCommand = new AdminDisableUserCommand({
          UserPoolId: USER_POOL_ID,
          Username: username,
        });
        await cognitoClient.send(disableCommand);
      }
    }

    // Handle password reset
    if (newPassword) {
      const passwordCommand = new AdminSetUserPasswordCommand({
        UserPoolId: USER_POOL_ID,
        Username: username,
        Password: newPassword,
        Permanent: true,
      });
      await cognitoClient.send(passwordCommand);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 }
    );
  }
}
