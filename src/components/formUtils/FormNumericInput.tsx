import type { ChangeEvent, FocusEvent, KeyboardEvent } from "react";

export type FormNumericInputUsage = "integer" | "decimal";
export type FormNumericInputClampMode = "none" | "hard";
export type FormNumericInputStyleType = "minimal" | "subtle";

interface FormNumericInputProps {
  value: number | undefined;
  onValueChange: (nextValue: number) => void;
  onCommitValue?: (nextValue: number) => void;
  onCommitBlur?: (nextValue: number) => void;
  min?: number;
  max?: number;
  step?: number;
  placeholder?: string;
  ariaLabel?: string;
  usage?: FormNumericInputUsage;
  clampMode?: FormNumericInputClampMode;
  styleType?: FormNumericInputStyleType;
  className?: string;
}

const STYLE_BY_TYPE: Record<FormNumericInputStyleType, string> = {
  minimal:
    "h-9 w-full rounded-md border border-slate-300 bg-white px-2 text-sm text-slate-900 outline-none [appearance:textfield] [-moz-appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-outer-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-inner-spin-button]:m-0 focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/40",
  subtle:
    "h-9 w-full rounded-md border border-slate-200 bg-slate-50 px-2 text-sm text-slate-800 outline-none [appearance:textfield] [-moz-appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-outer-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-inner-spin-button]:m-0 focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/40",
};

function clampValue(value: number, min?: number, max?: number) {
  let nextValue = value;

  if (typeof min === "number") {
    nextValue = Math.max(min, nextValue);
  }

  if (typeof max === "number") {
    nextValue = Math.min(max, nextValue);
  }

  return nextValue;
}

function normalizeByUsage(value: number, usage: FormNumericInputUsage) {
  if (usage === "integer") {
    return Math.trunc(value);
  }

  return value;
}

export function FormNumericInput({
  value,
  onValueChange,
  onCommitValue,
  onCommitBlur,
  min,
  max,
  step,
  placeholder,
  ariaLabel,
  usage = "integer",
  clampMode = "none",
  styleType = "minimal",
  className,
}: FormNumericInputProps) {
  const parseValue = (rawValue: string): number | null => {
    if (rawValue.trim() === "") {
      if (clampMode === "hard" && typeof min === "number") {
        return normalizeByUsage(min, usage);
      }

      return 0;
    }

    const parsedValue = Number(rawValue);

    if (Number.isNaN(parsedValue)) {
      return null;
    }

    let nextValue = normalizeByUsage(parsedValue, usage);

    if (clampMode === "hard") {
      nextValue = clampValue(nextValue, min, max);
    }

    return nextValue;
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const nextValue = parseValue(event.target.value);

    if (nextValue === null) {
      return;
    }

    onValueChange(nextValue);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== "Enter" || !onCommitValue) {
      return;
    }

    const nextValue = parseValue(event.currentTarget.value);

    if (nextValue === null) {
      return;
    }

    event.preventDefault();
    onCommitValue(nextValue);
  };

  const handleBlur = (event: FocusEvent<HTMLInputElement>) => {
    if (!onCommitBlur) {
      return;
    }

    const nextValue = parseValue(event.currentTarget.value);

    if (nextValue === null) {
      return;
    }

    onCommitBlur(nextValue);
  };

  const resolvedPlaceholder =
    placeholder ?? (typeof min === "number" ? String(min) : undefined);

  return (
    <input
      type="number"
      value={value ?? ""}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      onBlur={handleBlur}
      min={min}
      max={max}
      step={step}
      placeholder={resolvedPlaceholder}
      aria-label={ariaLabel}
      inputMode={usage === "decimal" ? "decimal" : "numeric"}
      className={`${STYLE_BY_TYPE[styleType]} ${className ?? ""}`.trim()}
    />
  );
}
