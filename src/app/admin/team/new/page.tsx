"use client";

import TeamMemberForm from "@/components/admin/TeamMemberForm";

export default function NewTeamMemberPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
          Add Team Member
        </h1>
        <p className="text-foreground-muted mt-1">
          Add a new member to the leadership team
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-md border border-border p-6">
        <TeamMemberForm />
      </div>
    </div>
  );
}
