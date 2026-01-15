"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Plus, Edit, Trash2, User, GripVertical } from "lucide-react";
import { useAuth } from "@/lib/auth";
import DeleteConfirmModal from "@/components/admin/DeleteConfirmModal";
import type { TeamMember } from "@/lib/dynamodb";

export default function TeamAdminPage() {
  const { getAccessToken } = useAuth();
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; member: TeamMember | null }>({
    isOpen: false,
    member: null,
  });
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchMembers = useCallback(async () => {
    try {
      const token = await getAccessToken();
      if (!token) return;

      const response = await fetch("/api/admin/team", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error("Failed to fetch team members");

      const data = await response.json();
      setMembers(data.sort((a: TeamMember, b: TeamMember) => a.order - b.order));
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  }, [getAccessToken]);

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  const handleDelete = async () => {
    if (!deleteModal.member) return;
    setIsDeleting(true);

    try {
      const token = await getAccessToken();
      if (!token) throw new Error("Authentication required");

      const response = await fetch(`/api/admin/team/${deleteModal.member.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error("Failed to delete team member");

      setMembers(members.filter((m) => m.id !== deleteModal.member?.id));
      setDeleteModal({ isOpen: false, member: null });
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

  const activeMembers = members.filter((m) => m.active);
  const inactiveMembers = members.filter((m) => !m.active);

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Team</h1>
          <p className="text-foreground-muted mt-1">Manage your leadership team</p>
        </div>
        <Link href="/admin/team/new" className="btn-primary flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Add Member
        </Link>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {/* Active Members */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-foreground mb-4">Active Members ({activeMembers.length})</h2>
        <div className="bg-white rounded-xl shadow-md border border-border overflow-hidden">
          {activeMembers.length === 0 ? (
            <div className="p-12 text-center">
              <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-foreground-muted">No active team members</p>
              <Link
                href="/admin/team/new"
                className="inline-flex items-center gap-2 text-primary mt-4 hover:text-primary-light"
              >
                <Plus className="w-4 h-4" />
                Add your first team member
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {activeMembers.map((member, index) => (
                <motion.div
                  key={member.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="p-4 hover:bg-background-secondary transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <GripVertical className="w-5 h-5 text-gray-400 cursor-grab" />
                    <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
                      {member.image ? (
                        <Image src={member.image} alt={member.name} fill className="object-cover" />
                      ) : (
                        <User className="w-6 h-6 text-gray-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-foreground truncate">{member.name}</h3>
                      <p className="text-sm text-foreground-muted">{member.role}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/admin/team/${member.id}/edit`}
                        className="p-2 rounded-lg hover:bg-primary/10 text-foreground-muted hover:text-primary transition-colors"
                        title="Edit"
                      >
                        <Edit className="w-5 h-5" />
                      </Link>
                      <button
                        onClick={() => setDeleteModal({ isOpen: true, member })}
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

      {/* Inactive Members */}
      {inactiveMembers.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-4">Inactive Members ({inactiveMembers.length})</h2>
          <div className="bg-white rounded-xl shadow-md border border-border overflow-hidden opacity-75">
            <div className="divide-y divide-border">
              {inactiveMembers.map((member, index) => (
                <motion.div
                  key={member.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="p-4 hover:bg-background-secondary transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-5" />
                    <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
                      {member.image ? (
                        <Image src={member.image} alt={member.name} fill className="object-cover" />
                      ) : (
                        <User className="w-6 h-6 text-gray-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-foreground truncate">{member.name}</h3>
                      <p className="text-sm text-foreground-muted">{member.role}</p>
                    </div>
                    <span className="px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600">
                      Inactive
                    </span>
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/admin/team/${member.id}/edit`}
                        className="p-2 rounded-lg hover:bg-primary/10 text-foreground-muted hover:text-primary transition-colors"
                        title="Edit"
                      >
                        <Edit className="w-5 h-5" />
                      </Link>
                      <button
                        onClick={() => setDeleteModal({ isOpen: true, member })}
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

      <DeleteConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, member: null })}
        onConfirm={handleDelete}
        title="Delete Team Member"
        message={`Are you sure you want to delete "${deleteModal.member?.name}"? This action cannot be undone.`}
        isDeleting={isDeleting}
      />
    </div>
  );
}
