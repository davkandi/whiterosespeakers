"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Plus, Trash2, Upload, X, FolderOpen } from "lucide-react";
import { useAuth } from "@/lib/auth";
import DeleteConfirmModal from "@/components/admin/DeleteConfirmModal";
import type { GalleryImage } from "@/lib/dynamodb";

const CATEGORIES = [
  { id: "meetings", label: "Meetings" },
  { id: "events", label: "Events" },
  { id: "members", label: "Members" },
  { id: "achievements", label: "Achievements" },
];

export default function GalleryAdminPage() {
  const { getAccessToken } = useAuth();
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadCategory, setUploadCategory] = useState("meetings");
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; image: GalleryImage | null }>({
    isOpen: false,
    image: null,
  });
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchImages = useCallback(async () => {
    try {
      const token = await getAccessToken();
      if (!token) return;

      const url = selectedCategory === "all"
        ? "/api/admin/gallery"
        : `/api/admin/gallery?category=${selectedCategory}`;

      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error("Failed to fetch images");

      const data = await response.json();
      setImages(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  }, [getAccessToken, selectedCategory]);

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    setError(null);

    try {
      const token = await getAccessToken();
      if (!token) throw new Error("Authentication required");

      for (const file of Array.from(files)) {
        // Get presigned upload URL
        const params = new URLSearchParams({
          filename: file.name,
          contentType: file.type,
          folder: `gallery/${uploadCategory}`,
        });

        const uploadUrlResponse = await fetch(`/api/admin/upload?${params.toString()}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!uploadUrlResponse.ok) throw new Error("Failed to get upload URL");

        const { uploadUrl, key } = await uploadUrlResponse.json();

        // Upload to S3
        const uploadResponse = await fetch(uploadUrl, {
          method: "PUT",
          body: file,
          headers: { "Content-Type": file.type },
        });

        if (!uploadResponse.ok) throw new Error("Failed to upload file");

        // Save to DynamoDB
        const saveResponse = await fetch("/api/admin/gallery", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            s3Key: key,
            category: uploadCategory,
            title: file.name.replace(/\.[^/.]+$/, ""),
          }),
        });

        if (!saveResponse.ok) throw new Error("Failed to save image");
      }

      setShowUploadModal(false);
      fetchImages();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteModal.image) return;
    setIsDeleting(true);

    try {
      const token = await getAccessToken();
      if (!token) throw new Error("Authentication required");

      const response = await fetch(
        `/api/admin/gallery/${deleteModal.image.id}?category=${deleteModal.image.category}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!response.ok) throw new Error("Failed to delete image");

      setImages(images.filter((img) => img.id !== deleteModal.image?.id));
      setDeleteModal({ isOpen: false, image: null });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete");
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-600" />
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Gallery</h1>
          <p className="text-foreground-muted mt-1">Manage your photo gallery</p>
        </div>
        <button
          onClick={() => setShowUploadModal(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Upload className="w-5 h-5" />
          Upload Images
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {/* Category Filter */}
      <div className="bg-white rounded-xl shadow-md border border-border p-4 mb-6">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategory("all")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedCategory === "all"
                ? "bg-primary text-white"
                : "bg-background-secondary text-foreground-muted hover:bg-primary/10"
            }`}
          >
            All
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedCategory === cat.id
                  ? "bg-primary text-white"
                  : "bg-background-secondary text-foreground-muted hover:bg-primary/10"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Gallery Grid */}
      {images.length === 0 ? (
        <div className="bg-white rounded-xl shadow-md border border-border p-12 text-center">
          <FolderOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-foreground-muted">No images found</p>
          <button
            onClick={() => setShowUploadModal(true)}
            className="inline-flex items-center gap-2 text-primary mt-4 hover:text-primary-light"
          >
            <Plus className="w-4 h-4" />
            Upload your first image
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image, index) => (
            <motion.div
              key={image.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              className="relative group aspect-square rounded-lg overflow-hidden bg-gray-100"
            >
              <Image
                src={`https://${process.env.NEXT_PUBLIC_S3_BUCKET}.s3.${process.env.NEXT_PUBLIC_AWS_REGION}.amazonaws.com/${image.s3Key}`}
                alt={image.title || "Gallery image"}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button
                  onClick={() => setDeleteModal({ isOpen: true, image })}
                  className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/70 to-transparent">
                <span className="text-xs text-white/80 capitalize">{image.category}</span>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75" onClick={() => setShowUploadModal(false)} />
            <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Upload Images</h3>
                <button onClick={() => setShowUploadModal(false)} className="text-gray-400 hover:text-gray-600">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  value={uploadCategory}
                  onChange={(e) => setUploadCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-rose-500 focus:border-rose-500"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.label}</option>
                  ))}
                </select>
              </div>

              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                {isUploading ? (
                  <div className="flex flex-col items-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-600 mb-2" />
                    <p className="text-sm text-gray-600">Uploading...</p>
                  </div>
                ) : (
                  <>
                    <Upload className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                    <label className="cursor-pointer">
                      <span className="text-rose-600 hover:text-rose-500 font-medium">
                        Choose files
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        onChange={handleFileUpload}
                      />
                    </label>
                    <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF up to 5MB each</p>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <DeleteConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, image: null })}
        onConfirm={handleDelete}
        title="Delete Image"
        message="Are you sure you want to delete this image? This action cannot be undone."
        isDeleting={isDeleting}
      />
    </div>
  );
}
