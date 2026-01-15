"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import TestimonialForm from "@/components/admin/TestimonialForm";
import { useAuth } from "@/lib/auth";
import type { Testimonial } from "@/lib/dynamodb";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function EditTestimonialPage({ params }: PageProps) {
  const { id } = use(params);
  const router = useRouter();
  const { getAccessToken } = useAuth();
  const [testimonial, setTestimonial] = useState<Testimonial | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTestimonial() {
      try {
        const token = await getAccessToken();
        if (!token) {
          router.push("/admin/login");
          return;
        }

        const response = await fetch(`/api/admin/testimonials/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
          if (response.status === 404) {
            setError("Testimonial not found");
          } else {
            throw new Error("Failed to fetch testimonial");
          }
          return;
        }

        const data = await response.json();
        setTestimonial(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setIsLoading(false);
      }
    }

    fetchTestimonial();
  }, [id, getAccessToken, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
        {error}
      </div>
    );
  }

  if (!testimonial) return null;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
          Edit Testimonial
        </h1>
        <p className="text-foreground-muted mt-1">
          Update testimonial from {testimonial.author}
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-md border border-border p-6">
        <TestimonialForm testimonial={testimonial} isEditing />
      </div>
    </div>
  );
}
