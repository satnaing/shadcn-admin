// src/components/profile-form.tsx
"use client";

import { useGetAllProfileQuery } from "@/features/linkedin-profile/query/profile.query";
import { useProfile } from "@/context/profile.context";

export function ProfileForm() {
  const { data: profiles, isLoading } = useGetAllProfileQuery();
  const { activeProfile } = useProfile();

  if (isLoading) {
    return (
      <div className="flex items-center gap-3 p-4 rounded-lg border">
        <div className="animate-pulse rounded-full h-10 w-10 bg-gray-200"></div>
        <div className="space-y-2">
          <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-3 w-24 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </div>
    );
  }

  if (!profiles || profiles.length === 0 || !activeProfile) {
    return (
      <div className="p-4 rounded-lg border text-center text-sm text-muted-foreground">
        No profile connected
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 p-4 rounded-lg border">
      <div className="bg-primary text-primary-foreground flex aspect-square h-10 w-10 items-center justify-center rounded-full">
        <span className="text-sm font-bold">
          {activeProfile.firstName.charAt(0)}
          {activeProfile.lastName.charAt(0)}
        </span>
      </div>
      <div className="grid flex-1 text-left">
        <span className="font-semibold">
          {activeProfile.firstName} {activeProfile.lastName}
        </span>
        <span className="text-sm text-muted-foreground">
          @{activeProfile.publicIdentifier}
        </span>
      </div>
    </div>
  );
}