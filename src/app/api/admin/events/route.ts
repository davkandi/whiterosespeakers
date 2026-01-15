import { NextRequest, NextResponse } from "next/server";
import { events } from "@/lib/dynamodb";
import { requireAdmin, isAuthError } from "@/lib/api-auth";

// GET /api/admin/events - List all events
export async function GET(request: NextRequest) {
  const authResult = await requireAdmin(request);
  if (isAuthError(authResult)) return authResult;

  try {
    const eventList = await events.list();

    // Sort by date descending
    eventList.sort((a, b) =>
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    return NextResponse.json(eventList);
  } catch (error) {
    console.error("Error fetching events:", error);
    return NextResponse.json(
      { error: "Failed to fetch events" },
      { status: 500 }
    );
  }
}

// POST /api/admin/events - Create a new event
export async function POST(request: NextRequest) {
  const authResult = await requireAdmin(request);
  if (isAuthError(authResult)) return authResult;

  try {
    const body = await request.json();

    // Validate required fields
    if (!body.title || !body.date || !body.time) {
      return NextResponse.json(
        { error: "Title, date, and time are required" },
        { status: 400 }
      );
    }

    const event = await events.create({
      title: body.title,
      description: body.description || "",
      date: body.date,
      time: body.time,
      location: body.location || "Leonardo Hotel, Leeds / Zoom",
      type: body.type || "meeting",
    });

    return NextResponse.json(event, { status: 201 });
  } catch (error) {
    console.error("Error creating event:", error);
    return NextResponse.json(
      { error: "Failed to create event" },
      { status: 500 }
    );
  }
}
