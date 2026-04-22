export const AUTH_SESSION_KEY = "app-auth";
const LEGACY_AUTH_SESSION_KEY = "mfd001-auth";

function normalizeAccessKey(value: string | undefined) {
  return (value ?? "").trim().toLowerCase();
}

const configuredAccessKey = normalizeAccessKey(
  import.meta.env.VITE_AUTH_ACCESS_KEY as string | undefined,
);

function getSessionStore() {
  if (typeof window === "undefined") {
    return null;
  }

  return window.sessionStorage;
}

export function isAuthAccessKeyConfigured() {
  return configuredAccessKey.length > 0;
}

export function isAuthorized() {
  const store = getSessionStore();
  if (!store) {
    return false;
  }

  return (
    store.getItem(AUTH_SESSION_KEY) === "1" ||
    store.getItem(LEGACY_AUTH_SESSION_KEY) === "1"
  );
}

export function setAuthorized(isAuthorized: boolean) {
  const store = getSessionStore();
  if (!store) {
    return;
  }

  if (isAuthorized) {
    store.setItem(AUTH_SESSION_KEY, "1");
    store.removeItem(LEGACY_AUTH_SESSION_KEY);
    return;
  }

  store.removeItem(AUTH_SESSION_KEY);
  store.removeItem(LEGACY_AUTH_SESSION_KEY);
}

export function validateAccessKey(candidateKey: string) {
  if (!isAuthAccessKeyConfigured()) {
    return false;
  }

  return normalizeAccessKey(candidateKey) === configuredAccessKey;
}

// Backward-compatible aliases while we complete wider renaming.
export const isMFD001Authorized = isAuthorized;
export const setMFD001Authorized = setAuthorized;
export const validateMFD001AccessKey = validateAccessKey;
