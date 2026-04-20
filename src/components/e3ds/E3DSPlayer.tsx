import { useEffect, useRef } from "react";
import { registerE3DSIframe } from "./e3dsBridge";

interface E3DSPlayerProps {
  iframeUrl: string;
}

export function E3DSPlayer({ iframeUrl }: E3DSPlayerProps) {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  useEffect(() => {
    registerE3DSIframe(iframeRef.current);

    return () => {
      registerE3DSIframe(null);
    };
  }, []);

  return (
    <iframe
      ref={iframeRef}
      id="iframe_1"
      title="streaming"
      src={iframeUrl}
      allow="xr-spatial-tracking *; camera *; microphone *; display-capture *"
      allowFullScreen
      className="block h-full w-full max-h-full max-w-full border-0 bg-black"
    />
  );
}
