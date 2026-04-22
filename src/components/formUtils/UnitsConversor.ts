export type DimensionUnit = "in" | "cm";

interface UnitLimits {
  min: number;
  max: number;
  step: number;
}

const INCH_TO_CM_FACTOR = 2.54;
const ROUND_PRECISION = 2;

export const DIMENSION_LIMITS_BY_UNIT: Record<DimensionUnit, UnitLimits> = {
  in: {
    min: 12,
    max: 90,
    step: 0.01,
  },
  cm: {
    min: 30.48,
    max: 228.6,
    step: 0.01,
  },
};

const roundToPrecision = (value: number, precision: number): number => {
  const factor = 10 ** precision;
  return Math.round(value * factor) / factor;
};

export const clampByUnit = (value: number, unit: DimensionUnit): number => {
  const limits = DIMENSION_LIMITS_BY_UNIT[unit];
  return Math.min(limits.max, Math.max(limits.min, value));
};

export const inchesToCm = (inches: number): number => {
  return roundToPrecision(inches * INCH_TO_CM_FACTOR, ROUND_PRECISION);
};

export const cmToInches = (centimeters: number): number => {
  return roundToPrecision(centimeters / INCH_TO_CM_FACTOR, ROUND_PRECISION);
};

export const normalizeToCm = (value: number, unit: DimensionUnit): number => {
  if (unit === "cm") {
    return roundToPrecision(clampByUnit(value, "cm"), ROUND_PRECISION);
  }

  return inchesToCm(clampByUnit(value, "in"));
};

export const convertDimensionValue = (
  value: number,
  fromUnit: DimensionUnit,
  toUnit: DimensionUnit,
): number => {
  if (fromUnit === toUnit) {
    return clampByUnit(value, toUnit);
  }

  if (fromUnit === "in" && toUnit === "cm") {
    return clampByUnit(inchesToCm(value), "cm");
  }

  return clampByUnit(cmToInches(value), "in");
};
