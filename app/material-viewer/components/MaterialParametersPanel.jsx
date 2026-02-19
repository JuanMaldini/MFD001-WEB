"use client";

/**
 * MaterialParametersPanel
 *
 * Top-right overlay panel rendered inside app/material-viewer/page.tsx.
 *
 * Responsibilities:
 *   1. Material type switch — Metal | Glass | Opaque tabs.
 *   2. Auto-rendered parameter controls driven by each parent material's
 *      *_PARAM_SCHEMA (type: 'color' | 'range' | 'boolean').
 *   3. Copy-to-clipboard button — formats the current type + params as a
 *      data.js entry and copies it, showing a checkmark on success.
 *      (Same pattern as CopyCurrentViewButton.jsx in design-planner.)
 *
 * Props:
 *   materialType        : 'metal' | 'glass' | 'opaque'
 *   materialParams      : object  — current param values
 *   onMaterialTypeChange: (type: string) => void
 *   onParamChange       : (key: string, value: any) => void
 */

import { useState, useCallback } from "react";
import { BsCheck2, BsClipboard } from "react-icons/bs";
import { METAL_PARAM_SCHEMA } from "./MetalMaterial.js";
import { GLASS_PARAM_SCHEMA } from "./GlassMaterial.js";
import { OPAQUE_PARAM_SCHEMA } from "./OpaqueMaterial.js";

// ─── Constants ────────────────────────────────────────────────────────────────

const MATERIAL_TYPES = [
  { id: "metal", label: "Metal" },
  { id: "glass", label: "Glass" },
  { id: "opaque", label: "Opaque" },
];

/** Map from materialType → schema array */
const SCHEMA_MAP = {
  metal: METAL_PARAM_SCHEMA,
  glass: GLASS_PARAM_SCHEMA,
  opaque: OPAQUE_PARAM_SCHEMA,
};

// ─── Utility ──────────────────────────────────────────────────────────────────

/**
 * Formats a preset entry suitable for pasting into the `materialPresets` array
 * inside app/material-presets/data.js.
 */
function buildPresetClipboardString(materialType, materialParams) {
  const id = `preset-${Date.now()}`;
  const name = `${materialType.charAt(0).toUpperCase() + materialType.slice(1)} Preset`;

  const paramsStr = Object.entries(materialParams)
    .map(([k, v]) => {
      const val = typeof v === "string" ? `'${v}'` : v;
      return `    ${k}: ${val}`;
    })
    .join(",\n");

  return (
    `// Paste this entry into the materialPresets array in app/material-presets/data.js\n` +
    `{\n` +
    `  id: '${id}',\n` +
    `  type: '${materialType}',\n` +
    `  name: '${name}',\n` +
    `  params: {\n${paramsStr}\n  }\n` +
    `}`
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

/** Single range slider row */
function RangeControl({ schema, value, onChange }) {
  return (
    <div className="flex flex-col gap-0.5">
      <div className="flex justify-between items-center">
        <label className="text-xs text-slate-400 leading-none">
          {schema.label}
        </label>
        <span className="text-xs text-slate-300 font-mono tabular-nums">
          {Number(value).toFixed(2)}
        </span>
      </div>
      <input
        type="range"
        min={schema.min}
        max={schema.max}
        step={schema.step}
        value={value}
        onChange={(e) => onChange(schema.key, parseFloat(e.target.value))}
        className="w-full h-1 accent-emerald-500 cursor-pointer"
      />
    </div>
  );
}

/** Color input row */
function ColorControl({ schema, value, onChange }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <label className="text-xs text-slate-400 leading-none flex-1">
        {schema.label}
      </label>
      <div className="flex items-center gap-1.5">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(schema.key, e.target.value)}
          className="w-7 h-7 rounded cursor-pointer border border-white/10 bg-transparent p-0"
          style={{ padding: 0 }}
        />
        <span className="text-xs text-slate-300 font-mono tabular-nums w-16 text-right">
          {value}
        </span>
      </div>
    </div>
  );
}

/** Checkbox row */
function BooleanControl({ schema, value, onChange }) {
  return (
    <div className="flex items-center justify-between">
      <label className="text-xs text-slate-400 leading-none">
        {schema.label}
      </label>
      <input
        type="checkbox"
        checked={Boolean(value)}
        onChange={(e) => onChange(schema.key, e.target.checked)}
        className="accent-emerald-500 w-4 h-4 cursor-pointer"
      />
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function MaterialParametersPanel({
  materialType = "metal",
  materialParams = {},
  onMaterialTypeChange = () => {},
  onParamChange = () => {},
}) {
  const [copied, setCopied] = useState(false);

  const schema = SCHEMA_MAP[materialType] ?? METAL_PARAM_SCHEMA;

  const handleCopy = useCallback(async () => {
    const text = buildPresetClipboardString(materialType, materialParams);
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch (err) {
      console.error("[MaterialParametersPanel] Clipboard write failed", err);
    }
  }, [materialType, materialParams]);

  const renderControl = (s) => {
    const value = materialParams[s.key] ?? "";
    switch (s.type) {
      case "range":
        return (
          <RangeControl
            key={s.key}
            schema={s}
            value={value}
            onChange={onParamChange}
          />
        );
      case "color":
        return (
          <ColorControl
            key={s.key}
            schema={s}
            value={value}
            onChange={onParamChange}
          />
        );
      case "boolean":
        return (
          <BooleanControl
            key={s.key}
            schema={s}
            value={value}
            onChange={onParamChange}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div
      className={[
        "absolute top-4 right-4 z-30",
        "w-72",
        "bg-black/65 backdrop-blur-md",
        "border border-white/10 rounded-xl",
        "shadow-2xl",
        "flex flex-col overflow-hidden",
      ].join(" ")}
    >
      {/* ── Header label ─────────────────────────────────────────────────── */}
      <div className="px-4 pt-4 pb-2">
        <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-2">
          Material Type
        </p>

        {/* ── Type switch tabs ─────────────────────────────────────────── */}
        <div className="grid grid-cols-3 gap-1 bg-white/5 rounded-lg p-1">
          {MATERIAL_TYPES.map((t) => (
            <button
              key={t.id}
              onClick={() => onMaterialTypeChange(t.id)}
              className={[
                "text-xs font-medium py-1.5 rounded-md transition-all duration-150",
                materialType === t.id
                  ? "bg-emerald-500/80 text-white shadow"
                  : "text-slate-400 hover:text-slate-200",
              ].join(" ")}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Divider ───────────────────────────────────────────────────────── */}
      <div className="border-t border-white/8 mx-4" />

      {/* ── Scrollable parameter list ─────────────────────────────────────── */}
      <div className="flex flex-col gap-3 px-4 py-3 overflow-y-auto max-h-[420px] custom-scrollbar">
        {schema.map(renderControl)}
      </div>

      {/* ── Divider ───────────────────────────────────────────────────────── */}
      <div className="border-t border-white/8 mx-4" />

      {/* ── Copy button ───────────────────────────────────────────────────── */}
      <div className="px-4 py-3">
        <button
          onClick={handleCopy}
          className={[
            "w-full flex items-center justify-center gap-2",
            "text-xs font-medium py-2 rounded-lg",
            "transition-all duration-200",
            copied
              ? "bg-emerald-500/80 text-white"
              : "bg-white/8 text-slate-300 hover:bg-white/15 hover:text-white border border-white/10",
          ].join(" ")}
        >
          {copied ? (
            <>
              <BsCheck2 size={13} />
              Copied to clipboard
            </>
          ) : (
            <>
              <BsClipboard size={13} />
              Copy preset
            </>
          )}
        </button>
        <p className="text-[9px] text-slate-600 text-center mt-1.5 leading-tight">
          Paste into materialPresets[ ] in data.js
        </p>
      </div>
    </div>
  );
}
