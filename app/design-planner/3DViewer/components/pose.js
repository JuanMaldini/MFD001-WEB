import * as THREE from "three";

const toRoundedValue = (value) => Number(Number(value || 0).toFixed(3));

export const toRotationFromDirection = (direction) => {
  const vector = new THREE.Vector3(
    Number(direction?.x || 0),
    Number(direction?.y || 0),
    Number(direction?.z || -1),
  );

  if (vector.lengthSq() < 1e-6) {
    vector.set(0, 0, -1);
  } else {
    vector.normalize();
  }

  const lookMatrix = new THREE.Matrix4().lookAt(
    new THREE.Vector3(0, 0, 0),
    vector,
    new THREE.Vector3(0, 1, 0),
  );
  const euler = new THREE.Euler().setFromRotationMatrix(lookMatrix, "YXZ");

  return {
    x: toRoundedValue(euler.x),
    y: toRoundedValue(euler.y),
    z: toRoundedValue(euler.z),
  };
};

export const toNormalizedPosition = (position) => ({
  x: toRoundedValue(position?.x),
  y: toRoundedValue(position?.y),
  z: toRoundedValue(position?.z),
});

export const toNormalizedRotation = (rotation) => ({
  x: toRoundedValue(rotation?.x),
  y: toRoundedValue(rotation?.y),
  z: toRoundedValue(rotation?.z),
});

export const toNormalizedDistance = (distance) => {
  const value = Number(distance);
  if (!Number.isFinite(value)) return undefined;
  return toRoundedValue(Math.max(0, value));
};

const toDirectionFromRotation = (rotation) => {
  const euler = new THREE.Euler(
    Number(rotation?.x || 0),
    Number(rotation?.y || 0),
    Number(rotation?.z || 0),
    "YXZ",
  );
  const direction = new THREE.Vector3(0, 0, -1).applyEuler(euler).normalize();
  return {
    x: toRoundedValue(direction.x),
    y: toRoundedValue(direction.y),
    z: toRoundedValue(direction.z),
  };
};

export const normalizeCarouselSlide = (slide, index) => {
  const title =
    typeof slide?.title === "string" ? slide.title : `Slide ${index + 1}`;
  const position = toNormalizedPosition(slide?.position);
  const rotation = slide?.rotation
    ? toNormalizedRotation(slide.rotation)
    : toRotationFromDirection(slide?.direction);
  const direction = toDirectionFromRotation(rotation);
  const distance = toNormalizedDistance(slide?.distance);
  return {
    title,
    position,
    rotation,
    direction,
    distance,
    id: slide?.id ?? JSON.stringify({ title, position, rotation, distance }),
  };
};

export const normalizeCarouselSlides = (slides) =>
  slides.map((slide, index) => normalizeCarouselSlide(slide, index));

export const createCurrentPlayerSlide = (currentPose) => {
  if (!currentPose?.position) {
    return null;
  }

  const distanceValue = Number(currentPose?.distance);

  return {
    title: "current",
    position: {
      x: toRoundedValue(currentPose.position?.x),
      y: toRoundedValue(currentPose.position?.y),
      z: toRoundedValue(currentPose.position?.z),
    },
    rotation: toRotationFromDirection(currentPose.lookDirection),
    distance: Number.isFinite(distanceValue)
      ? toRoundedValue(Math.max(0, distanceValue))
      : undefined,
  };
};
