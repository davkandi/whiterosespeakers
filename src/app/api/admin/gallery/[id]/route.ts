import { NextRequest, NextResponse } from "next/server";
import { gallery } from "@/lib/dynamodb";
import { requireAdmin, isAuthError } from "@/lib/api-auth";
import { deleteFile } from "@/lib/s3";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// DELETE /api/admin/gallery/[id] - Delete a gallery image
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const authResult = await requireAdmin(request);
  if (isAuthError(authResult)) return authResult;

  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");

    if (!category) {
      return NextResponse.json(
        { error: "Category is required" },
        { status: 400 }
      );
    }

    // Get all images to find the one to delete
    const images = await gallery.list(category);
    const image = images.find((img) => img.id === id);

    if (!image) {
      return NextResponse.json(
        { error: "Image not found" },
        { status: 404 }
      );
    }

    // Delete from S3 if the file exists
    if (image.s3Key) {
      try {
        await deleteFile(image.s3Key);
      } catch (s3Error) {
        console.error("Error deleting from S3:", s3Error);
        // Continue with DynamoDB deletion even if S3 fails
      }
    }

    // Delete from DynamoDB
    await gallery.delete(category, id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting gallery image:", error);
    return NextResponse.json(
      { error: "Failed to delete gallery image" },
      { status: 500 }
    );
  }
}
