import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { isMFD001Authorized } from "./authConfig";

interface ProtectedRouteProps {
  children: ReactNode;
}

export function ProtectedRoute({
  children,
}: ProtectedRouteProps) {
  if (!isMFD001Authorized()) {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
}
