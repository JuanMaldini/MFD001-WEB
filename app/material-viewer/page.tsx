"use client";

/**
 * Material Viewer — /material-viewer
 *
 * Live material editor. Uses three parent material definitions (Metal, Glass, Opaque)
 * exposed through MaterialParametersPanel (top-right). The sphere in MaterialViewerScene
 * updates in real time as parameters are adjusted.
 *
 * Layout:
 *   Full-screen dark canvas (bg-[#0a0a0a])
 *   └── MaterialViewerScene  (fills 100%)
 *   └── MaterialParametersPanel  (absolute, top-right overlay)
 */

import React, { useState, useCallback } from "react";
import dynamic from "next/dynamic";
import MaterialParametersPanelImpl from "./components/MaterialParametersPanel.jsx";

// Cast the JSX component to a typed wrapper so TypeScript accepts callback props.
const MaterialParametersPanel =
  MaterialParametersPanelImpl as React.ComponentType<{
    materialType?: string;
    materialParams?: Record<string, unknown>;
    onMaterialTypeChange?: (type: string) => void;
    onParamChange?: (key: string, value: unknown) => void;
  }>;
import { METAL_DEFAULTS } from "./components/MetalMaterial.js";
import { GLASS_DEFAULTS } from "./components/GlassMaterial.js";
import { OPAQUE_DEFAULTS } from "./components/OpaqueMaterial.js";

// ─── Types ────────────────────────────────────────────────────────────────────

type MaterialType = "metal" | "glass" | "opaque";
type MaterialParams = Record<string, unknown>;

// Dynamically import the Three.js scene — disables SSR for the canvas.
const MaterialViewerScene = dynamic(
  () => import("./components/MaterialViewerScene.jsx"),
  { ssr: false },
) as React.ComponentType<{
  materialType?: string;
  materialParams?: MaterialParams | null;
  onEnvMapReady?: ((envMap: unknown) => void) | null;
}>;

// ─── Default map ─────────────────────────────────────────────────────────────

const DEFAULTS_MAP: Record<MaterialType, MaterialParams> = {
  metal: METAL_DEFAULTS as MaterialParams,
  glass: GLASS_DEFAULTS as MaterialParams,
  opaque: OPAQUE_DEFAULTS as MaterialParams,
};

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function MaterialViewerPage() {
  const [materialType, setMaterialType] = useState<MaterialType>("metal");
  const [materialParams, setMaterialParams] = useState<MaterialParams>({
    ...METAL_DEFAULTS,
  });

  /** Switch material type — reset params to that type's defaults */
  const handleTypeChange = useCallback((type: string) => {
    const t = type as MaterialType;
    setMaterialType(t);
    setMaterialParams({ ...DEFAULTS_MAP[t] });
  }, []);

  /** Update a single parameter key without touching others */
  const handleParamChange = useCallback((key: string, value: unknown) => {
    setMaterialParams((prev) => ({ ...prev, [key]: value }));
  }, []);

  return (
    <div className="relative w-full h-screen bg-[#0a0a0a] overflow-hidden">
      {/* ── Three.js Canvas ──────────────────────────────────────────────── */}
      <div className="absolute inset-0">
        <MaterialViewerScene
          materialType={materialType}
          materialParams={materialParams}
        />
      </div>

      {/* ── Page title badge (top-left) ──────────────────────────────────── */}
      <div className="absolute top-4 left-4 z-30 pointer-events-none">
        <p className="text-[10px] uppercase tracking-widest text-slate-500">
          Modernfold
        </p>
        <h1 className="text-sm font-semibold text-slate-200 leading-tight">
          Material Viewer
        </h1>
      </div>

      {/* ── Parameters Panel (top-right) ─────────────────────────────────── */}
      <MaterialParametersPanel
        materialType={materialType}
        materialParams={materialParams}
        onMaterialTypeChange={handleTypeChange}
        onParamChange={handleParamChange}
      />
    </div>
  );
}
