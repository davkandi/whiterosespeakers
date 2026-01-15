"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import type { Testimonial } from "@/lib/dynamodb";

interface TestimonialFormProps {
  testimonial?: Testimonial;
  isEditing?: boolean;
}

export default function TestimonialForm({
  testimonial,
  isEditing = false,
}: TestimonialFormProps) {
  const router = useRouter();
  const { getAccessToken } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    quote: testimonial?.quote || "",
    author: testimonial?.author || "",
    role: testimonial?.role || "",
    rating: testimonial?.rating ?? 5,
    active: testimonial?.active ?? true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const token = await getAccessToken();
      if (!token) {
        throw new Error("Authentication required");
      }

      const url = isEditing
        ? `/api/admin/testimonials/${testimonial?.id}`
        : "/api/admin/testimonials";

      const response = await fetch(url, {
        method: isEditing ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to save testimonial");
      }

      router.push("/admin/testimonials");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div>
        <label
          htmlFor="quote"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Quote / Testimonial
        </label>
        <textarea
          id="quote"
          value={formData.quote}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, quote: e.target.value }))
          }
          required
          rows={4}
          placeholder="What the member said about White Rose Speakers..."
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-rose-500 focus:border-rose-500"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="author"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Author Name
          </label>
          <input
            type="text"
            id="author"
            value={formData.author}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, author: e.target.value }))
            }
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-rose-500 focus:border-rose-500"
          />
        </div>
        <div>
          <label
            htmlFor="role"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Role / Title (optional)
          </label>
          <input
            type="text"
            id="role"
            value={formData.role}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, role: e.target.value }))
            }
            placeholder="e.g., Club Member, Past President"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-rose-500 focus:border-rose-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Rating
        </label>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setFormData((prev) => ({ ...prev, rating: star }))}
              className="text-2xl focus:outline-none"
            >
              {star <= formData.rating ? (
                <span className="text-yellow-400">&#9733;</span>
              ) : (
                <span className="text-gray-300">&#9733;</span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          id="active"
          checked={formData.active}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, active: e.target.checked }))
          }
          className="h-4 w-4 text-rose-600 focus:ring-rose-500 border-gray-300 rounded"
        />
        <label htmlFor="active" className="ml-2 text-sm text-gray-700">
          Active (visible on public site)
        </label>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 disabled:opacity-50"
        >
          {isSubmitting
            ? "Saving..."
            : isEditing
            ? "Update Testimonial"
            : "Add Testimonial"}
        </button>
      </div>
    </form>
  );
}
