import { useState, useMemo, useCallback, useEffect, useRef } from "react";
import OperablePartition from "../../partition-operable/page";
import GlassPartition from "../../partition-glass/page";
import { DEFAULT_ORBIT_CAROUSEL_ITEMS } from "../3DViewer/controls_orbit";
import { normalizeCarouselSlides } from "../3DViewer/components/pose";
import { OverwriteMaterialToggle } from "../3DViewer/components/OverwriteMaterial";
import Screenshot from "../3DViewer/components/Screenshot";
import CopyCurrentViewButton from "../3DViewer/components/CopyCurrentViewButton";

export default function Sidepanel({
  viewerReady,
  overwriteEnabled = true,
}: {
  viewerReady?: any;
  overwriteEnabled?: boolean;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [activePartition, setActivePartition] = useState<
    "operable" | "glass" | null
  >(null);

  const slides = useMemo(
    () => normalizeCarouselSlides(DEFAULT_ORBIT_CAROUSEL_ITEMS),
    [],
  );
  const activeSlide = slides[activeIndex] ?? slides[0];

  const showPrevious = useCallback(() => {
    setActiveIndex((i) => (i === 0 ? slides.length - 1 : i - 1));
  }, [slides.length]);

  const showNext = useCallback(() => {
    setActiveIndex((i) => (i === slides.length - 1 ? 0 : i + 1));
  }, [slides.length]);

  const prevIndexRef = useRef<number>(-1);
  useEffect(() => {
    if (!viewerReady?.handleActiveSlideChange || !activeSlide) return;
    if (prevIndexRef.current === activeIndex) return;
    prevIndexRef.current = activeIndex;
    viewerReady.handleActiveSlideChange({
      slide: activeSlide,
      index: activeIndex,
    });
  }, [activeIndex, activeSlide, viewerReady]);

  return (
    <div className="modernfold-light bg-slate-50 text-slate-800 w-full h-full overflow-y-auto">
      {/* Nav + Toolbar row */}
      <div className="flex items-center gap-1.5 bg-white border-b border-slate-200 px-2 py-2">
        <button
          type="button"
          onClick={showPrevious}
          disabled={slides.length <= 1}
          className="inline-flex h-8 w-8 items-center justify-center rounded border border-black/15 bg-white text-black/55 transition-colors hover:bg-black/[0.04] hover:text-black/75 disabled:pointer-events-none disabled:opacity-30"
        >
          ‹
        </button>
        <p className="flex-1 text-center text-sm font-semibold leading-5 text-black/85 truncate px-1">
          {activeSlide?.title}
        </p>
        <button
          type="button"
          onClick={showNext}
          disabled={slides.length <= 1}
          className="inline-flex h-8 w-8 items-center justify-center rounded border border-black/15 bg-white text-black/55 transition-colors hover:bg-black/[0.04] hover:text-black/75 disabled:pointer-events-none disabled:opacity-30"
        >
          ›
        </button>
        <div className="mx-1 h-5 w-px bg-black/10" />
        <OverwriteMaterialToggle
          enabled={overwriteEnabled}
          onToggle={viewerReady?.handleToggleOverwrite}
          disabled={!viewerReady}
        />
        <Screenshot
          onCapture={viewerReady?.handleRequestScreenshot}
          disabled={!viewerReady}
        />
        <CopyCurrentViewButton
          copyMode="orbit"
          cameraRef={viewerReady?.cameraRef}
          orbitControlsRef={viewerReady?.orbitControlsRef}
          pointerLockControlsRef={null}
          currentPlayerSlide={undefined}
          activeSlideTitle={activeSlide?.title}
          disabled={!viewerReady}
        />
      </div>

      <div className="mt-2 flex flex-col gap-3">
        <strong className="text-slate-600 text-center text-xs uppercase tracking-widest">
          Select Configuration
        </strong>
        <div className="grid grid-cols-2 gap-2 px-2">
          <button
            onClick={() => setActivePartition("operable")}
            className={`px-3 py-2 rounded-lg text-xs font-bold transition-all ${
              activePartition === "operable"
                ? "bg-emerald-600 text-white ring-1 ring-inset ring-emerald-600"
                : "bg-white text-slate-700 ring-1 ring-inset ring-slate-200 hover:ring-slate-300"
            }`}
          >
            Operable
          </button>
          <button
            onClick={() => setActivePartition("glass")}
            className={`px-3 py-2 rounded-lg text-xs font-bold transition-all ${
              activePartition === "glass"
                ? "bg-emerald-600 text-white ring-1 ring-inset ring-emerald-600"
                : "bg-white text-slate-700 ring-1 ring-inset ring-slate-200 hover:ring-slate-300"
            }`}
          >
            Glass
          </button>
        </div>
      </div>

      <div className="pt-2">
        {activePartition ? (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="overflow-y-auto">
              {activePartition === "operable" ? (
                <OperablePartition />
              ) : (
                <GlassPartition />
              )}
            </div>
          </div>
        ) : (
          <div></div>
        )}
      </div>
    </div>
  );
}
