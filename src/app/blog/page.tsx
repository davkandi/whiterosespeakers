"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Calendar, User, ArrowRight, Clock } from "lucide-react";

// Sample blog posts - in production, these would come from DynamoDB
const posts = [
  {
    id: "1",
    slug: "overcome-fear-public-speaking",
    title: "5 Proven Strategies to Overcome Your Fear of Public Speaking",
    excerpt:
      "Discover practical techniques that will help you transform your anxiety into confidence and deliver compelling presentations.",
    author: "Sarah Mitchell",
    date: "2024-01-10",
    readTime: "5 min read",
    category: "Tips",
    featured: true,
    image: "https://cdn.lindoai.com/c/recNxZpB13uzSjqpH/images/83153514.jpg",
  },
  {
    id: "2",
    slug: "power-of-storytelling",
    title: "The Power of Storytelling in Business Presentations",
    excerpt:
      "Learn how to captivate your audience and make your message memorable through the art of storytelling.",
    author: "James Thompson",
    date: "2024-01-05",
    readTime: "7 min read",
    category: "Skills",
    featured: false,
    image: "https://cdn.lindoai.com/c/recNxZpB13uzSjqpH/images/33005501.jpg",
  },
  {
    id: "3",
    slug: "toastmasters-pathways",
    title: "Getting the Most Out of Your Toastmasters Pathways Journey",
    excerpt:
      "A comprehensive guide to navigating the Pathways learning experience and maximizing your development.",
    author: "Priya Sharma",
    date: "2023-12-20",
    readTime: "6 min read",
    category: "Education",
    featured: false,
    image: "https://cdn.lindoai.com/c/recNxZpB13uzSjqpH/images/94363180.jpg",
  },
  {
    id: "4",
    slug: "body-language-secrets",
    title: "Body Language Secrets Every Speaker Should Know",
    excerpt:
      "Your nonverbal communication speaks volumes. Here's how to make sure it's saying the right things.",
    author: "Michael Chen",
    date: "2023-12-15",
    readTime: "4 min read",
    category: "Tips",
    featured: false,
    image: "https://cdn.lindoai.com/c/recNxZpB13uzSjqpH/images/47671624.jpg",
  },
  {
    id: "5",
    slug: "impromptu-speaking-mastery",
    title: "Mastering the Art of Impromptu Speaking",
    excerpt:
      "Table Topics can be daunting, but with these techniques, you'll learn to think on your feet with ease.",
    author: "Emma Williams",
    date: "2023-12-10",
    readTime: "5 min read",
    category: "Skills",
    featured: false,
    image: "https://cdn.lindoai.com/c/recNxZpB13uzSjqpH/images/55473831.jpg",
  },
  {
    id: "6",
    slug: "leadership-through-speaking",
    title: "How Public Speaking Accelerates Your Leadership Journey",
    excerpt:
      "The connection between effective communication and leadership success, and how Toastmasters bridges the gap.",
    author: "David Brown",
    date: "2023-12-05",
    readTime: "6 min read",
    category: "Leadership",
    featured: false,
    image: "https://cdn.lindoai.com/c/recNxZpB13uzSjqpH/images/10404643.jpg",
  },
];

const categories = ["All", "Tips", "Skills", "Education", "Leadership"];

export default function BlogPage() {
  const featuredPost = posts.find((post) => post.featured);
  const regularPosts = posts.filter((post) => !post.featured);

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

      {/* Featured Post */}
      {featuredPost && (
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
                <div className="relative aspect-[21/9] w-full">
                  <Image
                    src={featuredPost.image}
                    alt={featuredPost.title}
                    fill
                    className="object-cover"
                  />
                </div>
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
                    {new Date(featuredPost.date).toLocaleDateString("en-GB", {
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
      <section className="py-16 bg-background-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Category Filter */}
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
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  category === "All"
                    ? "bg-primary text-white"
                    : "bg-white text-foreground-muted hover:bg-primary/10 hover:text-primary"
                }`}
              >
                {category}
              </button>
            ))}
          </motion.div>

          {/* Posts Grid */}
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
                    <div className="relative aspect-video">
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <span className="inline-block px-2 py-1 bg-primary/10 text-primary rounded text-xs font-medium mb-3">
                      {post.category}
                    </span>
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

          {/* Load More */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mt-12"
          >
            <button className="btn-outline">Load More Articles</button>
          </motion.div>
        </div>
      </section>

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
