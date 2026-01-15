import { NextRequest, NextResponse } from "next/server";
import { gallery } from "@/lib/dynamodb";
import { requireAdmin, isAuthError } from "@/lib/api-auth";

// GET /api/admin/gallery - List all gallery images
export async function GET(request: NextRequest) {
  const authResult = await requireAdmin(request);
  if (isAuthError(authResult)) return authResult;

  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");

    const images = await gallery.list(category || undefined);

    // Sort by uploadedAt descending
    images.sort((a, b) =>
      new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
    );

    return NextResponse.json(images);
  } catch (error) {
    console.error("Error fetching gallery images:", error);
    return NextResponse.json(
      { error: "Failed to fetch gallery images" },
      { status: 500 }
    );
  }
}

// POST /api/admin/gallery - Add a new gallery image
export async function POST(request: NextRequest) {
  const authResult = await requireAdmin(request);
  if (isAuthError(authResult)) return authResult;

  try {
    const body = await request.json();

    // Validate required fields
    if (!body.s3Key || !body.category) {
      return NextResponse.json(
        { error: "s3Key and category are required" },
        { status: 400 }
      );
    }

    const image = await gallery.create({
      title: body.title || "",
      description: body.description || "",
      category: body.category,
      s3Key: body.s3Key,
      uploadedAt: new Date().toISOString(),
      uploadedBy: authResult.user.username,
    });

    return NextResponse.json(image, { status: 201 });
  } catch (error) {
    console.error("Error creating gallery image:", error);
    return NextResponse.json(
      { error: "Failed to create gallery image" },
      { status: 500 }
    );
  }
}
