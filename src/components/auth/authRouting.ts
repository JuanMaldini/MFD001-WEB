const AUTH_PATH = "/auth";
const DEFAULT_REDIRECT_PATH = "/mfd001";

export function sanitizeRedirectPath(rawPath: string | null | undefined) {
  if (!rawPath) {
    return DEFAULT_REDIRECT_PATH;
  }

  const nextPath = rawPath.trim();

  // Prevent open redirects and auth self-loops.
  if (
    nextPath.length === 0 ||
    !nextPath.startsWith("/") ||
    nextPath.startsWith("//") ||
    nextPath === AUTH_PATH ||
    nextPath.startsWith(`${AUTH_PATH}?`)
  ) {
    return DEFAULT_REDIRECT_PATH;
  }

  return nextPath;
}

export function getRedirectPathFromSearch(search: string) {
  const params = new URLSearchParams(search);
  return sanitizeRedirectPath(params.get("redirect"));
}

export function buildAuthUrl(redirectPath: string) {
  const safeRedirectPath = sanitizeRedirectPath(redirectPath);
  return `${AUTH_PATH}?redirect=${encodeURIComponent(safeRedirectPath)}`;
}
