"use client";

import TestimonialForm from "@/components/admin/TestimonialForm";

export default function NewTestimonialPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
          Add Testimonial
        </h1>
        <p className="text-foreground-muted mt-1">
          Add a new member testimonial
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-md border border-border p-6">
        <TestimonialForm />
      </div>
    </div>
  );
}
