/**
 * GLASS MATERIAL — Parent / Master Material
 *
 * Reference: https://threejs.org/examples/webgl_materials_physical_transmission.html
 *
 * Exposed parameters (GLASS_PARAM_SCHEMA) drive the UI panel in MaterialParametersPanel.
 * createGlassMaterial(params, envMap) is the factory consumed by MaterialViewerScene.
 *
 * Hierarchy:
 *   MaterialViewerScene  →  createGlassMaterial()
 *   MaterialParametersPanel  →  GLASS_DEFAULTS, GLASS_PARAM_SCHEMA
 */

import * as THREE from "three";

// ─── Defaults ────────────────────────────────────────────────────────────────

export const GLASS_DEFAULTS = {
  color: "#ffffff",
  transmission: 1.0,
  opacity: 1.0,
  metalness: 0.0,
  roughness: 0.0,
  ior: 1.5,
  thickness: 0.25,
  specularIntensity: 1.0,
  specularColor: "#ffffff",
  envMapIntensity: 1.0,
  attenuationColor: "#ffffff",
  attenuationDistance: 0.0,
  dispersion: 0.0,
};

// ─── Parameter Schema ─────────────────────────────────────────────────────────

export const GLASS_PARAM_SCHEMA = [
  { key: "color", label: "Color", type: "color" },
  {
    key: "transmission",
    label: "Transmission",
    type: "range",
    min: 0,
    max: 1,
    step: 0.01,
  },
  {
    key: "opacity",
    label: "Opacity",
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
  {
    key: "roughness",
    label: "Roughness",
    type: "range",
    min: 0,
    max: 1,
    step: 0.01,
  },
  { key: "ior", label: "IOR", type: "range", min: 1, max: 2.33, step: 0.01 },
  {
    key: "thickness",
    label: "Thickness",
    type: "range",
    min: 0,
    max: 5,
    step: 0.05,
  },
  {
    key: "specularIntensity",
    label: "Specular Intensity",
    type: "range",
    min: 0,
    max: 1,
    step: 0.01,
  },
  { key: "specularColor", label: "Specular Color", type: "color" },
  {
    key: "envMapIntensity",
    label: "Env Map Intensity",
    type: "range",
    min: 0,
    max: 5,
    step: 0.05,
  },
  { key: "attenuationColor", label: "Attenuation Color", type: "color" },
  {
    key: "attenuationDistance",
    label: "Attenuation Dist",
    type: "range",
    min: 0,
    max: 10,
    step: 0.1,
  },
  {
    key: "dispersion",
    label: "Dispersion",
    type: "range",
    min: 0,
    max: 1,
    step: 0.01,
  },
];

// ─── Factory ──────────────────────────────────────────────────────────────────
/**
 * Creates a configured MeshPhysicalMaterial for glass / transmissive surfaces.
 *
 * @param {typeof GLASS_DEFAULTS}  params  - Values from the UI panel.
 * @param {THREE.Texture|null}     envMap  - Pre-processed PMREM environment texture.
 * @returns {THREE.MeshPhysicalMaterial}
 */
export function createGlassMaterial(params = GLASS_DEFAULTS, envMap = null) {
  return new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(params.color),
    metalness: params.metalness,
    roughness: params.roughness,
    transmission: params.transmission,
    opacity: params.opacity,
    ior: params.ior,
    thickness: params.thickness,
    specularIntensity: params.specularIntensity,
    specularColor: new THREE.Color(params.specularColor),
    envMap: envMap,
    envMapIntensity: params.envMapIntensity,
    attenuationColor: new THREE.Color(params.attenuationColor),
    attenuationDistance:
      params.attenuationDistance > 0 ? params.attenuationDistance : Infinity,
    dispersion: params.dispersion,
    transparent: true,
    side: THREE.DoubleSide,
  });
}

/**
 * Updates an existing MeshPhysicalMaterial in place.
 *
 * @param {THREE.MeshPhysicalMaterial} material
 * @param {typeof GLASS_DEFAULTS}      params
 * @param {THREE.Texture|null}         envMap
 */
export function updateGlassMaterial(material, params, envMap = null) {
  material.color.set(params.color);
  material.metalness = params.metalness;
  material.roughness = params.roughness;
  material.transmission = params.transmission;
  material.opacity = params.opacity;
  material.ior = params.ior;
  material.thickness = params.thickness;
  material.specularIntensity = params.specularIntensity;
  material.specularColor.set(params.specularColor);
  material.envMap = envMap;
  material.envMapIntensity = params.envMapIntensity;
  material.attenuationColor.set(params.attenuationColor);
  material.attenuationDistance =
    params.attenuationDistance > 0 ? params.attenuationDistance : Infinity;
  material.dispersion = params.dispersion;
  material.needsUpdate = true;
}
