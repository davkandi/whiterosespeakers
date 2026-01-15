"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  Calendar,
  User,
} from "lucide-react";
import { useAuth } from "@/lib/auth";
import DeleteConfirmModal from "@/components/admin/DeleteConfirmModal";
import type { Article } from "@/lib/dynamodb";

export default function ArticlesAdminPage() {
  const { getAccessToken } = useAuth();
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "published" | "draft">("all");
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; article: Article | null }>({
    isOpen: false,
    article: null,
  });
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchArticles = useCallback(async () => {
    try {
      const token = await getAccessToken();
      if (!token) return;

      const response = await fetch("/api/admin/articles", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error("Failed to fetch articles");

      const data = await response.json();
      setArticles(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  }, [getAccessToken]);

  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  const filteredArticles = articles.filter((article) => {
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || article.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleDelete = async () => {
    if (!deleteModal.article) return;
    setIsDeleting(true);

    try {
      const token = await getAccessToken();
      if (!token) throw new Error("Authentication required");

      const response = await fetch(`/api/admin/articles/${deleteModal.article.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error("Failed to delete article");

      setArticles(articles.filter((a) => a.id !== deleteModal.article?.id));
      setDeleteModal({ isOpen: false, article: null });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete");
    } finally {
      setIsDeleting(false);
    }
  };

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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Articles</h1>
          <p className="text-foreground-muted mt-1">Manage your blog posts and articles</p>
        </div>
        <Link href="/admin/articles/new" className="btn-primary flex items-center gap-2">
          <Plus className="w-5 h-5" />
          New Article
        </Link>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-md border border-border p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground-muted" />
            <input
              type="text"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
          <div className="flex gap-2">
            {(["all", "published", "draft"] as const).map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  statusFilter === status
                    ? "bg-primary text-white"
                    : "bg-background-secondary text-foreground-muted hover:bg-primary/10"
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Articles List */}
      <div className="bg-white rounded-xl shadow-md border border-border overflow-hidden">
        {filteredArticles.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-foreground-muted">No articles found</p>
            <Link
              href="/admin/articles/new"
              className="inline-flex items-center gap-2 text-primary mt-4 hover:text-primary-light"
            >
              <Plus className="w-4 h-4" />
              Create your first article
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {filteredArticles.map((article, index) => (
              <motion.div
                key={article.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="p-4 hover:bg-background-secondary transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className={`px-2 py-0.5 rounded text-xs font-medium ${
                          article.status === "published"
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {article.status}
                      </span>
                    </div>
                    <h3 className="font-bold text-foreground truncate">{article.title}</h3>
                    <div className="flex items-center gap-4 mt-2 text-sm text-foreground-muted">
                      <span className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        {article.author}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(article.updatedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {article.status === "published" && (
                      <a
                        href={`/blog/${article.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-lg hover:bg-primary/10 text-foreground-muted hover:text-primary transition-colors"
                        title="View"
                      >
                        <Eye className="w-5 h-5" />
                      </a>
                    )}
                    <Link
                      href={`/admin/articles/${article.id}/edit`}
                      className="p-2 rounded-lg hover:bg-primary/10 text-foreground-muted hover:text-primary transition-colors"
                      title="Edit"
                    >
                      <Edit className="w-5 h-5" />
                    </Link>
                    <button
                      onClick={() => setDeleteModal({ isOpen: true, article })}
                      className="p-2 rounded-lg hover:bg-red-50 text-foreground-muted hover:text-red-600 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mt-6">
        <div className="bg-white rounded-lg p-4 text-center border border-border">
          <p className="text-2xl font-bold text-foreground">{articles.length}</p>
          <p className="text-sm text-foreground-muted">Total</p>
        </div>
        <div className="bg-white rounded-lg p-4 text-center border border-border">
          <p className="text-2xl font-bold text-green-600">
            {articles.filter((a) => a.status === "published").length}
          </p>
          <p className="text-sm text-foreground-muted">Published</p>
        </div>
        <div className="bg-white rounded-lg p-4 text-center border border-border">
          <p className="text-2xl font-bold text-yellow-600">
            {articles.filter((a) => a.status === "draft").length}
          </p>
          <p className="text-sm text-foreground-muted">Drafts</p>
        </div>
      </div>

      <DeleteConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, article: null })}
        onConfirm={handleDelete}
        title="Delete Article"
        message={`Are you sure you want to delete "${deleteModal.article?.title}"? This action cannot be undone.`}
        isDeleting={isDeleting}
      />
    </div>
  );
}
