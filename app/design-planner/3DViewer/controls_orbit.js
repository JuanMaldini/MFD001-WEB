import React, { useCallback, useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import LoaderViewer from "./components/LoaderViewer";
import {
  applyOrbitPinchZoom,
  applyOrbitWheelZoom,
  resolveSlideOrbitDistance,
} from "./components/orbitZoom";
import { createOverwriteMaterialController } from "./components/OverwriteMaterial";
import { createScreenshotRequestHandler } from "./components/Screenshot";

const GLB_MAX_RETRIES = 2;
const GLB_RETRY_DELAY_MS = 700;
const NOISELESS_GLB_URL = "/models/tonomeet20.glb";
const toNormalizedDirectionVector = (direction) => {
  const vector = new THREE.Vector3(
    Number(direction?.x || 0),
    Number(direction?.y || 0),
    Number(direction?.z || -1),
  );

  if (vector.lengthSq() < 1e-6) {
    return new THREE.Vector3(0, 0, -1);
  }

  return vector.normalize();
};

const toDirectionFromRotation = (rotation) => {
  const euler = new THREE.Euler(
    Number(rotation?.x || 0),
    Number(rotation?.y || 0),
    Number(rotation?.z || 0),
    "YXZ",
  );

  return new THREE.Vector3(0, 0, -1).applyEuler(euler).normalize();
};

export const DEFAULT_ORBIT_CAROUSEL_ITEMS = [
  {
    title: "1",
    position: { x: -13.605, y: 9.982, z: 40.977 },
    rotation: { x: 0, y: -0.349, z: 0 },
    distance: 42.34,
  },
  {
    title: "2",
    position: { x: 17.227, y: 12.523, z: 34.479 },
    rotation: { x: -0.07, y: 0.475, z: 0 },
    distance: 36.442,
  },
  {
    title: "3",
    position: { x: -4.982, y: 14.259, z: 15.188 },
    rotation: { x: -0.293, y: -0.405, z: 0 },
    distance: 14.816,
  },
  {
    title: "4",
    position: { x: 17.227, y: 31.921, z: 21.393 },
    rotation: { x: -0.642, y: 0.684, z: 0 },
    distance: 20,
  },
];

const INITIAL_ORBIT_ITEM = DEFAULT_ORBIT_CAROUSEL_ITEMS[0] ?? {};
const INITIAL_ORBIT_POSITION = {
  x: Number(INITIAL_ORBIT_ITEM.position?.x || 0),
  y: Number(INITIAL_ORBIT_ITEM.position?.y || 0),
  z: Number(INITIAL_ORBIT_ITEM.position?.z || 0),
};

function Controls_Orbit({ onReady, onOverwriteChange } = {}) {
  const containerRef = useRef(null);
  const overwriteMaterialControllerRef = useRef(null);
  const rendererRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const orbitControlsRef = useRef(null);
  const handleActiveSlideChangeRef = useRef(() => {});
  const [overwriteEnabled, setOverwriteEnabled] = useState(false);
  const [isModelLoading, setIsModelLoading] = useState(true);
  const [modelLoadError, setModelLoadError] = useState(false);
  const [loadedBytes, setLoadedBytes] = useState(0);
  const [totalBytes, setTotalBytes] = useState(0);
  const overwriteEnabledRef = useRef(false);

  const handleActiveSlideChange = useCallback(({ slide }) => {
    handleActiveSlideChangeRef.current({ slide });
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) {
      return undefined;
    }

    let loadedModel = null;
    let isDisposed = false;
    const gltfLoader = new GLTFLoader();
    const sampleGlbCandidates = [NOISELESS_GLB_URL];
    const targetModelHeight = 24;

    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0xcccccc);
    scene.fog = new THREE.FogExp2(0xcccccc, 0.002);
    const overwriteMaterialController = createOverwriteMaterialController();
    overwriteMaterialControllerRef.current = overwriteMaterialController;
    overwriteMaterialController.setScene(scene);
    overwriteMaterialController.setEnabled(overwriteEnabledRef.current);

    const camera = new THREE.PerspectiveCamera(
      60,
      container.clientWidth / container.clientHeight,
      1,
      1000,
    );
    cameraRef.current = camera;
    camera.position.set(
      INITIAL_ORBIT_POSITION.x,
      INITIAL_ORBIT_POSITION.y,
      INITIAL_ORBIT_POSITION.z,
    );

    const isTouchDevice =
      window.matchMedia("(pointer: coarse)").matches ||
      navigator.maxTouchPoints > 0;
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      preserveDrawingBuffer: true,
    });
    rendererRef.current = renderer;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    orbitControlsRef.current = controls;
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.screenSpacePanning = false;
    controls.enableZoom = false;
    controls.minDistance = 2;
    controls.maxDistance = 6000;
    controls.maxPolarAngle = Math.PI / 2;
    const hitRaycaster = new THREE.Raycaster();
    const hitPointerNdc = new THREE.Vector2();
    const hitPoint = new THREE.Vector3();
    const smoothTravel = {
      active: false,
      startTime: 0,
      duration: 520,
      startTarget: new THREE.Vector3(),
      endTarget: new THREE.Vector3(),
    };
    const smoothSlidePose = {
      active: false,
      startTime: 0,
      duration: 620,
      startPosition: new THREE.Vector3(),
      endPosition: new THREE.Vector3(),
      startTarget: new THREE.Vector3(),
      endTarget: new THREE.Vector3(),
    };
    const pointerGesture = {
      active: false,
      pointerId: null,
      startX: 0,
      startY: 0,
      latestX: 0,
      latestY: 0,
      moved: false,
      pointerType: "",
      startTime: 0,
    };
    let lastTapTime = 0;
    let lastTapX = 0;
    let lastTapY = 0;
    let lastMouseClickTime = 0;
    let lastMouseClickX = 0;
    let lastMouseClickY = 0;

    const activeTouchPoints = new Map();
    const pinchGesture = {
      previousPinchDistance: 0,
    };

    handleActiveSlideChangeRef.current = ({ slide }) => {
      if (!slide?.position) {
        return;
      }

      // Si hay una animación en curso, completarla inmediatamente antes de iniciar la nueva
      if (smoothSlidePose.active) {
        camera.position.copy(smoothSlidePose.endPosition);
        controls.target.copy(smoothSlidePose.endTarget);
        smoothSlidePose.active = false;
      }

      const nextPosition = new THREE.Vector3(
        Number(slide.position.x || 0),
        Number(slide.position.y || 0),
        Number(slide.position.z || 0),
      );
      const nextDirection = slide.rotation
        ? toDirectionFromRotation(slide.rotation)
        : toNormalizedDirectionVector(slide.direction);
      const cameraDistance = resolveSlideOrbitDistance({
        slideDistance: slide.distance,
        camera,
        target: controls.target,
        minDistance: controls.minDistance,
        maxDistance: controls.maxDistance,
      });
      const nextTarget = nextPosition
        .clone()
        .add(nextDirection.multiplyScalar(cameraDistance));

      smoothTravel.active = false;
      smoothSlidePose.startPosition.copy(camera.position);
      smoothSlidePose.endPosition.copy(nextPosition);
      smoothSlidePose.startTarget.copy(controls.target);
      smoothSlidePose.endTarget.copy(nextTarget);
      smoothSlidePose.startTime = performance.now();
      smoothSlidePose.active = true;
    };

    const getTouchDistance = () => {
      if (activeTouchPoints.size !== 2) {
        return 0;
      }

      const points = Array.from(activeTouchPoints.values());
      const dx = points[0].x - points[1].x;
      const dy = points[0].y - points[1].y;
      return Math.sqrt(dx * dx + dy * dy);
    };

    const tryStartTravelToScreenPoint = (clientX, clientY) => {
      if (!loadedModel) {
        return;
      }

      const rect = renderer.domElement.getBoundingClientRect();
      if (!rect.width || !rect.height) {
        return;
      }

      hitPointerNdc.x = ((clientX - rect.left) / rect.width) * 2 - 1;
      hitPointerNdc.y = -((clientY - rect.top) / rect.height) * 2 + 1;

      hitRaycaster.setFromCamera(hitPointerNdc, camera);
      const hits = hitRaycaster.intersectObject(loadedModel, true);

      if (!hits.length) {
        return;
      }

      hitPoint.copy(hits[0].point);
      smoothTravel.startTarget.copy(controls.target);
      smoothTravel.endTarget.copy(hitPoint);
      smoothTravel.startTime = performance.now();
      smoothTravel.active = true;
    };

    const onWheel = (event) => {
      applyOrbitWheelZoom({
        camera,
        target: controls.target,
        deltaY: event.deltaY,
        minDistance: controls.minDistance,
        maxDistance: controls.maxDistance,
      });
      event.preventDefault();
    };

    const onKeyDown = (_event) => {
      // reserved for future key bindings
    };

    const onPointerDown = (event) => {
      pointerGesture.active = true;
      pointerGesture.pointerId = event.pointerId;
      pointerGesture.startX = event.clientX;
      pointerGesture.startY = event.clientY;
      pointerGesture.latestX = event.clientX;
      pointerGesture.latestY = event.clientY;
      pointerGesture.moved = false;
      pointerGesture.pointerType = event.pointerType;
      pointerGesture.startTime = performance.now();

      if (event.pointerType !== "touch") {
        return;
      }

      activeTouchPoints.set(event.pointerId, {
        x: event.clientX,
        y: event.clientY,
      });
      if (activeTouchPoints.size === 2) {
        pinchGesture.previousPinchDistance = getTouchDistance();
      }
    };

    const onPointerMove = (event) => {
      if (
        pointerGesture.active &&
        pointerGesture.pointerId === event.pointerId
      ) {
        pointerGesture.latestX = event.clientX;
        pointerGesture.latestY = event.clientY;
        const dx = event.clientX - pointerGesture.startX;
        const dy = event.clientY - pointerGesture.startY;
        if (!pointerGesture.moved && dx * dx + dy * dy > 64) {
          pointerGesture.moved = true;
        }
      }

      if (event.pointerType !== "touch") {
        return;
      }

      if (!activeTouchPoints.has(event.pointerId)) {
        return;
      }

      activeTouchPoints.set(event.pointerId, {
        x: event.clientX,
        y: event.clientY,
      });

      if (activeTouchPoints.size !== 2) {
        pinchGesture.previousPinchDistance = 0;
        return;
      }

      const pinchDistance = getTouchDistance();
      applyOrbitPinchZoom({
        camera,
        target: controls.target,
        previousPinchDistance: pinchGesture.previousPinchDistance,
        pinchDistance,
        minDistance: controls.minDistance,
        maxDistance: controls.maxDistance,
      });
      pinchGesture.previousPinchDistance = pinchDistance;
      event.preventDefault();
    };

    const onPointerEnd = (event) => {
      if (
        pointerGesture.active &&
        pointerGesture.pointerId === event.pointerId
      ) {
        const now = performance.now();
        const tapDuration = now - pointerGesture.startTime;
        const isTapLike = !pointerGesture.moved && tapDuration < 300;

        if (isTapLike && pointerGesture.pointerType === "mouse") {
          const dx = pointerGesture.latestX - lastMouseClickX;
          const dy = pointerGesture.latestY - lastMouseClickY;
          const nearPreviousClick = dx * dx + dy * dy <= 36 * 36;
          const isDoubleClick =
            now - lastMouseClickTime > 0 &&
            now - lastMouseClickTime < 340 &&
            nearPreviousClick;

          if (isDoubleClick) {
            tryStartTravelToScreenPoint(
              pointerGesture.latestX,
              pointerGesture.latestY,
            );
          }

          lastMouseClickTime = now;
          lastMouseClickX = pointerGesture.latestX;
          lastMouseClickY = pointerGesture.latestY;
        }

        if (isTapLike && pointerGesture.pointerType === "touch") {
          const dx = pointerGesture.latestX - lastTapX;
          const dy = pointerGesture.latestY - lastTapY;
          const nearPreviousTap = dx * dx + dy * dy <= 36 * 36;
          const isDoubleTap =
            now - lastTapTime > 0 && now - lastTapTime < 340 && nearPreviousTap;

          if (isDoubleTap && activeTouchPoints.size <= 1) {
            tryStartTravelToScreenPoint(
              pointerGesture.latestX,
              pointerGesture.latestY,
            );
          }

          lastTapTime = now;
          lastTapX = pointerGesture.latestX;
          lastTapY = pointerGesture.latestY;
        }

        pointerGesture.active = false;
        pointerGesture.pointerId = null;
      }

      if (event.pointerType !== "touch") {
        return;
      }

      activeTouchPoints.delete(event.pointerId);
      if (activeTouchPoints.size < 2) {
        pinchGesture.previousPinchDistance = 0;
      }
    };

    const dirLight1 = new THREE.DirectionalLight(0xffffff, 3);
    dirLight1.position.set(1, 1, 1);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x002288, 3);
    dirLight2.position.set(-1, -1, -1);
    scene.add(dirLight2);

    const ambientLight = new THREE.AmbientLight(0x555555);
    scene.add(ambientLight);

    const loadSampleModel = (candidateIndex = 0, retryAttempt = 0) => {
      if (candidateIndex >= sampleGlbCandidates.length) {
        if (!isDisposed) {
          setIsModelLoading(false);
          setModelLoadError(true);
        }
        return;
      }

      if (!isDisposed) {
        setIsModelLoading(true);
        setModelLoadError(false);
        setLoadedBytes(0);
        setTotalBytes(0);
      }

      const baseGlbUrl = sampleGlbCandidates[candidateIndex];
      const sampleGlbUrl =
        retryAttempt > 0
          ? `${baseGlbUrl}${baseGlbUrl.includes("?") ? "&" : "?"}retry=${retryAttempt}`
          : baseGlbUrl;

      gltfLoader.load(
        sampleGlbUrl,
        (gltf) => {
          if (isDisposed) {
            return;
          }

          const model = gltf.scene;
          loadedModel = model;

          model.traverse((node) => {
            if (!node.isMesh) {
              return;
            }

            if (!node.material) {
              return;
            }

            if (Array.isArray(node.material)) {
              node.material.forEach((materialItem) => {
                materialItem.side = THREE.DoubleSide;
                materialItem.needsUpdate = true;
              });
              return;
            }

            node.material.side = THREE.DoubleSide;
            node.material.needsUpdate = true;
          });

          const modelBox = new THREE.Box3().setFromObject(model);
          const modelSize = new THREE.Vector3();
          modelBox.getSize(modelSize);

          if (modelSize.y > 0) {
            const scaleFactor = targetModelHeight / modelSize.y;
            model.scale.setScalar(scaleFactor);
          }

          model.updateMatrixWorld(true);
          modelBox.setFromObject(model);

          const modelCenter = new THREE.Vector3();
          modelBox.getCenter(modelCenter);

          model.position.x -= modelCenter.x;
          model.position.z -= modelCenter.z;
          model.position.y -= modelBox.min.y;

          scene.add(model);
          model.updateMatrixWorld(true);
          overwriteMaterialController.setModel(model);

          const finalBox = new THREE.Box3().setFromObject(model);
          const finalCenter = new THREE.Vector3();
          const finalSize = new THREE.Vector3();
          const finalSphere = new THREE.Sphere();
          finalBox.getCenter(finalCenter);
          finalBox.getSize(finalSize);
          finalBox.getBoundingSphere(finalSphere);

          const radius = Math.max(finalSphere.radius, 1);
          const distance = radius * 2.2;
          const viewDirection = new THREE.Vector3(1, 0.7, 1).normalize();
          const cameraPosition = finalCenter
            .clone()
            .add(viewDirection.multiplyScalar(distance));

          camera.position.copy(cameraPosition);
          camera.near = 0.1;
          camera.far = Math.max(5000, distance * 40);
          camera.updateProjectionMatrix();

          controls.target.copy(finalCenter);
          controls.minDistance = Math.max(0.5, radius * 0.02);
          controls.maxDistance = Math.max(100, radius * 1);
          camera.lookAt(finalCenter);
          controls.update();

          if (INITIAL_ORBIT_ITEM.position) {
            handleActiveSlideChangeRef.current({
              slide: INITIAL_ORBIT_ITEM,
            });
          }

          setIsModelLoading(false);
          setModelLoadError(false);
        },
        (event) => {
          if (isDisposed) {
            return;
          }

          const nextLoaded = Number(event?.loaded || 0);
          const nextTotal = Number(event?.total || 0);
          setLoadedBytes(nextLoaded);
          setTotalBytes(nextTotal > 0 ? nextTotal : 0);
        },
        (error) => {
          if (isDisposed) {
            return;
          }

          const statusCode = Number(error?.target?.status || 0);
          const isGatewayError = statusCode === 502;
          const canRetry = retryAttempt < GLB_MAX_RETRIES;

          if (isGatewayError && canRetry) {
            const nextAttempt = retryAttempt + 1;
            window.setTimeout(() => {
              loadSampleModel(candidateIndex, nextAttempt);
            }, GLB_RETRY_DELAY_MS * nextAttempt);
            return;
          }

          if (candidateIndex < sampleGlbCandidates.length - 1) {
            loadSampleModel(candidateIndex + 1);
            return;
          }

          setIsModelLoading(false);
          setModelLoadError(true);
        },
      );
    };

    loadSampleModel();

    let prevTime = performance.now();

    const onWindowResize = () => {
      if (!containerRef.current) {
        return;
      }
      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    const animate = () => {
      const time = performance.now();

      controls.enabled = true;

      if (smoothTravel.active) {
        const t = Math.min(
          (time - smoothTravel.startTime) / smoothTravel.duration,
          1,
        );
        const eased = t * (2 - t);
        const nextTarget = smoothTravel.startTarget
          .clone()
          .lerp(smoothTravel.endTarget, eased);
        const travelDelta = nextTarget.sub(controls.target);

        if (travelDelta.lengthSq() > 0) {
          controls.target.add(travelDelta);
          camera.position.add(travelDelta);
        }

        if (t >= 1) {
          smoothTravel.active = false;
        }
      }

      if (smoothSlidePose.active) {
        const t = Math.min(
          (time - smoothSlidePose.startTime) / smoothSlidePose.duration,
          1,
        );
        const eased = t * (2 - t);

        camera.position.lerpVectors(
          smoothSlidePose.startPosition,
          smoothSlidePose.endPosition,
          eased,
        );
        controls.target.lerpVectors(
          smoothSlidePose.startTarget,
          smoothSlidePose.endTarget,
          eased,
        );

        if (t >= 1) {
          smoothSlidePose.active = false;
        }
      }

      controls.update();
      renderer.render(scene, camera);
      prevTime = time;
    };

    renderer.setAnimationLoop(animate);
    window.addEventListener("keydown", onKeyDown);
    renderer.domElement.addEventListener("pointerdown", onPointerDown, {
      passive: true,
    });
    renderer.domElement.addEventListener("pointermove", onPointerMove, {
      passive: false,
    });
    renderer.domElement.addEventListener("pointerup", onPointerEnd, {
      passive: true,
    });
    renderer.domElement.addEventListener("pointercancel", onPointerEnd, {
      passive: true,
    });
    renderer.domElement.addEventListener("wheel", onWheel, {
      passive: false,
    });
    window.addEventListener("resize", onWindowResize);

    return () => {
      isDisposed = true;
      window.removeEventListener("keydown", onKeyDown);
      renderer.domElement.removeEventListener("pointerdown", onPointerDown);
      renderer.domElement.removeEventListener("pointermove", onPointerMove);
      renderer.domElement.removeEventListener("pointerup", onPointerEnd);
      renderer.domElement.removeEventListener("pointercancel", onPointerEnd);
      renderer.domElement.removeEventListener("wheel", onWheel);
      window.removeEventListener("resize", onWindowResize);
      renderer.setAnimationLoop(null);
      controls.dispose();
      if (loadedModel) {
        scene.remove(loadedModel);
      }
      overwriteMaterialController.dispose();
      overwriteMaterialControllerRef.current = null;
      handleActiveSlideChangeRef.current = () => {};
      orbitControlsRef.current = null;
      sceneRef.current = null;
      cameraRef.current = null;
      rendererRef.current = null;
      renderer.dispose();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  const handleRequestScreenshot = createScreenshotRequestHandler({
    rendererRef,
    sceneRef,
    cameraRef,
  });

  const handleToggleOverwrite = useCallback(() => {
    const nextValue = !overwriteEnabledRef.current;
    overwriteEnabledRef.current = nextValue;
    setOverwriteEnabled(nextValue);
    overwriteMaterialControllerRef.current?.setEnabled(nextValue);
    onOverwriteChange?.(nextValue);
  }, [onOverwriteChange]);

  useEffect(() => {
    onReady?.({
      handleActiveSlideChange,
      handleToggleOverwrite,
      handleRequestScreenshot,
      cameraRef,
      orbitControlsRef,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return React.createElement(
    "div",
    {
      ref: containerRef,
      style: {
        width: "100%",
        height: "100%",
        position: "relative",
        overflow: "hidden",
        touchAction: "none",
      },
    },
    React.createElement(LoaderViewer, {
      visible: isModelLoading || modelLoadError,
      loadedBytes,
      totalBytes,
      hasError: modelLoadError,
    }),
  );
}

export default Controls_Orbit;
