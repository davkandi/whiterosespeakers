"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight, ZoomIn, Loader2, ImageIcon } from "lucide-react";

interface GalleryImage {
  id: string;
  category: string;
  title: string;
  description: string;
  s3Key: string;
  url: string;
  uploadedAt: string;
}

export default function GalleryPage() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [lightboxImage, setLightboxImage] = useState<GalleryImage | null>(null);

  useEffect(() => {
    async function fetchGallery() {
      try {
        const response = await fetch("/api/gallery");
        if (response.ok) {
          const data = await response.json();
          setImages(data);
        }
      } catch (error) {
        console.error("Error fetching gallery:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchGallery();
  }, []);

  // Get unique categories from images
  const categories = ["All", ...new Set(images.map((img) => img.category).filter(Boolean))];

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

      {/* Loading State */}
      {loading && (
        <section className="py-20 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
            <p className="mt-4 text-foreground-muted">Loading gallery...</p>
          </div>
        </section>
      )}

      {/* Empty State */}
      {!loading && images.length === 0 && (
        <section className="py-20 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <ImageIcon className="w-12 h-12 mx-auto text-foreground-muted mb-4" />
            <h2 className="text-2xl font-bold text-foreground mb-4">Gallery Coming Soon</h2>
            <p className="text-foreground-muted">
              We&apos;re working on adding photos of our club meetings and events.
              Check back soon!
            </p>
          </div>
        </section>
      )}

      {/* Gallery */}
      {!loading && images.length > 0 && (
        <section className="py-16 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Category Filter */}
            {categories.length > 1 && (
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
            )}

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
                    src={image.url}
                    alt="Gallery image"
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="absolute top-4 right-4">
                      <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                        <ZoomIn className="w-5 h-5 text-white" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* No Images in Category */}
            {filteredImages.length === 0 && (
              <div className="text-center py-12">
                <p className="text-foreground-muted">
                  No images found in this category.
                </p>
              </div>
            )}
          </div>
        </section>
      )}

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
            {filteredImages.length > 1 && (
              <>
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
              </>
            )}

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
                  src={lightboxImage.url}
                  alt="Gallery image"
                  fill
                  className="object-contain"
                />
              </div>
            </motion.div>

            {/* Counter */}
            {filteredImages.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/70 text-sm">
                {lightboxIndex + 1} / {filteredImages.length}
              </div>
            )}
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
