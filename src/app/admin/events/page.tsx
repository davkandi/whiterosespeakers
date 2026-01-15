"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Plus, Search, Edit, Trash2, Calendar, MapPin, Clock } from "lucide-react";
import { useAuth } from "@/lib/auth";
import DeleteConfirmModal from "@/components/admin/DeleteConfirmModal";
import type { Event } from "@/lib/dynamodb";

export default function EventsAdminPage() {
  const { getAccessToken } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; event: Event | null }>({
    isOpen: false,
    event: null,
  });
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchEvents = useCallback(async () => {
    try {
      const token = await getAccessToken();
      if (!token) return;

      const response = await fetch("/api/admin/events", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error("Failed to fetch events");

      const data = await response.json();
      setEvents(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  }, [getAccessToken]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const filteredEvents = events.filter((event) =>
    event.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = async () => {
    if (!deleteModal.event) return;
    setIsDeleting(true);

    try {
      const token = await getAccessToken();
      if (!token) throw new Error("Authentication required");

      const response = await fetch(`/api/admin/events/${deleteModal.event.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error("Failed to delete event");

      setEvents(events.filter((e) => e.id !== deleteModal.event?.id));
      setDeleteModal({ isOpen: false, event: null });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete");
    } finally {
      setIsDeleting(false);
    }
  };

  const isPastEvent = (date: string) => new Date(date) < new Date();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-600" />
      </div>
    );
  }

  const upcomingEvents = filteredEvents.filter((e) => !isPastEvent(e.date));
  const pastEvents = filteredEvents.filter((e) => isPastEvent(e.date));

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Events</h1>
          <p className="text-foreground-muted mt-1">Manage your club events and meetings</p>
        </div>
        <Link href="/admin/events/new" className="btn-primary flex items-center gap-2">
          <Plus className="w-5 h-5" />
          New Event
        </Link>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {/* Search */}
      <div className="bg-white rounded-xl shadow-md border border-border p-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground-muted" />
          <input
            type="text"
            placeholder="Search events..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>
      </div>

      {/* Upcoming Events */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-foreground mb-4">Upcoming Events</h2>
        <div className="bg-white rounded-xl shadow-md border border-border overflow-hidden">
          {upcomingEvents.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-foreground-muted">No upcoming events</p>
              <Link
                href="/admin/events/new"
                className="inline-flex items-center gap-2 text-primary mt-4 hover:text-primary-light"
              >
                <Plus className="w-4 h-4" />
                Create an event
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {upcomingEvents.map((event, index) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="p-4 hover:bg-background-secondary transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        {event.featured && (
                          <span className="px-2 py-0.5 rounded text-xs font-medium bg-rose-100 text-rose-700">
                            Featured
                          </span>
                        )}
                      </div>
                      <h3 className="font-bold text-foreground truncate">{event.title}</h3>
                      <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-foreground-muted">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {new Date(event.date).toLocaleDateString()}
                        </span>
                        {event.time && (
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {event.time}
                          </span>
                        )}
                        {event.location && (
                          <span className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {event.location}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/admin/events/${event.id}/edit`}
                        className="p-2 rounded-lg hover:bg-primary/10 text-foreground-muted hover:text-primary transition-colors"
                        title="Edit"
                      >
                        <Edit className="w-5 h-5" />
                      </Link>
                      <button
                        onClick={() => setDeleteModal({ isOpen: true, event })}
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
          )}
        </div>
      </div>

      {/* Past Events */}
      {pastEvents.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-4">Past Events</h2>
          <div className="bg-white rounded-xl shadow-md border border-border overflow-hidden opacity-75">
            <div className="divide-y divide-border">
              {pastEvents.slice(0, 5).map((event, index) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="p-4 hover:bg-background-secondary transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-foreground truncate">{event.title}</h3>
                      <div className="flex items-center gap-4 mt-1 text-sm text-foreground-muted">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {new Date(event.date).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/admin/events/${event.id}/edit`}
                        className="p-2 rounded-lg hover:bg-primary/10 text-foreground-muted hover:text-primary transition-colors"
                        title="Edit"
                      >
                        <Edit className="w-5 h-5" />
                      </Link>
                      <button
                        onClick={() => setDeleteModal({ isOpen: true, event })}
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
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mt-6">
        <div className="bg-white rounded-lg p-4 text-center border border-border">
          <p className="text-2xl font-bold text-green-600">{upcomingEvents.length}</p>
          <p className="text-sm text-foreground-muted">Upcoming</p>
        </div>
        <div className="bg-white rounded-lg p-4 text-center border border-border">
          <p className="text-2xl font-bold text-gray-600">{pastEvents.length}</p>
          <p className="text-sm text-foreground-muted">Past</p>
        </div>
      </div>

      <DeleteConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, event: null })}
        onConfirm={handleDelete}
        title="Delete Event"
        message={`Are you sure you want to delete "${deleteModal.event?.title}"? This action cannot be undone.`}
        isDeleting={isDeleting}
      />
    </div>
  );
}
