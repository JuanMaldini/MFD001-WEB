import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { isAuthorized } from "./authConfig";
import { buildAuthUrl } from "./authRouting";

interface ProtectedRouteProps {
  children: ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const location = useLocation();

  if (!isAuthorized()) {
    const redirectPath = `${location.pathname}${location.search}${location.hash}`;
    return <Navigate to={buildAuthUrl(redirectPath)} replace />;
  }

  return <>{children}</>;
}
