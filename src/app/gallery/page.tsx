"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";

// Gallery images from White Rose Speakers
const images = [
  {
    id: "1",
    src: "https://cdn.lindoai.com/c/recNxZpB13uzSjqpH/images/83153514.jpg",
    title: "Club Meeting",
    category: "Meetings",
    description: "Members gathered for a regular meeting at Leonardo Hotel",
  },
  {
    id: "2",
    src: "https://cdn.lindoai.com/c/recNxZpB13uzSjqpH/images/33005501.jpg",
    title: "Member Presentation",
    category: "Speeches",
    description: "A member delivering their prepared speech to the club",
  },
  {
    id: "3",
    src: "https://cdn.lindoai.com/c/recNxZpB13uzSjqpH/images/94363180.jpg",
    title: "Club Event",
    category: "Events",
    description: "Special club event with members and guests",
  },
  {
    id: "4",
    src: "https://cdn.lindoai.com/c/recNxZpB13uzSjqpH/images/47671624.jpg",
    title: "Speaker at Podium",
    category: "Speeches",
    description: "Confident delivery during a club meeting",
  },
  {
    id: "5",
    src: "https://cdn.lindoai.com/c/recNxZpB13uzSjqpH/images/55473831.jpg",
    title: "Group Discussion",
    category: "Meetings",
    description: "Members engaging in group discussion and feedback",
  },
  {
    id: "6",
    src: "https://cdn.lindoai.com/c/recNxZpB13uzSjqpH/images/10404643.jpg",
    title: "Award Ceremony",
    category: "Awards",
    description: "Recognizing member achievements and milestones",
  },
];

const categories = ["All", "Meetings", "Speeches", "Events", "Awards"];

export default function GalleryPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [lightboxImage, setLightboxImage] = useState<typeof images[0] | null>(null);

  const filteredImages =
    selectedCategory === "All"
      ? images
      : images.filter((img) => img.category === selectedCategory);

  const lightboxIndex = lightboxImage
    ? filteredImages.findIndex((img) => img.id === lightboxImage.id)
    : -1;

  const navigateLightbox = (direction: "prev" | "next") => {
    if (lightboxIndex === -1) return;
    const newIndex =
      direction === "prev"
        ? (lightboxIndex - 1 + filteredImages.length) % filteredImages.length
        : (lightboxIndex + 1) % filteredImages.length;
    setLightboxImage(filteredImages[newIndex]);
  };

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
              Photo Gallery
            </span>
            <h1 className="text-4xl sm:text-5xl font-bold mb-6">
              Memories & Moments
            </h1>
            <p className="text-lg text-white/80">
              A glimpse into our meetings, events, and the wonderful community of
              White Rose Speakers Leeds.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Gallery */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Category Filter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-wrap gap-2 mb-12 justify-center"
          >
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  category === selectedCategory
                    ? "bg-primary text-white"
                    : "bg-white text-foreground-muted hover:bg-primary/10 hover:text-primary border border-border"
                }`}
              >
                {category}
              </button>
            ))}
          </motion.div>

          {/* Image Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {filteredImages.map((image, index) => (
              <motion.div
                key={image.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="group relative aspect-[4/3] rounded-xl overflow-hidden cursor-pointer shadow-lg"
                onClick={() => setLightboxImage(image)}
              >
                <Image
                  src={image.src}
                  alt={image.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="text-white font-bold text-sm">
                      {image.title}
                    </h3>
                    <p className="text-white/70 text-xs">{image.category}</p>
                  </div>
                  <div className="absolute top-4 right-4">
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                      <ZoomIn className="w-5 h-5 text-white" />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* No Images Message */}
          {filteredImages.length === 0 && (
            <div className="text-center py-12">
              <p className="text-foreground-muted">
                No images found in this category.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
            onClick={() => setLightboxImage(null)}
          >
            {/* Close Button */}
            <button
              className="absolute top-4 right-4 z-10 p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
              onClick={() => setLightboxImage(null)}
            >
              <X className="w-6 h-6 text-white" />
            </button>

            {/* Navigation */}
            <button
              className="absolute left-4 p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                navigateLightbox("prev");
              }}
            >
              <ChevronLeft className="w-6 h-6 text-white" />
            </button>
            <button
              className="absolute right-4 p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                navigateLightbox("next");
              }}
            >
              <ChevronRight className="w-6 h-6 text-white" />
            </button>

            {/* Image */}
            <motion.div
              key={lightboxImage.id}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="max-w-4xl max-h-[80vh] w-full mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative aspect-[4/3] rounded-lg overflow-hidden">
                <Image
                  src={lightboxImage.src}
                  alt={lightboxImage.title}
                  fill
                  className="object-contain"
                />
              </div>
              <div className="mt-4 text-center">
                <h3 className="text-white font-bold text-xl">
                  {lightboxImage.title}
                </h3>
                <p className="text-white/70">{lightboxImage.description}</p>
              </div>
            </motion.div>

            {/* Counter */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/70 text-sm">
              {lightboxIndex + 1} / {filteredImages.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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
              Be Part of Our Story
            </h2>
            <p className="text-white/80 text-lg max-w-2xl mx-auto mb-8">
              Join White Rose Speakers and create your own memorable moments on
              your journey to becoming a confident speaker.
            </p>
            <a
              href="https://www.toastmasters.org/Find-a-Club/01971684-white-rose-speakers/contact-club?id=8e2c929b-8cd7-ec11-a2fd-005056875f20"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white text-primary px-8 py-4 rounded-lg font-semibold hover:bg-white/90 transition-colors inline-block"
            >
              Visit as a Guest
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
