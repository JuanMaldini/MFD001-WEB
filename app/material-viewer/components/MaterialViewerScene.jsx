"use client";

/**
 * MaterialViewerScene
 *
 * Shared Three.js scene used by BOTH:
 *   - app/material-viewer/page.tsx   (live editing)
 *   - app/material-presets/page.tsx  (read-only carousel)
 *
 * Responsibilities:
 *   1. Mount a WebGLRenderer into a full-size container div.
 *   2. Load the royal_esplanade HDR from the Three.js CDN and process it
 *      through PMREMGenerator for physically correct IBL reflections.
 *   3. Render a sphere mesh (SphereGeometry 64×32) as the material preview target.
 *   4. Accept `materialType` + `materialParams` props and call the correct parent
 *      material factory/updater when they change.
 *   5. Clean up all Three.js objects on unmount.
 *
 * Props:
 *   materialType   : 'metal' | 'glass' | 'opaque'
 *   materialParams : object — values matching the active material's _DEFAULTS shape
 *   onEnvMapReady  : (pmremTexture) => void — optional, called once HDR loaded
 */

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { RGBELoader } from "three/addons/loaders/RGBELoader.js";

import {
  createMetalMaterial,
  updateMetalMaterial,
  METAL_DEFAULTS,
  METAL_PARAM_SCHEMA,
} from "./MetalMaterial.js";
import {
  createGlassMaterial,
  updateGlassMaterial,
  GLASS_DEFAULTS,
  GLASS_PARAM_SCHEMA,
} from "./GlassMaterial.js";
import {
  createOpaqueMaterial,
  updateOpaqueMaterial,
  OPAQUE_DEFAULTS,
  OPAQUE_PARAM_SCHEMA,
} from "./OpaqueMaterial.js";

// HDR hosted on the Three.js examples CDN — no local file needed.
const HDR_URL =
  "https://threejs.org/examples/textures/equirectangular/venice_sunset_1k.hdr";

// ─────────────────────────────────────────────────────────────────────────────

export default function MaterialViewerScene({
  materialType = "metal",
  materialParams = null,
  onEnvMapReady = null,
}) {
  const containerRef = useRef(null);

  // Keep live refs so the useEffect cleanup can reach current values without
  // re-running the full scene setup on every param change.
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const controlsRef = useRef(null);
  const sphereRef = useRef(null); // THREE.Mesh
  const envMapRef = useRef(null); // PMREM Texture

  // ── Scene bootstrap (runs once on mount) ──────────────────────────────────
  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const w = container.clientWidth;
    const h = container.clientHeight;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(w, h);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0a0a);
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(40, w / h, 0.1, 100);
    camera.position.set(0, 0, 6);
    cameraRef.current = camera;

    // OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.minDistance = 2;
    controls.maxDistance = 20;
    controlsRef.current = controls;

    // Lights — subtle fill, IBL does the heavy lifting once HDR loads
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.5);
    dirLight.position.set(5, 8, 5);
    dirLight.castShadow = true;
    scene.add(dirLight);

    // Sphere — preview mesh
    const geometry = new THREE.SphereGeometry(1.5, 64, 32);
    // Start with a placeholder standard material; will be replaced once
    // HDR loads (so the factory receives a valid envMap).
    const placeholderMat = new THREE.MeshStandardMaterial({
      color: 0x888888,
      roughness: 0.5,
      metalness: 0,
    });
    const sphere = new THREE.Mesh(geometry, placeholderMat);
    sphere.castShadow = true;
    scene.add(sphere);
    sphereRef.current = sphere;

    // ── Ground shadow plane ──────────────────────────────────────────────────
    const groundGeo = new THREE.CircleGeometry(3, 64);
    const groundMat = new THREE.ShadowMaterial({ opacity: 0.25 });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -1.6;
    ground.receiveShadow = true;
    scene.add(ground);

    // ── HDR Load ────────────────────────────────────────────────────────────
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    pmremGenerator.compileEquirectangularShader();

    new RGBELoader().load(
      HDR_URL,
      (hdrTexture) => {
        const envMap = pmremGenerator.fromEquirectangular(hdrTexture).texture;
        pmremGenerator.dispose();
        hdrTexture.dispose();

        envMapRef.current = envMap;
        scene.environment = envMap;

        // Blurred HDR background (set mapping to equirect on original)
        // Use the processed envMap as an equirect background with a subtle blur.
        scene.background = envMap;

        // Now replace placeholder with the real parent material
        rebuildMaterial(envMap);

        if (onEnvMapReady) onEnvMapReady(envMap);
      },
      undefined,
      (err) => {
        console.warn(
          "[MaterialViewerScene] HDR load failed, using fallback.",
          err,
        );
        // Fallback: still build the material without envMap
        rebuildMaterial(null);
      },
    );

    // ── Animation loop ───────────────────────────────────────────────────────
    renderer.setAnimationLoop(() => {
      controls.update();
      renderer.render(scene, camera);
    });

    // ── Resize observer ──────────────────────────────────────────────────────
    const resizeObserver = new ResizeObserver(() => {
      const nw = container.clientWidth;
      const nh = container.clientHeight;
      camera.aspect = nw / nh;
      camera.updateProjectionMatrix();
      renderer.setSize(nw, nh);
    });
    resizeObserver.observe(container);

    // ── Cleanup ───────────────────────────────────────────────────────────────
    return () => {
      resizeObserver.disconnect();
      renderer.setAnimationLoop(null);
      renderer.dispose();
      controls.dispose();
      geometry.dispose();
      if (sphereRef.current?.material) sphereRef.current.material.dispose();
      if (envMapRef.current) envMapRef.current.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // run ONCE

  // ── Rebuild material when type OR params change ───────────────────────────
  // This runs AFTER mount because sceneRef / sphereRef / envMapRef are populated.
  useEffect(() => {
    if (!sphereRef.current) return;
    rebuildMaterial(envMapRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [materialType, materialParams]);

  // ── Helpers ───────────────────────────────────────────────────────────────

  /**
   * Dispose the current sphere material and create a fresh one using the correct
   * parent material factory for the active `materialType`.
   */
  function rebuildMaterial(envMap) {
    if (!sphereRef.current) return;

    const oldMat = sphereRef.current.material;
    if (oldMat) oldMat.dispose();

    const resolvedParams = materialParams ?? getDefaultsForType(materialType);
    let newMat;

    switch (materialType) {
      case "glass":
        newMat = createGlassMaterial(resolvedParams, envMap);
        break;
      case "opaque":
        newMat = createOpaqueMaterial(resolvedParams, envMap);
        break;
      case "metal":
      default:
        newMat = createMetalMaterial(resolvedParams, envMap);
    }

    sphereRef.current.material = newMat;
  }

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        height: "100%",
        display: "block",
        overflow: "hidden",
      }}
    />
  );
}

// ─── Utility exported for page use ───────────────────────────────────────────

export function getDefaultsForType(type) {
  switch (type) {
    case "glass":
      return { ...GLASS_DEFAULTS };
    case "opaque":
      return { ...OPAQUE_DEFAULTS };
    case "metal":
    default:
      return { ...METAL_DEFAULTS };
  }
}

export function getSchemaForType(type) {
  switch (type) {
    case "glass":
      return GLASS_PARAM_SCHEMA;
    case "opaque":
      return OPAQUE_PARAM_SCHEMA;
    case "metal":
    default:
      return METAL_PARAM_SCHEMA;
  }
}
