"use client";

import EventForm from "@/components/admin/EventForm";

export default function NewEventPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
          Create New Event
        </h1>
        <p className="text-foreground-muted mt-1">
          Add a new event or meeting
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-md border border-border p-6">
        <EventForm />
      </div>
    </div>
  );
}
