"use client";

import { useState, useEffect, useCallback } from "react";
import { Save, RefreshCw } from "lucide-react";
import { useAuth } from "@/lib/auth";
import type { SiteSettings } from "@/lib/dynamodb";

const DEFAULT_SETTINGS: SiteSettings = {
  meetingDay: "Tuesday",
  meetingTime: "7:00 PM",
  meetingLocation: "Leeds Civic Hall, Calverley Street, Leeds LS1 1UR",
  nextMeetingDate: "",
  contactEmail: "info@whiterosespeakers.co.uk",
  clubUrl: "https://www.toastmasters.org/Find-a-Club/00007933-white-rose-speakers",
  youtubeVideoId: "dQw4w9WgXcQ",
};

export default function SettingsAdminPage() {
  const { getAccessToken } = useAuth();
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const fetchSettings = useCallback(async () => {
    try {
      const token = await getAccessToken();
      if (!token) return;

      const response = await fetch("/api/admin/settings", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error("Failed to fetch settings");

      const data = await response.json();
      setSettings({ ...DEFAULT_SETTINGS, ...data });
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  }, [getAccessToken]);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setIsSaving(true);

    try {
      const token = await getAccessToken();
      if (!token) throw new Error("Authentication required");

      const response = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(settings),
      });

      if (!response.ok) throw new Error("Failed to save settings");

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save settings");
    } finally {
      setIsSaving(false);
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
      <div className="mb-8">
        <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Settings</h1>
        <p className="text-foreground-muted mt-1">Configure site-wide settings</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-6">
          Settings saved successfully!
        </div>
      )}

      <form onSubmit={handleSave}>
        {/* Meeting Information */}
        <div className="bg-white rounded-xl shadow-md border border-border p-6 mb-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">Meeting Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Meeting Day
              </label>
              <select
                value={settings.meetingDay}
                onChange={(e) => setSettings((prev) => ({ ...prev, meetingDay: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-rose-500 focus:border-rose-500"
              >
                {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => (
                  <option key={day} value={day}>{day}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Meeting Time
              </label>
              <input
                type="text"
                value={settings.meetingTime}
                onChange={(e) => setSettings((prev) => ({ ...prev, meetingTime: e.target.value }))}
                placeholder="e.g., 7:00 PM"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-rose-500 focus:border-rose-500"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Meeting Location
              </label>
              <input
                type="text"
                value={settings.meetingLocation}
                onChange={(e) => setSettings((prev) => ({ ...prev, meetingLocation: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-rose-500 focus:border-rose-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Next Meeting Date
              </label>
              <input
                type="date"
                value={settings.nextMeetingDate}
                onChange={(e) => setSettings((prev) => ({ ...prev, nextMeetingDate: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-rose-500 focus:border-rose-500"
              />
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-white rounded-xl shadow-md border border-border p-6 mb-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">Contact Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contact Email
              </label>
              <input
                type="email"
                value={settings.contactEmail}
                onChange={(e) => setSettings((prev) => ({ ...prev, contactEmail: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-rose-500 focus:border-rose-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Toastmasters Club URL
              </label>
              <input
                type="url"
                value={settings.clubUrl}
                onChange={(e) => setSettings((prev) => ({ ...prev, clubUrl: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-rose-500 focus:border-rose-500"
              />
            </div>
          </div>
        </div>

        {/* Media */}
        <div className="bg-white rounded-xl shadow-md border border-border p-6 mb-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">Media</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              YouTube Video ID (Homepage)
            </label>
            <input
              type="text"
              value={settings.youtubeVideoId}
              onChange={(e) => setSettings((prev) => ({ ...prev, youtubeVideoId: e.target.value }))}
              placeholder="e.g., dQw4w9WgXcQ"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-rose-500 focus:border-rose-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              The video ID is the part after &quot;v=&quot; in a YouTube URL
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={fetchSettings}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Reset
          </button>
          <button
            type="submit"
            disabled={isSaving}
            className="px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 disabled:opacity-50 flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            {isSaving ? "Saving..." : "Save Settings"}
          </button>
        </div>
      </form>
    </div>
  );
}
