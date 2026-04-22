import { useEffect, useState } from "react";
import { Sidebar } from "../components/Sidebar";
import { PANEL_DEFAULT_OPEN_STATE } from "../components/constants/panelsConfig";
import { E3DSPlayer } from "../components/e3ds/E3DSPlayer";
import {
  sendPayloadToUE,
  subscribeToE3DSMessages,
} from "../components/e3ds/e3dsBridge";
import { type ItemPayload } from "../components/e3ds/payloadItemFactory";
import { getStreamingModeConfig } from "../components/streamingMode/streamingMode";

export function MFD001() {
  const streamConfig = getStreamingModeConfig();
  const iframeUrl = streamConfig.iframeUrl;
  const sidebarContainerWidthClass =
    "w-[min(252px,calc(100vw-1rem))] max-w-full";
  const [isSidebarOpen, setIsSidebarOpen] = useState(
    PANEL_DEFAULT_OPEN_STATE.sidebar,
  );

  useEffect(() => {
    const unsubscribe = subscribeToE3DSMessages((event) => {
      console.log(
        `[${streamConfig.mode.toUpperCase()}] incoming message`,
        event.data,
      );
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const handleSendPayload = (payload: ItemPayload) => {
    const sent = sendPayloadToUE(payload);
    if (!sent) {
      console.log(`[${streamConfig.mode.toUpperCase()}] iframe is unavailable`);
    }
  };

  if (!iframeUrl) {
    return (
      <main className="flex h-dvh w-full items-center justify-center overflow-hidden bg-[#0f1115] px-6 text-center font-['Montserrat'] text-white">
        <div className="w-full min-w-0 max-w-lg rounded-md border border-white/25 bg-black/30 p-6 backdrop-blur-sm">
          <h1 className="text-xl font-semibold">Missing iframe URL</h1>
          <p className="mt-2 text-sm text-white/75">
            Current mode: <strong>{streamConfig.mode}</strong>. Add{" "}
            {streamConfig.usesE3DSWebSdk
              ? "VITE_E3DS_IFRAME_URL"
              : "VITE_NATIVE_IFRAME_URL"}{" "}
            in your environment file to load the stream.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="relative h-dvh w-full overflow-hidden bg-black font-['Montserrat']">
      <div className="absolute inset-0 z-0 overflow-hidden">
        <E3DSPlayer iframeUrl={iframeUrl} />
      </div>

      <div className="absolute inset-0 z-20 overflow-hidden pointer-events-none">
        <div
          className={
            "absolute right-2 top-1/2 " +
            sidebarContainerWidthClass +
            " -translate-y-1/2 pointer-events-none"
          }
        >
          <Sidebar
            isOpen={isSidebarOpen}
            onToggle={() => setIsSidebarOpen((prev) => !prev)}
            onSelectItem={handleSendPayload}
          />
        </div>
      </div>
    </main>
  );
}
