import { NextRequest, NextResponse } from "next/server";
import { articles, events, gallery, teamMembers, testimonials, subscribers } from "@/lib/dynamodb";
import { requireAdmin, isAuthError } from "@/lib/api-auth";

// GET /api/admin/stats - Get dashboard statistics
export async function GET(request: NextRequest) {
  const authResult = await requireAdmin(request);
  if (isAuthError(authResult)) return authResult;

  try {
    // Fetch all data in parallel
    const [
      allArticles,
      allEvents,
      allImages,
      allTeamMembers,
      allTestimonials,
      allSubscribers,
    ] = await Promise.all([
      articles.list(),
      events.list(),
      gallery.list(),
      teamMembers.list(false),
      testimonials.list(false),
      subscribers.list(),
    ]);

    // Calculate statistics
    const now = new Date();
    const publishedArticles = allArticles.filter((a) => a.status === "published");
    const draftArticles = allArticles.filter((a) => a.status === "draft");
    const upcomingEvents = allEvents.filter((e) => new Date(e.date) >= now);
    const pastEvents = allEvents.filter((e) => new Date(e.date) < now);
    const activeTeamMembers = allTeamMembers.filter((m) => m.active);
    const activeTestimonials = allTestimonials.filter((t) => t.active);

    // Get recent activity
    const recentArticles = [...allArticles]
      .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
      .slice(0, 5);

    const recentImages = [...allImages]
      .sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime())
      .slice(0, 5);

    return NextResponse.json({
      articles: {
        total: allArticles.length,
        published: publishedArticles.length,
        draft: draftArticles.length,
      },
      events: {
        total: allEvents.length,
        upcoming: upcomingEvents.length,
        past: pastEvents.length,
      },
      gallery: {
        total: allImages.length,
      },
      team: {
        total: allTeamMembers.length,
        active: activeTeamMembers.length,
      },
      testimonials: {
        total: allTestimonials.length,
        active: activeTestimonials.length,
      },
      subscribers: {
        total: allSubscribers.length,
      },
      recent: {
        articles: recentArticles.map((a) => ({
          id: a.id,
          title: a.title,
          status: a.status,
          publishedAt: a.publishedAt,
        })),
        images: recentImages.map((i) => ({
          id: i.id,
          title: i.title,
          category: i.category,
          uploadedAt: i.uploadedAt,
        })),
      },
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch statistics" },
      { status: 500 }
    );
  }
}
