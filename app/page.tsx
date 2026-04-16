"use client";
import { useRef } from "react";
import Sidepanel from "./design-planner/sidepanel/Sidepanel";

function E3DSPlayer() {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const url = process.env.NEXT_PUBLIC_VAGON_STREAM_URL;

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <div className="absolute inset-0 z-0">
        <iframe
          ref={iframeRef}
          id="vagon-iframe"
          src={url}
          className="w-full h-full border-0"
          allowFullScreen
        />
      </div>

      <div className="relative z-10 flex h-full w-full flex-col justify-end pointer-events-none md:flex-row md:justify-start">
        <div className="hidden h-full md:block md:w-3/4" aria-hidden="true" />
        <div className="h-1/3 w-full pointer-events-auto md:h-full md:w-1/4">
          <Sidepanel />
        </div>
      </div>
    </div>
  );
}

export default E3DSPlayer;
