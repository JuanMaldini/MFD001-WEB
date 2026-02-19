/**
 * OPAQUE MATERIAL — Parent / Master Material
 *
 * Reference: https://threejs.org/examples/webgl_loader_3mf_materials.html
 *
 * Exposed parameters (OPAQUE_PARAM_SCHEMA) drive the UI panel in MaterialParametersPanel.
 * createOpaqueMaterial(params, envMap) is the factory consumed by MaterialViewerScene.
 *
 * This acts as the base for walls, brick textures, painted surfaces — any fully
 * opaque, non-transmissive surface.
 *
 * Hierarchy:
 *   MaterialViewerScene  →  createOpaqueMaterial()
 *   MaterialParametersPanel  →  OPAQUE_DEFAULTS, OPAQUE_PARAM_SCHEMA
 */

import * as THREE from "three";

// ─── Defaults ────────────────────────────────────────────────────────────────

export const OPAQUE_DEFAULTS = {
  color: "#b08060",
  roughness: 0.85,
  metalness: 0.0,
  emissive: "#000000",
  emissiveIntensity: 0.0,
  clearcoat: 0.0,
  clearcoatRoughness: 0.5,
  sheen: 0.0,
  sheenRoughness: 0.5,
  sheenColor: "#ffffff",
  envMapIntensity: 0.5,
  flatShading: false,
  wireframe: false,
};

// ─── Parameter Schema ─────────────────────────────────────────────────────────

export const OPAQUE_PARAM_SCHEMA = [
  { key: "color", label: "Color", type: "color" },
  {
    key: "roughness",
    label: "Roughness",
    type: "range",
    min: 0,
    max: 1,
    step: 0.01,
  },
  {
    key: "metalness",
    label: "Metalness",
    type: "range",
    min: 0,
    max: 1,
    step: 0.01,
  },
  { key: "emissive", label: "Emissive Color", type: "color" },
  {
    key: "emissiveIntensity",
    label: "Emissive Intensity",
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
  { key: "sheen", label: "Sheen", type: "range", min: 0, max: 1, step: 0.01 },
  {
    key: "sheenRoughness",
    label: "Sheen Roughness",
    type: "range",
    min: 0,
    max: 1,
    step: 0.01,
  },
  { key: "sheenColor", label: "Sheen Color", type: "color" },
  {
    key: "envMapIntensity",
    label: "Env Map Intensity",
    type: "range",
    min: 0,
    max: 5,
    step: 0.05,
  },
  { key: "flatShading", label: "Flat Shading", type: "boolean" },
  { key: "wireframe", label: "Wireframe", type: "boolean" },
];

// ─── Factory ──────────────────────────────────────────────────────────────────
/**
 * Creates a configured MeshPhysicalMaterial for opaque surfaces.
 *
 * @param {typeof OPAQUE_DEFAULTS} params  - Values from the UI panel.
 * @param {THREE.Texture|null}     envMap  - Pre-processed PMREM environment texture.
 * @returns {THREE.MeshPhysicalMaterial}
 */
export function createOpaqueMaterial(params = OPAQUE_DEFAULTS, envMap = null) {
  return new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(params.color),
    roughness: params.roughness,
    metalness: params.metalness,
    emissive: new THREE.Color(params.emissive),
    emissiveIntensity: params.emissiveIntensity,
    clearcoat: params.clearcoat,
    clearcoatRoughness: params.clearcoatRoughness,
    sheen: params.sheen,
    sheenRoughness: params.sheenRoughness,
    sheenColor: new THREE.Color(params.sheenColor),
    envMap: envMap,
    envMapIntensity: params.envMapIntensity,
    flatShading: params.flatShading,
    wireframe: params.wireframe,
    transparent: false,
    side: THREE.FrontSide,
  });
}

/**
 * Updates an existing MeshPhysicalMaterial in place.
 *
 * @param {THREE.MeshPhysicalMaterial} material
 * @param {typeof OPAQUE_DEFAULTS}     params
 * @param {THREE.Texture|null}         envMap
 */
export function updateOpaqueMaterial(material, params, envMap = null) {
  material.color.set(params.color);
  material.roughness = params.roughness;
  material.metalness = params.metalness;
  material.emissive.set(params.emissive);
  material.emissiveIntensity = params.emissiveIntensity;
  material.clearcoat = params.clearcoat;
  material.clearcoatRoughness = params.clearcoatRoughness;
  material.sheen = params.sheen;
  material.sheenRoughness = params.sheenRoughness;
  material.sheenColor.set(params.sheenColor);
  material.envMap = envMap;
  material.envMapIntensity = params.envMapIntensity;
  material.flatShading = params.flatShading;
  material.wireframe = params.wireframe;
  material.needsUpdate = true;
}
