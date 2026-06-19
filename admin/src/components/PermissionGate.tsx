"use client";

import { useAuth } from "@/providers/auth-provider";
import type { ReactNode } from "react";

interface PermissionGateProps {
  permission?: string;
  role?: string | string[];
  children: ReactNode;
  fallback?: ReactNode;
}

export default function PermissionGate({
  permission,
  role,
  children,
  fallback = null,
}: PermissionGateProps) {
  const { hasPermission, hasRole, user } = useAuth();

  if (!user) return fallback;

  if (permission && !hasPermission(permission)) return fallback;
  if (role && !hasRole(...(Array.isArray(role) ? role : [role]))) return fallback;

  return <>{children}</>;
}
