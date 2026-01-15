import { NextRequest, NextResponse } from "next/server";
import { articles } from "@/lib/dynamodb";
import { requireAdmin, isAuthError } from "@/lib/api-auth";

// GET /api/admin/articles - List all articles
export async function GET(request: NextRequest) {
  const authResult = await requireAdmin(request);
  if (isAuthError(authResult)) return authResult;

  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") as "draft" | "published" | null;

    const articleList = await articles.list(status || undefined);

    // Sort by publishedAt descending
    articleList.sort((a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );

    return NextResponse.json(articleList);
  } catch (error) {
    console.error("Error fetching articles:", error);
    return NextResponse.json(
      { error: "Failed to fetch articles" },
      { status: 500 }
    );
  }
}

// POST /api/admin/articles - Create a new article
export async function POST(request: NextRequest) {
  const authResult = await requireAdmin(request);
  if (isAuthError(authResult)) return authResult;

  try {
    const body = await request.json();

    // Validate required fields
    if (!body.title || !body.slug || !body.content) {
      return NextResponse.json(
        { error: "Title, slug, and content are required" },
        { status: 400 }
      );
    }

    // Check if slug already exists
    const existing = await articles.getBySlug(body.slug);
    if (existing) {
      return NextResponse.json(
        { error: "An article with this slug already exists" },
        { status: 409 }
      );
    }

    const article = await articles.create({
      title: body.title,
      slug: body.slug,
      excerpt: body.excerpt || "",
      content: body.content,
      author: body.author || authResult.user.username,
      publishedAt: body.status === "published" ? new Date().toISOString() : "",
      status: body.status || "draft",
      featuredImage: body.featuredImage || undefined,
      category: body.category || "Tips",
      readTime: body.readTime || "5 min read",
    });

    return NextResponse.json(article, { status: 201 });
  } catch (error) {
    console.error("Error creating article:", error);
    return NextResponse.json(
      { error: "Failed to create article" },
      { status: 500 }
    );
  }
}
