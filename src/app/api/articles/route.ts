import { NextResponse } from "next/server";
import { articles } from "@/lib/dynamodb";

// GET /api/articles - List published articles
export async function GET() {
  try {
    const allArticles = await articles.list();

    // Filter to published only and sort by date
    const publishedArticles = allArticles
      .filter((article) => article.status === "published")
      .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

    return NextResponse.json(publishedArticles);
  } catch (error) {
    console.error("Error fetching articles:", error);
    return NextResponse.json(
      { error: "Failed to fetch articles" },
      { status: 500 }
    );
  }
}
