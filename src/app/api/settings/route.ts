import { NextResponse } from "next/server";
import { siteSettings } from "@/lib/dynamodb";

// GET /api/settings - Get public site settings
export async function GET() {
  try {
    const settings = await siteSettings.get();

    return NextResponse.json(settings);
  } catch (error) {
    console.error("Error fetching settings:", error);
    return NextResponse.json(
      { error: "Failed to fetch settings" },
      { status: 500 }
    );
  }
}
