import { NextResponse } from "next/server";
import { testimonials } from "@/lib/dynamodb";

// GET /api/testimonials - List active testimonials
export async function GET() {
  try {
    const items = await testimonials.list(true); // Only active

    // Sort by order
    items.sort((a, b) => a.order - b.order);

    return NextResponse.json(items);
  } catch (error) {
    console.error("Error fetching testimonials:", error);
    return NextResponse.json(
      { error: "Failed to fetch testimonials" },
      { status: 500 }
    );
  }
}
