import { NextRequest, NextResponse } from "next/server";
import { gallery } from "@/lib/dynamodb";
import { getPublicUrl } from "@/lib/s3";

// GET /api/gallery - List gallery images
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");

    const images = await gallery.list(category || undefined);

    // Sort by upload date descending
    images.sort((a, b) =>
      new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
    );

    // Add URL to each image from s3Key
    const imagesWithUrls = images.map((image) => ({
      ...image,
      url: getPublicUrl(image.s3Key),
    }));

    return NextResponse.json(imagesWithUrls);
  } catch (error) {
    console.error("Error fetching gallery:", error);
    return NextResponse.json(
      { error: "Failed to fetch gallery" },
      { status: 500 }
    );
  }
}
