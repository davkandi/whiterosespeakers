"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  Calendar,
  User,
  Clock,
  ArrowLeft,
  Share2,
  Facebook,
  Twitter,
  Linkedin,
} from "lucide-react";

// Sample blog post data - in production, this would come from DynamoDB
const posts: Record<string, {
  title: string;
  excerpt: string;
  author: string;
  date: string;
  readTime: string;
  category: string;
  content: string;
}> = {
  "overcome-fear-public-speaking": {
    title: "5 Proven Strategies to Overcome Your Fear of Public Speaking",
    excerpt:
      "Discover practical techniques that will help you transform your anxiety into confidence and deliver compelling presentations.",
    author: "Sarah Mitchell",
    date: "2024-01-10",
    readTime: "5 min read",
    category: "Tips",
    content: `
Public speaking anxiety affects up to 75% of the population, making it one of the most common fears. But here's the good news: with the right strategies and consistent practice, you can transform this fear into confidence.

## 1. Reframe Your Mindset

The first step is changing how you think about public speaking. Instead of viewing it as a performance to be judged, see it as a conversation with your audience. You're sharing valuable information, not seeking approval.

**Try this:** Before your next speech, remind yourself: "I'm here to share something useful. My audience wants me to succeed."

## 2. Practice, Practice, Practice

There's no substitute for practice. The more familiar you are with your material, the more confident you'll feel. But don't just practice in your head—say it out loud.

At White Rose Speakers, we provide a safe environment to practice regularly. Each meeting gives you opportunities to speak, whether it's a prepared speech or impromptu Table Topics.

## 3. Master Your Breathing

When we're anxious, our breathing becomes shallow, which can make us feel more stressed. Deep, controlled breathing activates your parasympathetic nervous system and helps calm your nerves.

**Exercise:** Before speaking, take 5 deep breaths. Inhale for 4 counts, hold for 4, exhale for 4.

## 4. Focus on Your Message, Not Yourself

Anxiety often stems from self-focus—worrying about how we look or sound. Shift your attention to your message and your audience. What do they need to hear? How can you help them?

## 5. Embrace Imperfection

No speech is perfect, and that's okay. Audiences are forgiving and often don't notice small mistakes. What matters is authenticity and connection.

---

**Ready to put these strategies into practice?** Join us at White Rose Speakers Leeds, where you'll find a supportive community eager to help you grow. Your first visit is free!
    `,
  },
};

export default function BlogPostPage() {
  const params = useParams();
  const slug = params.slug as string;
  const post = posts[slug];

  if (!post) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Article Not Found
          </h1>
          <p className="text-foreground-muted mb-8">
            The article you're looking for doesn't exist.
          </p>
          <Link href="/blog" className="btn-primary">
            Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 bg-gradient-to-br from-secondary to-secondary-dark text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 rose-pattern" />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Blog
            </Link>
            <span className="inline-block px-3 py-1 bg-accent/20 text-accent rounded-full text-sm font-medium mb-4">
              {post.category}
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
              {post.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-white/80">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                {post.author}
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {new Date(post.date).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                {post.readTime}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Article Content */}
      <section className="py-16 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-[1fr_200px] gap-12">
            <motion.article
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="prose prose-lg max-w-none
                prose-headings:font-bold prose-headings:text-foreground
                prose-p:text-foreground-muted prose-p:leading-relaxed
                prose-a:text-primary prose-a:no-underline hover:prose-a:underline
                prose-strong:text-foreground
                prose-ul:text-foreground-muted
                prose-ol:text-foreground-muted
                prose-blockquote:border-primary prose-blockquote:text-foreground-muted
                prose-hr:border-border"
            >
              {post.content.split("\n").map((paragraph, index) => {
                if (paragraph.startsWith("## ")) {
                  return (
                    <h2 key={index} className="text-2xl mt-8 mb-4">
                      {paragraph.replace("## ", "")}
                    </h2>
                  );
                }
                if (paragraph.startsWith("**") && paragraph.endsWith("**")) {
                  return (
                    <p key={index} className="font-semibold">
                      {paragraph.replace(/\*\*/g, "")}
                    </p>
                  );
                }
                if (paragraph.startsWith("---")) {
                  return <hr key={index} className="my-8" />;
                }
                if (paragraph.trim()) {
                  return <p key={index}>{paragraph}</p>;
                }
                return null;
              })}
            </motion.article>

            {/* Share Sidebar */}
            <motion.aside
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="hidden lg:block"
            >
              <div className="sticky top-32">
                <h4 className="text-sm font-semibold text-foreground mb-4">
                  Share this article
                </h4>
                <div className="flex flex-col gap-2">
                  <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#1877f2] text-white text-sm hover:opacity-90 transition-opacity">
                    <Facebook className="w-4 h-4" />
                    Facebook
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#1da1f2] text-white text-sm hover:opacity-90 transition-opacity">
                    <Twitter className="w-4 h-4" />
                    Twitter
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#0a66c2] text-white text-sm hover:opacity-90 transition-opacity">
                    <Linkedin className="w-4 h-4" />
                    LinkedIn
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-foreground-muted text-white text-sm hover:opacity-90 transition-opacity">
                    <Share2 className="w-4 h-4" />
                    Copy Link
                  </button>
                </div>
              </div>
            </motion.aside>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-background-secondary">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-gradient-to-br from-primary to-primary-dark rounded-2xl p-8 lg:p-12 text-white text-center"
          >
            <h2 className="text-2xl lg:text-3xl font-bold mb-4">
              Ready to Start Your Speaking Journey?
            </h2>
            <p className="text-white/80 mb-6 max-w-xl mx-auto">
              Join White Rose Speakers Leeds and discover how our supportive
              community can help you become a confident speaker.
            </p>
            <a
              href="https://www.toastmasters.org/Find-a-Club/01971684-white-rose-speakers/contact-club?id=8e2c929b-8cd7-ec11-a2fd-005056875f20"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white text-primary px-8 py-3 rounded-lg font-semibold hover:bg-white/90 transition-colors inline-block"
            >
              Visit as a Guest
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
