import { useState } from "react";
import { RiResetLeftLine } from "react-icons/ri";
import OperablePartition from "../../partition-operable/page";
import GlassPartition from "../../partition-glass/page";
import { LuPanelRight } from "react-icons/lu";

import PreconfiguredPartition from "../../preconfigured/preconfigured";

export default function Sidepanel() {
  const [activePartition, setActivePartition] = useState<
    "operable" | "glass" | null
  >(null);
  const [codeMode, setCodeMode] = useState(false);
  const [codeValue, setCodeValue] = useState("");
  const [isPanelOpen, setIsPanelOpen] = useState(true);

  return (
    <div className="modernfold-light bg-transparent text-slate-800 w-full h-full overflow-x-hidden overflow-y-auto">
      <div className="mt-2 flex flex-col gap-3">
        <div className="flex flex-row items-center justify-between px-2">
          <h2 className="text-sm font-semibold px-2">Configurator</h2>
          <button
            type="button"
            onClick={() => setIsPanelOpen((prev) => !prev)}
            className="hidden h-8 w-8 shrink-0 items-center justify-center rounded-md border border-slate-300 bg-white/90 p-1.5 text-slate-700 backdrop-blur-sm transition-colors duration-200 hover:border-slate-400 md:inline-flex"
            aria-label={isPanelOpen ? "Collapse panel" : "Expand panel"}
          >
            <LuPanelRight
              className={`h-4 w-4 transition-transform duration-200 ${
                isPanelOpen ? "rotate-0" : "rotate-180"
              }`}
            />
          </button>
        </div>

        <div
          className={`transition-all duration-300 ease-out md:origin-right ${
            isPanelOpen
              ? "opacity-100 translate-x-0"
              : "opacity-100 translate-x-0 md:opacity-0 md:translate-x-12 md:pointer-events-none"
          }`}
        >
          <div className="flex items-center px-2">
            {codeMode ? (
              <input
                type="text"
                value={codeValue}
                onChange={(e) => setCodeValue(e.target.value)}
                placeholder="Enter pre-configured code…"
                className="flex-1 px-3 py-2 mr-2 rounded-lg text-xs font-medium bg-white text-slate-800 ring-1 ring-inset ring-emerald-400 focus:outline-none focus:ring-emerald-500 placeholder:text-slate-400"
              />
            ) : (
              <>
                {/* Operable button — collapses when glass is active */}
                <button
                  onClick={() => setActivePartition("operable")}
                  className={`py-2 rounded-lg text-xs font-bold overflow-hidden
                  bg-white text-slate-700 ring-1 ring-inset ring-slate-200 hover:ring-slate-300
                  ${
                    activePartition === "glass"
                      ? "w-0 flex-none opacity-0 px-0 min-w-0 ring-0 pointer-events-none mr-0"
                      : "flex-1 px-3 mr-2"
                  }`}
                >
                  Operable
                </button>

                {/* Glass button — collapses when operable is active */}
                <button
                  onClick={() => setActivePartition("glass")}
                  className={`py-2 rounded-lg text-xs font-bold overflow-hidden
                  bg-white text-slate-700 ring-1 ring-inset ring-slate-200 hover:ring-slate-300
                  ${
                    activePartition === "operable"
                      ? "w-0 flex-none opacity-0 px-0 min-w-0 ring-0 pointer-events-none mr-0"
                      : "flex-1 px-3 mr-2"
                  }`}
                >
                  Glass
                </button>

                {/* Reset button — collapses when nothing is selected */}
                <button
                  onClick={() => setActivePartition(null)}
                  disabled={activePartition === null}
                  className={`py-2 rounded-lg overflow-hidden
                  bg-white text-slate-500 ring-1 ring-inset ring-slate-200 hover:ring-slate-300 hover:text-slate-700
                  ${
                    activePartition === null
                      ? "w-0 flex-none opacity-0 px-0 min-w-0 ring-0 pointer-events-none mr-0"
                      : "shrink-0 px-3 mr-2"
                  }`}
                  title="Reset selection"
                >
                  <RiResetLeftLine className="w-3.5 h-3.5" />
                </button>
              </>
            )}
            <button
              onClick={() => setCodeMode((prev) => !prev)}
              className={`shrink-0 px-3 py-2 rounded-lg text-xs font-bold ${
                codeMode
                  ? "bg-emerald-600 text-white ring-1 ring-inset ring-emerald-600"
                  : "bg-white text-slate-700 ring-1 ring-inset ring-slate-200 hover:ring-slate-300"
              }`}
            >
              Code
            </button>
          </div>

          <div className="pt-2">
            <div>
              <div className="overflow-y-auto">
                {codeMode ? (
                  <PreconfiguredPartition />
                ) : activePartition === "operable" ? (
                  <OperablePartition />
                ) : activePartition === "glass" ? (
                  <GlassPartition />
                ) : (
                  <div />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
