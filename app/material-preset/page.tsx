"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { BsChevronLeft, BsChevronRight } from "react-icons/bs";
import { materialPresets } from "./data.js";

const MaterialViewerScene = dynamic(
  () => import("../material-viewer/components/MaterialViewerScene.jsx"),
  { ssr: false },
) as React.ComponentType<{
  materialType?: string;
  materialParams?: Record<string, unknown> | null;
  onEnvMapReady?: ((envMap: unknown) => void) | null;
}>;

const EMPTY_FALLBACK = {
  type: "metal",
  params: null, // MaterialViewerScene falls back to METAL_DEFAULTS
  name: null,
};

export default function MaterialPresetsPage() {
  const [index, setIndex] = useState(0);

  const hasPresets = materialPresets.length > 0;
  const hasMultiple = materialPresets.length > 1;

  const current = hasPresets ? materialPresets[index] : EMPTY_FALLBACK;

  const handlePrev = () => setIndex((i) => Math.max(0, i - 1));
  const handleNext = () =>
    setIndex((i) => Math.min(materialPresets.length - 1, i + 1));

  return (
    <div className="relative w-full h-screen bg-[#0a0a0a] overflow-hidden">
      <div className="absolute inset-0">
        <MaterialViewerScene
          materialType={current.type ?? "metal"}
          materialParams={current.params ?? null}
        />
      </div>

      <div className="absolute top-4 left-4 z-30 pointer-events-none">
        <p className="text-[10px] uppercase tracking-widest text-slate-500">
          Modernfold
        </p>
        <h1 className="text-sm font-semibold text-slate-200 leading-tight">
          Material Presets
        </h1>
      </div>

      <div
        className={[
          "absolute top-4 right-4 z-30",
          "w-64",
          "bg-black/65 backdrop-blur-md",
          "border border-white/10 rounded-xl",
          "shadow-2xl",
          "overflow-hidden",
        ].join(" ")}
      >
        <div className="px-4 pt-4 pb-3 text-center">
          {hasPresets ? (
            <>
              <p className="text-[9px] uppercase tracking-widest text-slate-500 mb-1">
                {current.type} — {index + 1} / {materialPresets.length}
              </p>
              <p className="text-sm font-semibold text-slate-100 truncate">
                {current.name ?? `Preset ${index + 1}`}
              </p>
            </>
          ) : (
            <>
              <p className="text-xs text-slate-500 leading-snug">
                No presets yet.
              </p>
              <p className="text-[10px] text-slate-600 mt-1 leading-snug">
                Open{" "}
                <a
                  href="/material-viewer"
                  className="text-emerald-500 underline underline-offset-2"
                >
                  /material-viewer
                </a>
                , configure a material and click{" "}
                <span className="text-slate-400 font-medium">Copy preset</span>.
                <br />
                Paste the result into{" "}
                <span className="text-slate-400 font-mono text-[9px]">
                  material-presets/data.js
                </span>
                .
              </p>
            </>
          )}
        </div>

        {hasMultiple && (
          <>
            <div className="border-t border-white/8 mx-4" />
            <div className="flex items-center justify-between px-4 py-3 gap-2">
              <button
                onClick={handlePrev}
                disabled={index === 0}
                aria-label="Previous preset"
                className={[
                  "flex items-center justify-center w-9 h-9 rounded-lg",
                  "border border-white/10 transition-all duration-150",
                  index === 0
                    ? "opacity-30 cursor-not-allowed text-slate-600"
                    : "text-slate-300 hover:bg-white/10 hover:text-white cursor-pointer",
                ].join(" ")}
              >
                <BsChevronLeft size={14} />
              </button>

              <div className="flex gap-1.5 flex-wrap justify-center flex-1">
                {materialPresets.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setIndex(i)}
                    aria-label={`Go to preset ${i + 1}`}
                    className={[
                      "rounded-full transition-all duration-150",
                      i === index
                        ? "w-4 h-1.5 bg-emerald-500"
                        : "w-1.5 h-1.5 bg-white/25 hover:bg-white/50",
                    ].join(" ")}
                  />
                ))}
              </div>

              <button
                onClick={handleNext}
                disabled={index === materialPresets.length - 1}
                aria-label="Next preset"
                className={[
                  "flex items-center justify-center w-9 h-9 rounded-lg",
                  "border border-white/10 transition-all duration-150",
                  index === materialPresets.length - 1
                    ? "opacity-30 cursor-not-allowed text-slate-600"
                    : "text-slate-300 hover:bg-white/10 hover:text-white cursor-pointer",
                ].join(" ")}
              >
                <BsChevronRight size={14} />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
