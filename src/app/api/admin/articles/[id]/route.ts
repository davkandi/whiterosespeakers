import { NextRequest, NextResponse } from "next/server";
import { articles } from "@/lib/dynamodb";
import { requireAdmin, isAuthError } from "@/lib/api-auth";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET /api/admin/articles/[id] - Get a single article
export async function GET(request: NextRequest, { params }: RouteParams) {
  const authResult = await requireAdmin(request);
  if (isAuthError(authResult)) return authResult;

  try {
    const { id } = await params;
    const article = await articles.get(id);

    if (!article) {
      return NextResponse.json(
        { error: "Article not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(article);
  } catch (error) {
    console.error("Error fetching article:", error);
    return NextResponse.json(
      { error: "Failed to fetch article" },
      { status: 500 }
    );
  }
}

// PUT /api/admin/articles/[id] - Update an article
export async function PUT(request: NextRequest, { params }: RouteParams) {
  const authResult = await requireAdmin(request);
  if (isAuthError(authResult)) return authResult;

  try {
    const { id } = await params;
    const body = await request.json();

    const existing = await articles.get(id);
    if (!existing) {
      return NextResponse.json(
        { error: "Article not found" },
        { status: 404 }
      );
    }

    // If changing slug, check it doesn't conflict
    if (body.slug && body.slug !== existing.slug) {
      const slugExists = await articles.getBySlug(body.slug);
      if (slugExists && slugExists.id !== id) {
        return NextResponse.json(
          { error: "An article with this slug already exists" },
          { status: 409 }
        );
      }
    }

    // If publishing for the first time, set publishedAt
    if (body.status === "published" && existing.status === "draft") {
      body.publishedAt = new Date().toISOString();
    }

    await articles.update(id, body);

    const updated = await articles.get(id);
    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error updating article:", error);
    return NextResponse.json(
      { error: "Failed to update article" },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/articles/[id] - Delete an article
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const authResult = await requireAdmin(request);
  if (isAuthError(authResult)) return authResult;

  try {
    const { id } = await params;

    const existing = await articles.get(id);
    if (!existing) {
      return NextResponse.json(
        { error: "Article not found" },
        { status: 404 }
      );
    }

    await articles.delete(id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting article:", error);
    return NextResponse.json(
      { error: "Failed to delete article" },
      { status: 500 }
    );
  }
}
