export const AUTH_SESSION_KEY = "mfd001-auth";

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

export function isMFD001Authorized() {
  const store = getSessionStore();
  if (!store) {
    return false;
  }

  return store.getItem(AUTH_SESSION_KEY) === "1";
}

export function setMFD001Authorized(isAuthorized: boolean) {
  const store = getSessionStore();
  if (!store) {
    return;
  }

  if (isAuthorized) {
    store.setItem(AUTH_SESSION_KEY, "1");
    return;
  }

  store.removeItem(AUTH_SESSION_KEY);
}

export function validateMFD001AccessKey(candidateKey: string) {
  if (!isAuthAccessKeyConfigured()) {
    return false;
  }

  return normalizeAccessKey(candidateKey) === configuredAccessKey;
}
