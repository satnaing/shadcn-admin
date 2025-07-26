import { createFileRoute } from "@tanstack/react-router";
import  WealthIFA  from "@/features/wealth-ifa";
import { ProtectedRoute } from "@/components/ProtectedRoute";

export const Route = createFileRoute("/_authenticated/wealth-ifa/")({
  component: () => (
    <ProtectedRoute requiredService="wealth-ifa">
      <WealthIFA />
    </ProtectedRoute>
  ),
});