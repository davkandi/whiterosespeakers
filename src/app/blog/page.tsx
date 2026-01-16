"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Calendar, User, ArrowRight, Clock, Loader2 } from "lucide-react";

interface Article {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  publishedAt: string;
  status: "draft" | "published";
  featuredImage?: string;
  category: string;
  readTime: string;
}

export default function BlogPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    async function fetchArticles() {
      try {
        const response = await fetch("/api/articles");
        if (response.ok) {
          const data = await response.json();
          setArticles(data);
        }
      } catch (error) {
        console.error("Error fetching articles:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchArticles();
  }, []);

  // Get unique categories from articles
  const categories = ["All", ...new Set(articles.map((a) => a.category).filter(Boolean))];

  // Filter articles by category
  const filteredArticles = selectedCategory === "All"
    ? articles
    : articles.filter((a) => a.category === selectedCategory);

  // Get featured post (first article) and regular posts
  const featuredPost = filteredArticles[0];
  const regularPosts = filteredArticles.slice(1);

  return (
    <div>
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 bg-gradient-to-br from-secondary to-secondary-dark text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 rose-pattern" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <span className="inline-block px-4 py-2 bg-accent/20 text-accent rounded-full text-sm font-medium mb-6">
              Our Blog
            </span>
            <h1 className="text-4xl sm:text-5xl font-bold mb-6">
              Insights & Inspiration
            </h1>
            <p className="text-lg text-white/80">
              Tips, stories, and guidance to help you on your public speaking and
              leadership journey.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Loading State */}
      {loading && (
        <section className="py-20 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
            <p className="mt-4 text-foreground-muted">Loading articles...</p>
          </div>
        </section>
      )}

      {/* Empty State */}
      {!loading && articles.length === 0 && (
        <section className="py-20 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="max-w-md mx-auto">
              <h2 className="text-2xl font-bold text-foreground mb-4">No Articles Yet</h2>
              <p className="text-foreground-muted mb-8">
                We&apos;re working on creating great content for you. Check back soon for tips,
                stories, and insights about public speaking and leadership.
              </p>
              <Link href="/contact" className="btn-primary">
                Get in Touch
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Featured Post */}
      {!loading && featuredPost && (
        <section className="py-16 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Link
                href={`/blog/${featuredPost.slug}`}
                className="group block bg-gradient-to-br from-primary/5 to-secondary/5 rounded-2xl overflow-hidden border border-border hover:shadow-xl transition-all"
              >
                {featuredPost.featuredImage && (
                  <div className="relative aspect-[21/9] w-full">
                    <Image
                      src={featuredPost.featuredImage}
                      alt={featuredPost.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="p-8 lg:p-12">
                  <span className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium mb-4">
                    Featured Article
                  </span>
                  <h2 className="text-2xl lg:text-4xl font-bold text-foreground mb-4 group-hover:text-primary transition-colors">
                    {featuredPost.title}
                  </h2>
                  <p className="text-foreground-muted text-lg mb-6 max-w-3xl">
                    {featuredPost.excerpt}
                  </p>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-foreground-muted">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      {featuredPost.author}
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      {new Date(featuredPost.publishedAt).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      {featuredPost.readTime}
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          </div>
        </section>
      )}

      {/* Categories & Posts */}
      {!loading && articles.length > 0 && (
        <section className="py-16 bg-background-secondary">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Category Filter */}
            {categories.length > 1 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="flex flex-wrap gap-2 mb-12"
              >
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      category === selectedCategory
                        ? "bg-primary text-white"
                        : "bg-white text-foreground-muted hover:bg-primary/10 hover:text-primary"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </motion.div>
            )}

            {/* Posts Grid */}
            {regularPosts.length > 0 && (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {regularPosts.map((post, index) => (
                  <motion.article
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <Link
                      href={`/blog/${post.slug}`}
                      className="group block bg-white rounded-2xl overflow-hidden shadow-lg border border-border hover:shadow-xl transition-all h-full"
                    >
                      {post.featuredImage && (
                        <div className="relative aspect-video">
                          <Image
                            src={post.featuredImage}
                            alt={post.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                      <div className="p-6">
                        {post.category && (
                          <span className="inline-block px-2 py-1 bg-primary/10 text-primary rounded text-xs font-medium mb-3">
                            {post.category}
                          </span>
                        )}
                        <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2">
                          {post.title}
                        </h3>
                        <p className="text-foreground-muted text-sm mb-4 line-clamp-2">
                          {post.excerpt}
                        </p>
                        <div className="flex items-center justify-between text-xs text-foreground-muted">
                          <span>{post.author}</span>
                          <span>{post.readTime}</span>
                        </div>
                      </div>
                    </Link>
                  </motion.article>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Newsletter CTA */}
      <section className="py-20 bg-gradient-to-br from-primary to-primary-dark text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">
              Stay Updated
            </h2>
            <p className="text-white/80 text-lg max-w-2xl mx-auto mb-8">
              Subscribe to our newsletter for the latest articles, tips, and club
              news delivered to your inbox.
            </p>
            <form className="max-w-md mx-auto flex flex-col sm:flex-row gap-4">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent"
              />
              <button type="submit" className="bg-accent text-white px-6 py-3 rounded-lg font-semibold hover:bg-accent-light transition-colors whitespace-nowrap">
                Subscribe
              </button>
            </form>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
