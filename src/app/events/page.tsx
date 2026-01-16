"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Calendar,
  Clock,
  MapPin,
  ChevronLeft,
  ChevronRight,
  Users,
  Loader2,
} from "lucide-react";
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, isSameDay } from "date-fns";

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  type: "meeting" | "special" | "workshop";
  featured?: boolean;
  image?: string;
  registrationUrl?: string;
}

const eventTypes = {
  meeting: { label: "Regular Meeting", color: "bg-primary" },
  special: { label: "Special Event", color: "bg-accent" },
  workshop: { label: "Workshop", color: "bg-secondary" },
};

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  useEffect(() => {
    async function fetchEvents() {
      try {
        const response = await fetch("/api/events");
        if (response.ok) {
          const data = await response.json();
          setEvents(data);
        }
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchEvents();
  }, []);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Get the day of week the month starts on (0 = Sunday)
  const startDay = monthStart.getDay();
  const paddingDays = startDay === 0 ? 6 : startDay - 1; // Adjust for Monday start

  const getEventsForDate = (date: Date) => {
    return events.filter((event) => isSameDay(new Date(event.date), date));
  };

  const upcomingEvents = events
    .filter((event) => new Date(event.date) >= new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 5);

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
              Events Calendar
            </span>
            <h1 className="text-4xl sm:text-5xl font-bold mb-6">
              Upcoming Events
            </h1>
            <p className="text-lg text-white/80">
              Join us for regular meetings, workshops, and special events. Guests
              are always welcome!
            </p>
          </motion.div>
        </div>
      </section>

      {/* Loading State */}
      {loading && (
        <section className="py-20 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
            <p className="mt-4 text-foreground-muted">Loading events...</p>
          </div>
        </section>
      )}

      {/* Calendar and Events */}
      {!loading && (
        <section className="py-16 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-[1fr_400px] gap-12">
              {/* Calendar */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="bg-white rounded-2xl p-6 shadow-lg border border-border"
              >
                {/* Calendar Header */}
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-foreground">
                    {format(currentMonth, "MMMM yyyy")}
                  </h2>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
                      className="p-2 rounded-lg hover:bg-primary/10 transition-colors"
                    >
                      <ChevronLeft className="w-5 h-5 text-foreground" />
                    </button>
                    <button
                      onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                      className="p-2 rounded-lg hover:bg-primary/10 transition-colors"
                    >
                      <ChevronRight className="w-5 h-5 text-foreground" />
                    </button>
                  </div>
                </div>

                {/* Day Headers */}
                <div className="grid grid-cols-7 gap-1 mb-2">
                  {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
                    <div
                      key={day}
                      className="text-center text-sm font-medium text-foreground-muted py-2"
                    >
                      {day}
                    </div>
                  ))}
                </div>

                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-1">
                  {/* Padding for days before month start */}
                  {Array.from({ length: paddingDays }).map((_, i) => (
                    <div key={`pad-${i}`} className="aspect-square" />
                  ))}

                  {/* Days of the month */}
                  {daysInMonth.map((day) => {
                    const dayEvents = getEventsForDate(day);
                    const isSelected = selectedDate && isSameDay(day, selectedDate);

                    return (
                      <button
                        key={day.toISOString()}
                        onClick={() => setSelectedDate(day)}
                        className={`aspect-square rounded-lg flex flex-col items-center justify-center relative transition-all ${
                          isToday(day)
                            ? "bg-primary text-white"
                            : isSelected
                            ? "bg-primary/20 text-primary"
                            : "hover:bg-primary/10"
                        }`}
                      >
                        <span
                          className={`text-sm ${
                            !isSameMonth(day, currentMonth)
                              ? "text-foreground-muted/50"
                              : ""
                          }`}
                        >
                          {format(day, "d")}
                        </span>
                        {dayEvents.length > 0 && (
                          <div className="flex gap-0.5 mt-1">
                            {dayEvents.slice(0, 3).map((event, i) => (
                              <div
                                key={i}
                                className={`w-1.5 h-1.5 rounded-full ${
                                  eventTypes[event.type]?.color || "bg-primary"
                                }`}
                              />
                            ))}
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Legend */}
                <div className="flex gap-4 mt-6 pt-6 border-t border-border">
                  {Object.entries(eventTypes).map(([key, value]) => (
                    <div key={key} className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${value.color}`} />
                      <span className="text-sm text-foreground-muted">
                        {value.label}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Upcoming Events */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="text-xl font-bold text-foreground mb-6">
                  Upcoming Events
                </h2>

                {upcomingEvents.length === 0 ? (
                  <div className="bg-white rounded-xl p-6 shadow-md border border-border text-center">
                    <Calendar className="w-12 h-12 mx-auto text-foreground-muted mb-4" />
                    <p className="text-foreground-muted">
                      No upcoming events scheduled. Check back soon!
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {upcomingEvents.map((event) => (
                      <div
                        key={event.id}
                        className="bg-white rounded-xl p-4 shadow-md border border-border"
                      >
                        <div className="flex items-start gap-4">
                          <div
                            className={`w-12 h-12 ${
                              eventTypes[event.type]?.color || "bg-primary"
                            } rounded-lg flex items-center justify-center text-white shrink-0`}
                          >
                            <Calendar className="w-6 h-6" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <span
                              className={`inline-block px-2 py-0.5 ${
                                eventTypes[event.type]?.color || "bg-primary"
                              } text-white rounded text-xs font-medium mb-1`}
                            >
                              {eventTypes[event.type]?.label || "Event"}
                            </span>
                            <h3 className="font-bold text-foreground truncate">
                              {event.title}
                            </h3>
                            <div className="flex flex-col gap-1 mt-2 text-sm text-foreground-muted">
                              <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                {format(new Date(event.date), "EEEE, d MMMM yyyy")}
                              </div>
                              <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4" />
                                {event.time}
                              </div>
                              <div className="flex items-center gap-2">
                                <MapPin className="w-4 h-4" />
                                {event.location}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Meeting Info Card */}
                <div className="mt-8 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-xl p-6">
                  <h3 className="font-bold text-foreground mb-2">
                    Regular Meetings
                  </h3>
                  <span className="inline-block px-2 py-1 bg-accent/20 text-accent text-xs font-medium rounded mb-3">
                    Hybrid: In-Person & Online
                  </span>
                  <p className="text-foreground-muted text-sm mb-4">
                    We meet on the 2nd and 4th Wednesday of each month at 6:45pm
                    for 7:00pm start. Join us at Leonardo Hotel, Leeds or online via Zoom.
                  </p>
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="w-4 h-4 text-primary" />
                    <span className="text-foreground-muted">
                      Guests always welcome!
                    </span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary to-primary-dark text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">
              Join Us at Our Next Meeting
            </h2>
            <p className="text-white/80 text-lg max-w-2xl mx-auto mb-8">
              Experience a Toastmasters meeting for yourself. Register your visit
              today!
            </p>
            <a
              href="https://www.toastmasters.org/Find-a-Club/01971684-white-rose-speakers/contact-club?id=8e2c929b-8cd7-ec11-a2fd-005056875f20"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white text-primary px-8 py-4 rounded-lg font-semibold hover:bg-white/90 transition-colors inline-block"
            >
              Register Your Visit
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
