"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Plus, Edit, Trash2, Quote, Star } from "lucide-react";
import { useAuth } from "@/lib/auth";
import DeleteConfirmModal from "@/components/admin/DeleteConfirmModal";
import type { Testimonial } from "@/lib/dynamodb";

export default function TestimonialsAdminPage() {
  const { getAccessToken } = useAuth();
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; testimonial: Testimonial | null }>({
    isOpen: false,
    testimonial: null,
  });
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchTestimonials = useCallback(async () => {
    try {
      const token = await getAccessToken();
      if (!token) return;

      const response = await fetch("/api/admin/testimonials", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error("Failed to fetch testimonials");

      const data = await response.json();
      setTestimonials(data.sort((a: Testimonial, b: Testimonial) => a.order - b.order));
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  }, [getAccessToken]);

  useEffect(() => {
    fetchTestimonials();
  }, [fetchTestimonials]);

  const handleDelete = async () => {
    if (!deleteModal.testimonial) return;
    setIsDeleting(true);

    try {
      const token = await getAccessToken();
      if (!token) throw new Error("Authentication required");

      const response = await fetch(`/api/admin/testimonials/${deleteModal.testimonial.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error("Failed to delete testimonial");

      setTestimonials(testimonials.filter((t) => t.id !== deleteModal.testimonial?.id));
      setDeleteModal({ isOpen: false, testimonial: null });
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

  const activeTestimonials = testimonials.filter((t) => t.active);
  const inactiveTestimonials = testimonials.filter((t) => !t.active);

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Testimonials</h1>
          <p className="text-foreground-muted mt-1">Manage member testimonials</p>
        </div>
        <Link href="/admin/testimonials/new" className="btn-primary flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Add Testimonial
        </Link>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {/* Active Testimonials */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-foreground mb-4">Active ({activeTestimonials.length})</h2>
        <div className="space-y-4">
          {activeTestimonials.length === 0 ? (
            <div className="bg-white rounded-xl shadow-md border border-border p-12 text-center">
              <Quote className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-foreground-muted">No testimonials yet</p>
              <Link
                href="/admin/testimonials/new"
                className="inline-flex items-center gap-2 text-primary mt-4 hover:text-primary-light"
              >
                <Plus className="w-4 h-4" />
                Add your first testimonial
              </Link>
            </div>
          ) : (
            activeTestimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-xl shadow-md border border-border p-6"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-1 mb-2">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < testimonial.rating
                              ? "text-yellow-400 fill-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-foreground italic mb-4">&ldquo;{testimonial.quote}&rdquo;</p>
                    <p className="font-medium text-foreground">{testimonial.author}</p>
                    {testimonial.role && (
                      <p className="text-sm text-foreground-muted">{testimonial.role}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/admin/testimonials/${testimonial.id}/edit`}
                      className="p-2 rounded-lg hover:bg-primary/10 text-foreground-muted hover:text-primary transition-colors"
                      title="Edit"
                    >
                      <Edit className="w-5 h-5" />
                    </Link>
                    <button
                      onClick={() => setDeleteModal({ isOpen: true, testimonial })}
                      className="p-2 rounded-lg hover:bg-red-50 text-foreground-muted hover:text-red-600 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>

      {/* Inactive Testimonials */}
      {inactiveTestimonials.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-4">Inactive ({inactiveTestimonials.length})</h2>
          <div className="space-y-4 opacity-75">
            {inactiveTestimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-xl shadow-md border border-border p-6"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <span className="px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600 mb-2 inline-block">
                      Inactive
                    </span>
                    <p className="text-foreground italic mb-2 line-clamp-2">&ldquo;{testimonial.quote}&rdquo;</p>
                    <p className="text-sm text-foreground-muted">{testimonial.author}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/admin/testimonials/${testimonial.id}/edit`}
                      className="p-2 rounded-lg hover:bg-primary/10 text-foreground-muted hover:text-primary transition-colors"
                      title="Edit"
                    >
                      <Edit className="w-5 h-5" />
                    </Link>
                    <button
                      onClick={() => setDeleteModal({ isOpen: true, testimonial })}
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
        </div>
      )}

      <DeleteConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, testimonial: null })}
        onConfirm={handleDelete}
        title="Delete Testimonial"
        message={`Are you sure you want to delete the testimonial from "${deleteModal.testimonial?.author}"? This action cannot be undone.`}
        isDeleting={isDeleting}
      />
    </div>
  );
}
