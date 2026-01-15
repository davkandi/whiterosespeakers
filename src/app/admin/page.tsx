"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  FileText,
  Calendar,
  Image,
  Users,
  MessageSquareQuote,
  TrendingUp,
  Eye,
  Plus,
} from "lucide-react";
import { useAuth } from "@/lib/auth";

interface DashboardStats {
  articles: { total: number; published: number; draft: number };
  events: { total: number; upcoming: number; past: number };
  gallery: { total: number };
  team: { total: number; active: number };
  testimonials: { total: number; active: number };
  subscribers: { total: number };
  recent: {
    articles: Array<{ id: string; title: string; status: string; updatedAt: string }>;
    images: Array<{ id: string; title: string; category: string; uploadedAt: string }>;
  };
}

const quickActions = [
  {
    label: "New Article",
    description: "Create a new blog post",
    href: "/admin/articles/new",
    icon: FileText,
  },
  {
    label: "Add Event",
    description: "Schedule a new event",
    href: "/admin/events/new",
    icon: Calendar,
  },
  {
    label: "Upload Images",
    description: "Add photos to gallery",
    href: "/admin/gallery",
    icon: Image,
  },
  {
    label: "Add Team Member",
    description: "Update leadership team",
    href: "/admin/team/new",
    icon: Users,
  },
];

export default function AdminDashboard() {
  const { getAccessToken } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchStats = useCallback(async () => {
    try {
      const token = await getAccessToken();
      if (!token) return;

      const response = await fetch("/api/admin/stats", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setIsLoading(false);
    }
  }, [getAccessToken]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const statCards = stats
    ? [
        {
          label: "Articles",
          value: stats.articles.total.toString(),
          change: `${stats.articles.published} published`,
          icon: FileText,
          color: "bg-primary",
          href: "/admin/articles",
        },
        {
          label: "Events",
          value: stats.events.total.toString(),
          change: `${stats.events.upcoming} upcoming`,
          icon: Calendar,
          color: "bg-secondary",
          href: "/admin/events",
        },
        {
          label: "Gallery Images",
          value: stats.gallery.total.toString(),
          change: "View gallery",
          icon: Image,
          color: "bg-accent",
          href: "/admin/gallery",
        },
        {
          label: "Team Members",
          value: stats.team.total.toString(),
          change: `${stats.team.active} active`,
          icon: Users,
          color: "bg-green-500",
          href: "/admin/team",
        },
        {
          label: "Testimonials",
          value: stats.testimonials.total.toString(),
          change: `${stats.testimonials.active} active`,
          icon: MessageSquareQuote,
          color: "bg-purple-500",
          href: "/admin/testimonials",
        },
        {
          label: "Subscribers",
          value: stats.subscribers.total.toString(),
          change: "Newsletter list",
          icon: Users,
          color: "bg-blue-500",
          href: "/admin/settings",
        },
      ]
    : [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-600" />
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-foreground-muted mt-1">
          Welcome back! Here&apos;s what&apos;s happening with your site.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
          >
            <Link
              href={stat.href}
              className="block bg-white rounded-xl p-6 shadow-md border border-border hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div
                  className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}
                >
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <span className="text-xs text-green-600 font-medium flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  {stat.change}
                </span>
              </div>
              <p className="text-3xl font-bold text-foreground">{stat.value}</p>
              <p className="text-sm text-foreground-muted">{stat.label}</p>
            </Link>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="bg-white rounded-xl shadow-md border border-border p-6"
        >
          <h2 className="text-lg font-bold text-foreground mb-4">Quick Actions</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {quickActions.map((action) => (
              <Link
                key={action.label}
                href={action.href}
                className="flex items-center gap-4 p-4 rounded-lg border border-border hover:border-primary hover:bg-primary/5 transition-colors group"
              >
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                  <action.icon className="w-5 h-5 text-primary group-hover:text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-foreground">{action.label}</p>
                  <p className="text-xs text-foreground-muted">{action.description}</p>
                </div>
                <Plus className="w-5 h-5 text-foreground-muted group-hover:text-primary" />
              </Link>
            ))}
          </div>
        </motion.div>

        {/* Recent Articles */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.5 }}
          className="bg-white rounded-xl shadow-md border border-border p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-foreground">Recent Articles</h2>
            <Link
              href="/admin/articles"
              className="text-sm text-primary hover:text-primary-light transition-colors"
            >
              View all
            </Link>
          </div>
          {stats?.recent?.articles && stats.recent.articles.length > 0 ? (
            <div className="space-y-4">
              {stats.recent.articles.map((article) => (
                <Link
                  key={article.id}
                  href={`/admin/articles/${article.id}/edit`}
                  className="flex items-start gap-4 pb-4 border-b border-border last:border-0 last:pb-0 hover:bg-gray-50 -mx-2 px-2 py-2 rounded"
                >
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground text-sm truncate">
                      {article.title}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span
                        className={`px-2 py-0.5 rounded text-xs ${
                          article.status === "published"
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {article.status}
                      </span>
                      <span className="text-xs text-foreground-muted">
                        {new Date(article.updatedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <FileText className="w-10 h-10 text-gray-300 mx-auto mb-2" />
              <p className="text-sm text-foreground-muted">No articles yet</p>
              <Link
                href="/admin/articles/new"
                className="text-sm text-primary hover:text-primary-light mt-2 inline-block"
              >
                Create your first article
              </Link>
            </div>
          )}
        </motion.div>
      </div>

      {/* Website Preview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.6 }}
        className="mt-8 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-xl p-6"
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-foreground">Preview Your Site</h2>
            <p className="text-sm text-foreground-muted">
              See how your changes look on the live website
            </p>
          </div>
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary flex items-center gap-2"
          >
            <Eye className="w-5 h-5" />
            View Website
          </a>
        </div>
      </motion.div>
    </div>
  );
}
