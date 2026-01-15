import { NextRequest, NextResponse } from "next/server";
import { teamMembers } from "@/lib/dynamodb";
import { requireAdmin, isAuthError } from "@/lib/api-auth";

// GET /api/admin/team - List all team members
export async function GET(request: NextRequest) {
  const authResult = await requireAdmin(request);
  if (isAuthError(authResult)) return authResult;

  try {
    const members = await teamMembers.list(false); // Include inactive members for admin
    return NextResponse.json(members);
  } catch (error) {
    console.error("Error fetching team members:", error);
    return NextResponse.json(
      { error: "Failed to fetch team members" },
      { status: 500 }
    );
  }
}

// POST /api/admin/team - Create a new team member
export async function POST(request: NextRequest) {
  const authResult = await requireAdmin(request);
  if (isAuthError(authResult)) return authResult;

  try {
    const body = await request.json();

    // Validate required fields
    if (!body.name || !body.role) {
      return NextResponse.json(
        { error: "Name and role are required" },
        { status: 400 }
      );
    }

    // Get current max order
    const existing = await teamMembers.list(false);
    const maxOrder = existing.length > 0
      ? Math.max(...existing.map((m) => m.order))
      : -1;

    const member = await teamMembers.create({
      name: body.name,
      role: body.role,
      description: body.description || "",
      image: body.image || undefined,
      order: maxOrder + 1,
      active: body.active !== false, // Default to active
    });

    return NextResponse.json(member, { status: 201 });
  } catch (error) {
    console.error("Error creating team member:", error);
    return NextResponse.json(
      { error: "Failed to create team member" },
      { status: 500 }
    );
  }
}

// PATCH /api/admin/team - Reorder team members
export async function PATCH(request: NextRequest) {
  const authResult = await requireAdmin(request);
  if (isAuthError(authResult)) return authResult;

  try {
    const body = await request.json();

    if (!body.orderedIds || !Array.isArray(body.orderedIds)) {
      return NextResponse.json(
        { error: "orderedIds array is required" },
        { status: 400 }
      );
    }

    await teamMembers.reorder(body.orderedIds);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error reordering team members:", error);
    return NextResponse.json(
      { error: "Failed to reorder team members" },
      { status: 500 }
    );
  }
}
