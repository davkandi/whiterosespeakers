import { NextResponse } from "next/server";
import { teamMembers } from "@/lib/dynamodb";

// GET /api/team - List active team members
export async function GET() {
  try {
    const members = await teamMembers.list(true); // Only active members

    // Sort by order
    members.sort((a, b) => a.order - b.order);

    return NextResponse.json(members);
  } catch (error) {
    console.error("Error fetching team:", error);
    return NextResponse.json(
      { error: "Failed to fetch team" },
      { status: 500 }
    );
  }
}
