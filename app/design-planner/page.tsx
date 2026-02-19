"use client";
import React from "react";
import { useCallback, useEffect, useState } from "react";
import Sidepanel from "./sidepanel/Sidepanel";
import "@n8n/chat/dist/style.css";
import Controls_Orbit from "./3DViewer/controls_orbit";

const Viewer = Controls_Orbit as React.ComponentType<{
  onReady?: (api: any) => void;
  onOverwriteChange?: (value: boolean) => void;
}>;

function DesignPlanner() {
  const [viewerReady, setViewerReady] = useState<any>(null);
  const [overwriteEnabled, setOverwriteEnabled] = useState(true);

  const handleReady = useCallback((api: any) => {
    setViewerReady(api);
  }, []);

  const handleOverwriteChange = useCallback((value: boolean) => {
    setOverwriteEnabled(value);
  }, []);

  useEffect(() => {
    import("@n8n/chat")
      .then(({ createChat }) => {
        const webhookUrl =
          process.env.NODE_ENV === "development"
            ? "http://localhost:5678/webhook/f4f1ffe0-dee2-472c-90d0-95ffd6919067/chat"
            : "";

        createChat({
          webhookUrl,
          mode: "window",
          showWelcomeScreen: true,
          initialMessages: ["Do you need guidance to build some steps?"],
          i18n: {
            en: {
              title: "Hello",
              subtitle: "Need help to build your system?",
              footer: "",
              getStarted: "New Conversation",
              inputPlaceholder: "Type your question...",
              closeButtonTooltip: "Close Chat",
            },
          },
        });
      })
      .catch((err) => console.error("Failed to load chat widget", err));
  }, []);

  return (
    <div className="flex flex-col md:flex-row w-full h-screen">
      <div className="w-full md:w-3/4 h-1/2 md:h-full">
        <Viewer
          onReady={handleReady}
          onOverwriteChange={handleOverwriteChange}
        />
      </div>

      <div className="w-full md:w-1/2 h-1/2 md:h-full">
        <Sidepanel
          viewerReady={viewerReady}
          overwriteEnabled={overwriteEnabled}
        />
      </div>
    </div>
  );
}

export default DesignPlanner;
