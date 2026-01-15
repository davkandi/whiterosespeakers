import { NextResponse } from "next/server";
import { events } from "@/lib/dynamodb";

// GET /api/events - List upcoming events
export async function GET() {
  try {
    const allEvents = await events.list();

    // Sort by date ascending (nearest first)
    const sortedEvents = allEvents.sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    return NextResponse.json(sortedEvents);
  } catch (error) {
    console.error("Error fetching events:", error);
    return NextResponse.json(
      { error: "Failed to fetch events" },
      { status: 500 }
    );
  }
}
