"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import EventForm from "@/components/admin/EventForm";
import { useAuth } from "@/lib/auth";
import type { Event } from "@/lib/dynamodb";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function EditEventPage({ params }: PageProps) {
  const { id } = use(params);
  const router = useRouter();
  const { getAccessToken } = useAuth();
  const [event, setEvent] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchEvent() {
      try {
        const token = await getAccessToken();
        if (!token) {
          router.push("/admin/login");
          return;
        }

        const response = await fetch(`/api/admin/events/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
          if (response.status === 404) {
            setError("Event not found");
          } else {
            throw new Error("Failed to fetch event");
          }
          return;
        }

        const data = await response.json();
        setEvent(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setIsLoading(false);
      }
    }

    fetchEvent();
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

  if (!event) return null;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
          Edit Event
        </h1>
        <p className="text-foreground-muted mt-1">
          Update &ldquo;{event.title}&rdquo;
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-md border border-border p-6">
        <EventForm event={event} isEditing />
      </div>
    </div>
  );
}
