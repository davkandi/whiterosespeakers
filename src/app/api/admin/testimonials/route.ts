import { NextRequest, NextResponse } from "next/server";
import { testimonials } from "@/lib/dynamodb";
import { requireAdmin, isAuthError } from "@/lib/api-auth";

// GET /api/admin/testimonials - List all testimonials
export async function GET(request: NextRequest) {
  const authResult = await requireAdmin(request);
  if (isAuthError(authResult)) return authResult;

  try {
    const items = await testimonials.list(false); // Include inactive for admin
    return NextResponse.json(items);
  } catch (error) {
    console.error("Error fetching testimonials:", error);
    return NextResponse.json(
      { error: "Failed to fetch testimonials" },
      { status: 500 }
    );
  }
}

// POST /api/admin/testimonials - Create a new testimonial
export async function POST(request: NextRequest) {
  const authResult = await requireAdmin(request);
  if (isAuthError(authResult)) return authResult;

  try {
    const body = await request.json();

    // Validate required fields
    if (!body.quote || !body.author) {
      return NextResponse.json(
        { error: "Quote and author are required" },
        { status: 400 }
      );
    }

    // Get current max order
    const existing = await testimonials.list(false);
    const maxOrder = existing.length > 0
      ? Math.max(...existing.map((t) => t.order))
      : -1;

    const testimonial = await testimonials.create({
      quote: body.quote,
      author: body.author,
      role: body.role || "",
      rating: body.rating || 5,
      active: body.active !== false,
      order: maxOrder + 1,
    });

    return NextResponse.json(testimonial, { status: 201 });
  } catch (error) {
    console.error("Error creating testimonial:", error);
    return NextResponse.json(
      { error: "Failed to create testimonial" },
      { status: 500 }
    );
  }
}

// PATCH /api/admin/testimonials - Reorder testimonials
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

    await testimonials.reorder(body.orderedIds);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error reordering testimonials:", error);
    return NextResponse.json(
      { error: "Failed to reorder testimonials" },
      { status: 500 }
    );
  }
}
