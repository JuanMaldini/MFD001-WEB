export type DimensionUnit = "in" | "cm";

interface UnitLimits {
  min: number;
  max: number;
  step: number;
}

interface ConstraintCm {
  min: number;
  max: number;
}

const INCH_TO_CM_FACTOR = 2.54;
const ROUND_PRECISION = 2;
const DIMENSION_STEP = 1;

/**
 * Per-field dimension constraints, in centimeters.
 *
 * Source of truth: Unreal data asset
 * /Game/Blueprint/data/DA_AcoustiClear (class BP_Constraints_C).
 *   - pHeight: CeilingHeightMin (200.66) .. CeilingHeightMax (365.76)
 *   - pWidth : MinPanelCountAllowed(5) * PanelWidthMin(71) = 355
 *             .. InstallationWidthMax (958.32)
 *
 * Keep these values in sync with the DA if it changes in Unreal.
 */
export const DIMENSION_CONSTRAINTS_CM: Record<string, ConstraintCm> = {
  pHeight: { min: 200.66, max: 365.76 },
  pWidth: { min: 355, max: 958.32 },
};

const DEFAULT_CONSTRAINT_CM: ConstraintCm = {
  min: 0,
  max: Number.POSITIVE_INFINITY,
};

const roundToPrecision = (value: number, precision: number): number => {
  const factor = 10 ** precision;
  return Math.round(value * factor) / factor;
};

export const inchesToCm = (inches: number): number => {
  return roundToPrecision(inches * INCH_TO_CM_FACTOR, ROUND_PRECISION);
};

export const cmToInches = (centimeters: number): number => {
  return roundToPrecision(centimeters / INCH_TO_CM_FACTOR, ROUND_PRECISION);
};

const getConstraintCm = (payloadKey: string): ConstraintCm => {
  return DIMENSION_CONSTRAINTS_CM[payloadKey] ?? DEFAULT_CONSTRAINT_CM;
};

/**
 * Resolve the min/max/step limits for a given field, expressed in the
 * requested unit. cm values come straight from the DA; inch values are
 * converted from those cm constraints.
 */
export const getDimensionLimits = (
  payloadKey: string,
  unit: DimensionUnit,
): UnitLimits => {
  const constraint = getConstraintCm(payloadKey);

  if (unit === "cm") {
    return {
      min: roundToPrecision(constraint.min, ROUND_PRECISION),
      max: roundToPrecision(constraint.max, ROUND_PRECISION),
      step: DIMENSION_STEP,
    };
  }

  return {
    min: cmToInches(constraint.min),
    max: cmToInches(constraint.max),
    step: DIMENSION_STEP,
  };
};

export const clampByUnit = (
  value: number,
  unit: DimensionUnit,
  payloadKey: string,
): number => {
  const limits = getDimensionLimits(payloadKey, unit);
  return Math.min(limits.max, Math.max(limits.min, value));
};

export const normalizeToCm = (
  value: number,
  unit: DimensionUnit,
  payloadKey: string,
): number => {
  if (unit === "cm") {
    return roundToPrecision(clampByUnit(value, "cm", payloadKey), ROUND_PRECISION);
  }

  return inchesToCm(clampByUnit(value, "in", payloadKey));
};

export const convertDimensionValue = (
  value: number,
  fromUnit: DimensionUnit,
  toUnit: DimensionUnit,
  payloadKey: string,
): number => {
  if (fromUnit === toUnit) {
    return clampByUnit(value, toUnit, payloadKey);
  }

  if (fromUnit === "in" && toUnit === "cm") {
    return clampByUnit(inchesToCm(value), "cm", payloadKey);
  }

  return clampByUnit(cmToInches(value), "in", payloadKey);
};
