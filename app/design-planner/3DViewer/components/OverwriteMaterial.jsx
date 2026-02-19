import * as THREE from "three";
import { BsCircle, BsCircleFill } from "react-icons/bs";

const EDGE_TAG = "__overwrite_edge_lines__";
const EDGE_ANGLE_THRESHOLD_DEG = 15;

const createOverwriteSceneMaterial = () =>
  new THREE.MeshStandardMaterial({
    color: 0xcfcfcf,
    roughness: 0.55,
    metalness: 0,
    side: THREE.DoubleSide,
  });

const createEdgesLineMaterial = () =>
  new THREE.LineBasicMaterial({
    color: 0x222222,
    linewidth: 1,
    depthTest: true,
    depthWrite: false,
  });

export const createOverwriteMaterialController = () => {
  let model = null;
  let enabled = false;
  const overwriteMaterial = createOverwriteSceneMaterial();
  const edgesLineMaterial = createEdgesLineMaterial();
  const originalMaterials = new Map();

  const addEdgesToMesh = (node) => {
    if (!node.geometry) return;
    const edges = new THREE.EdgesGeometry(
      node.geometry,
      EDGE_ANGLE_THRESHOLD_DEG,
    );
    const lines = new THREE.LineSegments(edges, edgesLineMaterial);
    lines.name = EDGE_TAG;
    lines.renderOrder = 1;
    node.add(lines);
  };

  const removeEdgesFromMesh = (node) => {
    const toRemove = node.children.filter((c) => c.name === EDGE_TAG);
    toRemove.forEach((child) => {
      node.remove(child);
      child.geometry?.dispose();
    });
  };

  const applyAll = () => {
    if (!model) return;
    model.traverse((node) => {
      if (!node.isMesh) return;
      if (enabled) {
        if (!originalMaterials.has(node)) {
          originalMaterials.set(node, node.material);
        }
        node.material = overwriteMaterial;
        const hasEdges = node.children.some((c) => c.name === EDGE_TAG);
        if (!hasEdges) addEdgesToMesh(node);
      } else {
        const original = originalMaterials.get(node);
        if (original !== undefined) {
          node.material = original;
          originalMaterials.delete(node);
        }
        removeEdgesFromMesh(node);
      }
    });
  };

  const clearAll = () => {
    if (!model) return;
    model.traverse((node) => {
      if (!node.isMesh) return;
      const original = originalMaterials.get(node);
      if (original !== undefined) {
        node.material = original;
        originalMaterials.delete(node);
      }
      removeEdgesFromMesh(node);
    });
  };

  return {
    // Kept for API compatibility — no longer uses scene.overrideMaterial
    setScene(_nextScene) {},

    setModel(nextModel) {
      if (model && enabled) clearAll();
      model = nextModel;
      if (model) model.updateMatrixWorld(true);
      applyAll();
    },

    setEnabled(nextEnabled) {
      enabled = Boolean(nextEnabled);
      applyAll();
    },

    isEnabled() {
      return enabled;
    },

    dispose() {
      clearAll();
      model = null;
      overwriteMaterial.dispose();
      edgesLineMaterial.dispose();
    },
  };
};

export const createOverwriteToggleHandler = ({
  overwriteEnabledRef,
  setOverwriteEnabled,
  overwriteMaterialControllerRef,
}) => {
  return () => {
    const nextValue = !overwriteEnabledRef.current;
    overwriteEnabledRef.current = nextValue;
    setOverwriteEnabled(nextValue);
    overwriteMaterialControllerRef.current?.setEnabled(nextValue);
  };
};

export const OverwriteMaterialToggle = ({
  enabled = false,
  onToggle,
  disabled = false,
}) => (
  <button
    type="button"
    onClick={onToggle}
    disabled={disabled}
    aria-label={
      enabled ? "Overwrite material enabled" : "Overwrite material disabled"
    }
    title={enabled ? "Overwrite material: ON" : "Overwrite material: OFF"}
    className="inline-flex h-8 w-8 items-center justify-center rounded border border-black/15 bg-white text-black/55 transition-colors hover:bg-black/[0.04] hover:text-black/75 disabled:pointer-events-none disabled:opacity-30 sm:h-10 sm:w-10"
  >
    {enabled ? (
      <BsCircleFill className="h-4 w-4 sm:h-5 sm:w-5" />
    ) : (
      <BsCircle className="h-4 w-4 sm:h-5 sm:w-5" />
    )}
  </button>
);
