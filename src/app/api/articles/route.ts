import { NextRequest, NextResponse } from "next/server";
import { articles } from "@/lib/dynamodb";

// GET /api/articles - List published articles or get single by slug
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get("slug");

    // If slug is provided, fetch single article
    if (slug) {
      const article = await articles.getBySlug(slug);
      if (!article || article.status !== "published") {
        return NextResponse.json(null);
      }
      return NextResponse.json(article);
    }

    // Otherwise, list all published articles
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
