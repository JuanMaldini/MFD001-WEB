import { type FormEvent, useEffect, useState } from "react";
import { CiSquareCheck } from "react-icons/ci";
import { Navigate, useNavigate } from "react-router-dom";
import {
  isAuthAccessKeyConfigured,
  isMFD001Authorized,
  setMFD001Authorized,
  validateMFD001AccessKey,
} from "../components/auth/authConfig";

export function AuthPage() {
  const navigate = useNavigate();
  const [accessKey, setAccessKey] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [viewportHeightPx, setViewportHeightPx] = useState<number | null>(null);

  const isConfigured = isAuthAccessKeyConfigured();

  useEffect(() => {
    const updateViewportHeight = () => {
      const nextHeight = Math.round(
        window.visualViewport?.height ?? window.innerHeight,
      );
      setViewportHeightPx(nextHeight);
    };

    updateViewportHeight();

    window.visualViewport?.addEventListener("resize", updateViewportHeight);
    window.addEventListener("orientationchange", updateViewportHeight);
    window.addEventListener("resize", updateViewportHeight);

    return () => {
      window.visualViewport?.removeEventListener("resize", updateViewportHeight);
      window.removeEventListener("orientationchange", updateViewportHeight);
      window.removeEventListener("resize", updateViewportHeight);
    };
  }, []);

  if (isMFD001Authorized()) {
    return <Navigate to="/mfd001" replace />;
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!isConfigured) {
      setErrorMessage("Missing VITE_AUTH_ACCESS_KEY in environment.");
      return;
    }

    if (!validateMFD001AccessKey(accessKey)) {
      setErrorMessage("Invalid key.");
      return;
    }

    setMFD001Authorized(true);
    setErrorMessage("");
    navigate("/mfd001", { replace: true });
  };

  return (
    <main
      className="fixed inset-0 flex w-full items-center justify-center overflow-hidden overscroll-none bg-[#18181a] px-4 font-['Montserrat'] text-white sm:px-6"
      style={{
        height: viewportHeightPx ? `${viewportHeightPx}px` : "100dvh",
        minHeight: viewportHeightPx ? `${viewportHeightPx}px` : "100dvh",
        maxHeight: viewportHeightPx ? `${viewportHeightPx}px` : "100dvh",
        paddingTop: "max(env(safe-area-inset-top), 1rem)",
        paddingBottom: "max(env(safe-area-inset-bottom), 1rem)",
      }}
    >
      <div className="w-full min-w-0 max-w-md shrink-0 overflow-hidden rounded-lg border border-white/20 bg-black/25 p-2 backdrop-blur-sm">
        <form onSubmit={handleSubmit} className="flex min-w-0 items-center gap-2">
          <input
            type="password"
            value={accessKey}
            onChange={(event) => setAccessKey(event.target.value)}
            placeholder="Access key"
            className="h-11 w-full min-w-0 rounded-md border border-white/35 bg-transparent px-3 text-base text-white outline-none placeholder:text-white/45 focus:border-white/60 sm:text-sm"
            autoComplete="off"
            aria-label="Access key"
          />

          <button
            type="submit"
            className="inline-flex h-11 w-11 shrink-0 items-center justify-center text-white/80 hover:text-white"
            aria-label="Validate key"
          >
            <CiSquareCheck className="h-8 w-8" />
          </button>
        </form>

        {errorMessage ? (
          <p className="mt-3 text-xs text-[#ff8f8f]">{errorMessage}</p>
        ) : null}

        {!isConfigured ? (
          <p className="mt-3 text-xs text-white/55">
            Configure VITE_AUTH_ACCESS_KEY in your environment file.
          </p>
        ) : null}
      </div>
    </main>
  );
}
