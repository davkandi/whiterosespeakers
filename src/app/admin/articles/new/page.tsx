"use client";

import ArticleForm from "@/components/admin/ArticleForm";

export default function NewArticlePage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
          Create New Article
        </h1>
        <p className="text-foreground-muted mt-1">
          Write a new blog post or article
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-md border border-border p-6">
        <ArticleForm />
      </div>
    </div>
  );
}
