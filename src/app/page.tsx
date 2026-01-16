"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import {
  Mic,
  Users,
  Award,
  MessageSquare,
  Calendar,
  MapPin,
  ArrowRight,
  Star,
  ChevronRight,
  ChevronLeft,
  Clock,
} from "lucide-react";
import { format } from "date-fns";

const TOASTMASTERS_CLUB_URL = "https://www.toastmasters.org/Find-a-Club/01971684-white-rose-speakers/contact-club?id=8e2c929b-8cd7-ec11-a2fd-005056875f20";

// Hero images - club photos from CloudFront CDN
const heroImages = [
  {
    url: "https://d1onsjo8rd4nrx.cloudfront.net/hero/wrs1.jpeg",
    alt: "White Rose Speakers meeting",
  },
  {
    url: "https://d1onsjo8rd4nrx.cloudfront.net/hero/wrs2.jpeg",
    alt: "White Rose Speakers event",
  },
  {
    url: "https://d1onsjo8rd4nrx.cloudfront.net/hero/wrs3.jpeg",
    alt: "White Rose Speakers members",
  },
];

const services = [
  {
    icon: Mic,
    title: "Public Speaking",
    description:
      "Comprehensive training in public speaking through structured programs and practical workshops.",
  },
  {
    icon: Users,
    title: "Leadership Development",
    description:
      "Develop essential leadership skills through hands-on experience and mentorship.",
  },
  {
    icon: MessageSquare,
    title: "Communication Skills",
    description:
      "Enhance your ability to communicate effectively in any situation.",
  },
  {
    icon: Award,
    title: "Personal Growth",
    description:
      "Transform your confidence and achieve personal growth through supportive practice.",
  },
];

const values = [
  { label: "Integrity", description: "We act with honesty and transparency" },
  { label: "Respect", description: "We value every member's contribution" },
  { label: "Service", description: "We support each other's growth" },
  { label: "Excellence", description: "We strive for continuous improvement" },
];

interface Testimonial {
  id: string;
  quote: string;
  author: string;
  role: string;
  rating: number;
}

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

const defaultTestimonials: Testimonial[] = [
  {
    id: "1",
    quote:
      "Joining White Rose Speakers was the best decision I made for my career. The supportive environment helped me overcome my fear of public speaking.",
    author: "Sarah M.",
    role: "Marketing Manager",
    rating: 5,
  },
  {
    id: "2",
    quote:
      "The skills I've learned here have transformed how I communicate at work and in my personal life. Highly recommended!",
    author: "James T.",
    role: "Software Engineer",
    rating: 5,
  },
  {
    id: "3",
    quote:
      "A welcoming community that genuinely cares about your progress. Every meeting is an opportunity to learn and grow.",
    author: "Priya K.",
    role: "Business Analyst",
    rating: 5,
  },
];

export default function HomePage() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [testimonials, setTestimonials] = useState<Testimonial[]>(defaultTestimonials);
  const [nextEvent, setNextEvent] = useState<Event | null>(null);

  // Fetch testimonials from API
  useEffect(() => {
    async function fetchTestimonials() {
      try {
        const response = await fetch("/api/testimonials");
        if (response.ok) {
          const data = await response.json();
          if (data.length > 0) {
            setTestimonials(data);
          }
        }
      } catch (error) {
        console.error("Error fetching testimonials:", error);
      }
    }
    fetchTestimonials();
  }, []);

  // Fetch next upcoming event from API
  useEffect(() => {
    async function fetchNextEvent() {
      try {
        const response = await fetch("/api/events");
        if (response.ok) {
          const events: Event[] = await response.json();
          // Filter future events and sort by date
          const upcomingEvents = events
            .filter((event) => new Date(event.date) >= new Date())
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
          if (upcomingEvents.length > 0) {
            setNextEvent(upcomingEvents[0]);
          }
        }
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    }
    fetchNextEvent();
  }, []);

  // Auto-advance hero images
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + heroImages.length) % heroImages.length);
  };

  return (
    <div className="overflow-hidden">
      {/* Hero Section with Image Carousel */}
      <section className="relative min-h-screen flex items-center justify-center">
        {/* Background Images - Smooth Crossfade */}
        <div className="absolute inset-0">
          {heroImages.map((image, index) => (
            <motion.div
              key={index}
              initial={false}
              animate={{
                opacity: index === currentImageIndex ? 1 : 0,
                scale: index === currentImageIndex ? 1 : 1.05,
              }}
              transition={{
                opacity: { duration: 1.2, ease: "easeInOut" },
                scale: { duration: 6, ease: "easeOut" },
              }}
              className="absolute inset-0"
              style={{ zIndex: index === currentImageIndex ? 1 : 0 }}
            >
              <Image
                src={image.url}
                alt={image.alt}
                fill
                className="object-cover"
                priority={index === 0}
                quality={85}
                sizes="100vw"
              />
            </motion.div>
          ))}
          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70 z-[2]" />
        </div>

        {/* Image Navigation Arrows */}
        <button
          onClick={prevImage}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-all duration-300 hover:scale-110"
          aria-label="Previous image"
        >
          <ChevronLeft className="w-6 h-6 text-white" />
        </button>
        <button
          onClick={nextImage}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-all duration-300 hover:scale-110"
          aria-label="Next image"
        >
          <ChevronRight className="w-6 h-6 text-white" />
        </button>

        {/* Image Indicators */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex gap-2">
          {heroImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`h-3 rounded-full transition-all duration-500 ease-out ${
                index === currentImageIndex
                  ? "bg-white w-10"
                  : "bg-white/40 w-3 hover:bg-white/60"
              }`}
              aria-label={`Go to image ${index + 1}`}
            />
          ))}
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-4 py-2 bg-accent/30 backdrop-blur-sm text-accent rounded-full text-sm font-medium mb-6">
              Leeds Toastmasters Club
            </span>
          </motion.div>

          <motion.h1
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Empower Your Voice with{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-accent-light">
              White Rose Speakers
            </span>
          </motion.h1>

          <motion.p
            className="text-lg sm:text-xl text-white/90 max-w-3xl mx-auto mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Join our supportive community in Leeds and develop the communication
            and leadership skills that will transform your career and personal life.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <a
              href={TOASTMASTERS_CLUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary text-lg flex items-center gap-2 group"
            >
              Join a Meeting
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>
            <Link
              href="/services"
              className="btn-outline border-white text-white hover:bg-white hover:text-secondary text-lg"
            >
              Explore What We Offer
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Video Section */}
      <section className="py-20 bg-background-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-6">
                See What We&apos;re All About
              </h2>
              <p className="text-foreground-muted text-lg mb-6">
                Watch our introduction video to learn more about how White Rose
                Speakers can help you develop your communication and leadership skills.
              </p>
              <div className="space-y-4">
                {values.map((value) => (
                  <div key={value.label} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                      <ChevronRight className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <span className="font-semibold text-foreground">
                        {value.label}:
                      </span>{" "}
                      <span className="text-foreground-muted">
                        {value.description}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="aspect-video rounded-2xl overflow-hidden shadow-2xl bg-secondary-dark">
                <iframe
                  src="https://www.youtube.com/embed/Nt6iyS-WBPs"
                  title="White Rose Speakers Introduction"
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
              {/* Decorative Elements */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-accent/20 rounded-full blur-2xl" />
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-primary/20 rounded-full blur-2xl" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Meeting Info Section */}
      <section className="py-20 bg-gradient-to-br from-secondary via-secondary-dark to-secondary overflow-hidden relative">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 rose-pattern" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <span className="inline-block px-4 py-2 bg-accent/30 text-accent rounded-full text-sm font-medium mb-6">
              Hybrid: In-Person & Online via Zoom
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Join Our Next Meeting
            </h2>
            <p className="text-white/80 text-lg max-w-2xl mx-auto">
              Visitors are always welcome! Experience a Toastmasters meeting and discover how we can help you grow.
            </p>
          </motion.div>

          {/* Two Column Layout: Event Details + Map */}
          <div className="grid lg:grid-cols-2 gap-8 items-stretch">
            {/* Left Column - Event Details */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-white rounded-3xl p-8 shadow-2xl flex flex-col"
            >
              {nextEvent ? (
                <>
                  {/* Event Header with Date */}
                  <div className="flex items-start gap-6 mb-6">
                    <div className="bg-gradient-to-br from-primary to-primary-dark rounded-2xl p-4 text-center text-white shadow-lg shrink-0">
                      <p className="text-xs font-medium uppercase tracking-wide opacity-90">
                        {format(new Date(nextEvent.date), "EEEE")}
                      </p>
                      <p className="text-4xl font-bold my-1">
                        {format(new Date(nextEvent.date), "d")}
                      </p>
                      <p className="text-sm font-semibold">
                        {format(new Date(nextEvent.date), "MMMM")}
                      </p>
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                          {nextEvent.type === "meeting" ? "Regular Meeting" : nextEvent.type === "special" ? "Special Event" : "Workshop"}
                        </span>
                        <span className="px-3 py-1 bg-accent/20 text-accent rounded-full text-xs font-semibold">
                          Guests Welcome
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-foreground">
                        {nextEvent.title}
                      </h3>
                      {nextEvent.description && (
                        <p className="text-foreground-muted text-sm mt-1 line-clamp-2">
                          {nextEvent.description}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Event Details */}
                  <div className="space-y-4 flex-1">
                    <div className="flex items-center gap-4 p-3 bg-primary/5 rounded-xl">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Clock className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-xs text-foreground-muted uppercase tracking-wide">Time</p>
                        <p className="font-bold text-foreground">{nextEvent.time}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 p-3 bg-secondary/5 rounded-xl">
                      <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center">
                        <MapPin className="w-5 h-5 text-secondary" />
                      </div>
                      <div>
                        <p className="text-xs text-foreground-muted uppercase tracking-wide">Location</p>
                        <p className="font-bold text-foreground">{nextEvent.location}</p>
                        <p className="text-sm text-primary font-medium">or join via Zoom</p>
                      </div>
                    </div>
                  </div>

                  {/* CTA Button */}
                  <a
                    href={nextEvent.registrationUrl || TOASTMASTERS_CLUB_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-6 w-full btn-primary inline-flex items-center justify-center gap-2"
                  >
                    Register Your Visit
                    <ArrowRight className="w-5 h-5" />
                  </a>
                </>
              ) : (
                <>
                  {/* Fallback when no event */}
                  <div className="flex-1 flex flex-col justify-center">
                    <div className="text-center mb-6">
                      <Calendar className="w-16 h-16 mx-auto text-primary/30 mb-4" />
                      <h3 className="text-xl font-bold text-foreground mb-2">
                        Regular Meetings
                      </h3>
                      <p className="text-foreground-muted">
                        We meet every 2nd and 4th Wednesday of the month
                      </p>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center gap-4 p-3 bg-primary/5 rounded-xl">
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                          <Clock className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-xs text-foreground-muted uppercase tracking-wide">Time</p>
                          <p className="font-bold text-foreground">6:45pm for 7:00pm start</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 p-3 bg-secondary/5 rounded-xl">
                        <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center">
                          <MapPin className="w-5 h-5 text-secondary" />
                        </div>
                        <div>
                          <p className="text-xs text-foreground-muted uppercase tracking-wide">Location</p>
                          <p className="font-bold text-foreground">Leonardo Hotel, Leeds</p>
                          <p className="text-sm text-primary font-medium">or join via Zoom</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <a
                    href={TOASTMASTERS_CLUB_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-6 w-full btn-primary inline-flex items-center justify-center gap-2"
                  >
                    Register Your Visit
                    <ArrowRight className="w-5 h-5" />
                  </a>
                </>
              )}
            </motion.div>

            {/* Right Column - Map & Info */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="flex flex-col gap-6"
            >
              {/* Map */}
              <div className="flex-1 rounded-3xl overflow-hidden shadow-2xl min-h-[300px]">
                <iframe
                  src="https://www.google.com/maps?q=Leonardo+Hotel+Leeds,Brewery+Wharf,Brewery+Place,Leeds+LS10+1NE&output=embed"
                  width="100%"
                  height="100%"
                  style={{ border: 0, minHeight: "300px" }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Leonardo Hotel Leeds Location"
                />
              </div>

              {/* Meeting Features */}
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                <h4 className="text-white font-semibold mb-4">What to Expect</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-2 text-white/80 text-sm">
                    <div className="w-2 h-2 bg-accent rounded-full"></div>
                    <span>Prepared Speeches</span>
                  </div>
                  <div className="flex items-center gap-2 text-white/80 text-sm">
                    <div className="w-2 h-2 bg-accent rounded-full"></div>
                    <span>Table Topics</span>
                  </div>
                  <div className="flex items-center gap-2 text-white/80 text-sm">
                    <div className="w-2 h-2 bg-accent rounded-full"></div>
                    <span>Evaluations</span>
                  </div>
                  <div className="flex items-center gap-2 text-white/80 text-sm">
                    <div className="w-2 h-2 bg-accent rounded-full"></div>
                    <span>Networking</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-background-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              What We Offer
            </h2>
            <p className="text-foreground-muted text-lg max-w-2xl mx-auto">
              Our meetings provide a supportive environment where you can develop
              essential skills for personal and professional success.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-lg border border-border hover:shadow-xl transition-shadow group"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-primary to-primary-light rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <service.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">
                  {service.title}
                </h3>
                <p className="text-foreground-muted text-sm">
                  {service.description}
                </p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center mt-10"
          >
            <Link
              href="/services"
              className="inline-flex items-center gap-2 text-primary font-semibold hover:gap-3 transition-all"
            >
              Learn more about what we offer
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              What Our Members Say
            </h2>
            <p className="text-foreground-muted text-lg max-w-2xl mx-auto">
              Hear from our community members about their experiences with White
              Rose Speakers.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.slice(0, 3).map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-2xl p-8 shadow-lg border border-border"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating || 5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 fill-accent text-accent"
                    />
                  ))}
                </div>
                <p className="text-foreground-muted mb-6 italic">
                  &ldquo;{testimonial.quote}&rdquo;
                </p>
                <div>
                  <p className="font-bold text-foreground">
                    {testimonial.author}
                  </p>
                  <p className="text-sm text-foreground-muted">
                    {testimonial.role}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

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
              Ready to Transform Your Communication Skills?
            </h2>
            <p className="text-white/80 text-lg max-w-2xl mx-auto mb-8">
              Join White Rose Speakers Leeds and start your journey towards
              becoming a confident speaker and effective leader.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href={TOASTMASTERS_CLUB_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white text-primary px-8 py-4 rounded-lg font-semibold hover:bg-white/90 transition-colors flex items-center gap-2"
              >
                Visit as a Guest
                <ArrowRight className="w-5 h-5" />
              </a>
              <Link
                href="/contact"
                className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-primary transition-colors"
              >
                Contact Us
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
