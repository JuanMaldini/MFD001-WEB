/**
 * METAL MATERIAL — Parent / Master Material
 *
 * Reference: https://threejs.org/examples/webgpu_materials_envmaps.html
 *
 * Exposed parameters (METAL_PARAM_SCHEMA) drive the UI panel in MaterialParametersPanel.
 * createMetalMaterial(params, envMap) is the factory consumed by MaterialViewerScene.
 *
 * Hierarchy:
 *   MaterialViewerScene  →  createMetalMaterial()
 *   MaterialParametersPanel  →  METAL_DEFAULTS, METAL_PARAM_SCHEMA
 */

import * as THREE from "three";

// ─── Defaults ────────────────────────────────────────────────────────────────

export const METAL_DEFAULTS = {
  color: "#a8b8c8",
  metalness: 1.0,
  roughness: 0.15,
  envMapIntensity: 1.5,
  clearcoat: 0.3,
  clearcoatRoughness: 0.2,
  reflectivity: 1.0,
  anisotropy: 0.0,
  anisotropyRotation: 0.0,
};

// ─── Parameter Schema ─────────────────────────────────────────────────────────
// Each entry describes one shader parameter that will be auto-rendered by the panel.
//
// type  : 'color' | 'range' | 'boolean'
// key   : property name on MeshPhysicalMaterial (mirrors METAL_DEFAULTS key)
// label : human-readable panel label

export const METAL_PARAM_SCHEMA = [
  { key: "color", label: "Color", type: "color" },
  {
    key: "metalness",
    label: "Metalness",
    type: "range",
    min: 0,
    max: 1,
    step: 0.01,
  },
  {
    key: "roughness",
    label: "Roughness",
    type: "range",
    min: 0,
    max: 1,
    step: 0.01,
  },
  {
    key: "envMapIntensity",
    label: "Env Map Intensity",
    type: "range",
    min: 0,
    max: 5,
    step: 0.05,
  },
  {
    key: "clearcoat",
    label: "Clearcoat",
    type: "range",
    min: 0,
    max: 1,
    step: 0.01,
  },
  {
    key: "clearcoatRoughness",
    label: "Coat Roughness",
    type: "range",
    min: 0,
    max: 1,
    step: 0.01,
  },
  {
    key: "reflectivity",
    label: "Reflectivity",
    type: "range",
    min: 0,
    max: 1,
    step: 0.01,
  },
  {
    key: "anisotropy",
    label: "Anisotropy",
    type: "range",
    min: 0,
    max: 1,
    step: 0.01,
  },
  {
    key: "anisotropyRotation",
    label: "Aniso Rotation",
    type: "range",
    min: 0,
    max: Math.PI * 2,
    step: 0.01,
  },
];

// ─── Factory ──────────────────────────────────────────────────────────────────
/**
 * Creates a configured MeshPhysicalMaterial for metallic surfaces.
 *
 * @param {typeof METAL_DEFAULTS} params  - Values from the UI panel.
 * @param {THREE.Texture|null}    envMap  - Pre-processed PMREM environment texture.
 * @returns {THREE.MeshPhysicalMaterial}
 */
export function createMetalMaterial(params = METAL_DEFAULTS, envMap = null) {
  return new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(params.color),
    metalness: params.metalness,
    roughness: params.roughness,
    envMap: envMap,
    envMapIntensity: params.envMapIntensity,
    clearcoat: params.clearcoat,
    clearcoatRoughness: params.clearcoatRoughness,
    reflectivity: params.reflectivity,
    anisotropy: params.anisotropy,
    anisotropyRotation: params.anisotropyRotation,
  });
}

/**
 * Updates an existing MeshPhysicalMaterial in place — avoids re-creating the material
 * on every slider change, which means no GPU buffer churn.
 *
 * @param {THREE.MeshPhysicalMaterial} material
 * @param {typeof METAL_DEFAULTS}      params
 * @param {THREE.Texture|null}         envMap
 */
export function updateMetalMaterial(material, params, envMap = null) {
  material.color.set(params.color);
  material.metalness = params.metalness;
  material.roughness = params.roughness;
  material.envMap = envMap;
  material.envMapIntensity = params.envMapIntensity;
  material.clearcoat = params.clearcoat;
  material.clearcoatRoughness = params.clearcoatRoughness;
  material.reflectivity = params.reflectivity;
  material.anisotropy = params.anisotropy;
  material.anisotropyRotation = params.anisotropyRotation;
  material.needsUpdate = true;
}
