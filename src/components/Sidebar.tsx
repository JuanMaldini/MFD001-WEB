import { useMemo, useState, type ChangeEvent } from "react";
import { IoClose } from "react-icons/io5";
import {
  TbLayoutSidebarRight,
  TbLayoutSidebarRightFilled,
} from "react-icons/tb";
import type { IconType } from "react-icons";
import { PANEL_SHARED_UI } from "./constants/panelsConfig";
import {
  findInputPlaceholderKey,
  resolveInputPayload,
  type ItemPayload,
} from "./e3ds/payloadItemFactory";
import { FormNumericInput } from "./formUtils/FormNumericInput";
import {
  convertDimensionValue,
  DIMENSION_LIMITS_BY_UNIT,
  normalizeToCm,
  type DimensionUnit,
} from "./formUtils/UnitsConversor";
import {
  DIMENSIONS_ITEMS,
  MOVE_TO_DOOR,
  OPEN_DOOR_SLIDER,
  VISIBILITY_TOGGLE_MODEL,
} from "./payload";

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  onSelectItem: (payload: ItemPayload) => void;
}

interface DimensionRow {
  id: string;
  payload: ItemPayload;
  payloadKey: string;
  icon: IconType;
}

const DIMENSION_UNITS: DimensionUnit[] = ["in", "cm"];
const DEFAULT_INCH_VALUE = DIMENSION_LIMITS_BY_UNIT.in.min;

const createInitialDraftValues = (): Record<string, number> => {
  const initialValues: Record<string, number> = {};

  for (const item of DIMENSIONS_ITEMS) {
    const payloadKey = findInputPlaceholderKey(item.payload);

    if (payloadKey) {
      initialValues[payloadKey] = DEFAULT_INCH_VALUE;
    }
  }

  return initialValues;
};

const formatDimensionLabel = (payloadKey: string): string => {
  const baseKey = payloadKey.startsWith("p") ? payloadKey.slice(1) : payloadKey;
  return baseKey.charAt(0).toUpperCase() + baseKey.slice(1);
};

export function Sidebar({ isOpen, onToggle, onSelectItem }: SidebarProps) {
  const [dimensionUnit, setDimensionUnit] = useState<DimensionUnit>("in");
  const [isModelVisible, setIsModelVisible] = useState(false);
  const [isMovedToDoor, setIsMovedToDoor] = useState(false);
  const [openDoorAmount, setOpenDoorAmount] = useState(0);
  const [draftValues, setDraftValues] = useState<
    Record<string, number | undefined>
  >(() => createInitialDraftValues());

  const expandableStateClass = isOpen
    ? "max-w-full flex-[1_1_auto] opacity-100 translate-x-0 pointer-events-auto"
    : "max-w-0 flex-[0_0_0] opacity-0 translate-x-0 pointer-events-none";
  const rowGapClass = isOpen
    ? PANEL_SHARED_UI.panelInlineGapOpenClass
    : PANEL_SHARED_UI.panelInlineGapClosedClass;
  const toggleSlotStateClass = isOpen
    ? PANEL_SHARED_UI.sidebarToggleSlotOpenClass
    : PANEL_SHARED_UI.sidebarToggleSlotClosedClass;

  const activeLimits = DIMENSION_LIMITS_BY_UNIT[dimensionUnit];

  const dimensionRows = useMemo<DimensionRow[]>(() => {
    return DIMENSIONS_ITEMS.map((item) => {
      const payloadKey = findInputPlaceholderKey(item.payload);

      if (!payloadKey || item.display.kind !== "icon") {
        return null;
      }

      return {
        id: item.id,
        payload: item.payload,
        payloadKey,
        icon: item.display.icon,
      };
    }).filter((row): row is DimensionRow => row !== null);
  }, []);

  const visibilityOnItem = VISIBILITY_TOGGLE_MODEL[0];
  const visibilityOffItem =
    VISIBILITY_TOGGLE_MODEL[1] ?? VISIBILITY_TOGGLE_MODEL[0];
  const moveToDoorOnItem = MOVE_TO_DOOR[0];
  const moveToDoorOffItem = MOVE_TO_DOOR[1] ?? MOVE_TO_DOOR[0];
  const openDoorSliderItem = OPEN_DOOR_SLIDER[0];

  const visibilityItem = isModelVisible ? visibilityOnItem : visibilityOffItem;
  const moveToDoorItem = isMovedToDoor ? moveToDoorOnItem : moveToDoorOffItem;
  const VisibilityIcon =
    visibilityItem?.display.kind === "icon"
      ? visibilityItem.display.icon
      : null;
  const MoveToDoorIcon =
    moveToDoorItem?.display.kind === "icon"
      ? moveToDoorItem.display.icon
      : null;

  const handleUnitChange = (nextUnit: DimensionUnit) => {
    if (nextUnit === dimensionUnit) {
      return;
    }

    setDraftValues((previousValues) => {
      const nextValues: Record<string, number | undefined> = {};

      for (const [payloadKey, value] of Object.entries(previousValues)) {
        nextValues[payloadKey] =
          typeof value === "number"
            ? convertDimensionValue(value, dimensionUnit, nextUnit)
            : value;
      }

      return nextValues;
    });

    setDimensionUnit(nextUnit);
  };

  const handleDraftValueChange = (
    payloadKey: string,
    nextValue: number | undefined,
  ) => {
    setDraftValues((previousValues) => ({
      ...previousValues,
      [payloadKey]: nextValue,
    }));
  };

  const handleMoveToDoor = () => {
    const nextMovedToDoor = !isMovedToDoor;
    const nextMoveToDoorItem = nextMovedToDoor
      ? moveToDoorOnItem
      : moveToDoorOffItem;

    if (!nextMoveToDoorItem) {
      return;
    }

    onSelectItem(nextMoveToDoorItem.payload);
    setIsMovedToDoor(nextMovedToDoor);
  };

  const handleVisibilityToggle = () => {
    const nextVisible = !isModelVisible;
    const nextVisibilityItem = nextVisible
      ? visibilityOnItem
      : visibilityOffItem;

    if (!nextVisibilityItem) {
      return;
    }

    onSelectItem(nextVisibilityItem.payload);
    setIsModelVisible(nextVisible);
  };

  const handleOpenDoorAmountChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (!openDoorSliderItem) {
      return;
    }

    const parsedValue = Number(event.target.value);
    if (!Number.isFinite(parsedValue)) {
      return;
    }

    const clampedValue = Math.min(1, Math.max(0, parsedValue));
    const roundedValue = Math.round(clampedValue * 100) / 100;

    setOpenDoorAmount(roundedValue);
    onSelectItem(resolveInputPayload(openDoorSliderItem.payload, roundedValue));
  };

  const commitDimensionValue = (
    payload: ItemPayload,
    payloadKey: string,
    nextValue: number,
  ) => {
    const clampedValue = Math.min(
      activeLimits.max,
      Math.max(activeLimits.min, nextValue),
    );
    const normalizedCmValue = normalizeToCm(clampedValue, dimensionUnit);

    setDraftValues((previousValues) => ({
      ...previousValues,
      [payloadKey]: clampedValue,
    }));

    onSelectItem(resolveInputPayload(payload, normalizedCmValue));
  };

  return (
    <div className="h-auto w-fit max-w-full overflow-hidden bg-transparent text-white pointer-events-none">
      <div
        className={
          "flex min-w-0 flex-row items-center justify-end px-2 pointer-events-none " +
          PANEL_SHARED_UI.expandableTransitionClass +
          " " +
          rowGapClass
        }
      >
        <div
          className={
            "max-w-full overflow-hidden " +
            PANEL_SHARED_UI.expandableTransitionClass +
            " " +
            expandableStateClass
          }
        >
          <div className="w-fit min-w-[250px] max-w-full overflow-hidden rounded border border-white bg-transparent">
            <div className="flex items-center justify-between gap-2 px-2 py-2">
              <h2 className="text-right text-sm font-semibold">
                Design Planner
              </h2>
              <button
                type="button"
                onClick={onToggle}
                className={
                  PANEL_SHARED_UI.closeButtonClass + " pointer-events-auto"
                }
                aria-label="Close panel"
              >
                <IoClose className="h-[18px] w-[18px] text-white" />
              </button>
            </div>

            <div className="border-t border-white px-2 py-2">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-1.5">
                  <p className="text-xs">Dimensions</p>
                  <div className="flex min-w-0 flex-wrap items-center justify-end gap-1">
                    <button
                      type="button"
                      onClick={handleMoveToDoor}
                      aria-label={
                        isMovedToDoor
                          ? "Return model from door"
                          : "Move model to door"
                      }
                      aria-pressed={isMovedToDoor}
                      className={
                        PANEL_SHARED_UI.sidebarOptionButtonClass +
                        " pointer-events-auto"
                      }
                    >
                      {MoveToDoorIcon ? (
                        <MoveToDoorIcon
                          className="h-[14px] w-[14px] text-white"
                          aria-hidden
                        />
                      ) : null}
                    </button>

                    <button
                      type="button"
                      onClick={handleVisibilityToggle}
                      aria-label={isModelVisible ? "Hide model" : "Show model"}
                      aria-pressed={isModelVisible}
                      className={
                        PANEL_SHARED_UI.sidebarOptionButtonClass +
                        " pointer-events-auto"
                      }
                    >
                      {VisibilityIcon ? (
                        <VisibilityIcon
                          className="h-[14px] w-[14px] text-white"
                          aria-hidden
                        />
                      ) : null}
                    </button>

                    <div className="flex items-center gap-1 rounded border border-white/40 p-[2px]">
                      {DIMENSION_UNITS.map((unit) => {
                        const isActive = dimensionUnit === unit;

                        return (
                          <button
                            key={unit}
                            type="button"
                            onClick={() => handleUnitChange(unit)}
                            aria-pressed={isActive}
                            className={
                              "pointer-events-auto rounded px-1.5 py-0 text-[9px] font-semibold uppercase tracking-wide transition-all " +
                              (isActive
                                ? "bg-white text-black"
                                : "text-white/80 hover:bg-white/[0.16] hover:text-white")
                            }
                          >
                            {unit}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
                
                <div className="space-y-1.5">
                  <div className="grid grid-cols-[56px_minmax(0,1fr)] items-center gap-2">
                    <span className="text-xs text-white/85">Open</span>
                    <input
                      type="range"
                      min={0}
                      max={1}
                      step={0.01}
                      value={openDoorAmount}
                      onChange={handleOpenDoorAmountChange}
                      aria-label="Open"
                      className="pointer-events-auto h-2 w-full cursor-pointer accent-white"
                    />
                  </div>

                </div>

                <div className="space-y-1.5">
                  {dimensionRows.map((row) => (
                    <div
                      key={row.id}
                      className="grid grid-cols-[18px_minmax(0,1fr)] items-center gap-2"
                    >
                      <row.icon
                        className="h-[18px] w-[18px] text-white/85"
                        aria-hidden
                      />
                      <FormNumericInput
                        value={draftValues[row.payloadKey]}
                        onValueChange={(nextValue) =>
                          handleDraftValueChange(row.payloadKey, nextValue)
                        }
                        onCommitValue={(nextValue) =>
                          commitDimensionValue(
                            row.payload,
                            row.payloadKey,
                            nextValue,
                          )
                        }
                        onCommitBlur={(nextValue) =>
                          commitDimensionValue(
                            row.payload,
                            row.payloadKey,
                            nextValue,
                          )
                        }
                        min={activeLimits.min}
                        max={activeLimits.max}
                        step={activeLimits.step}
                        usage="decimal"
                        clampMode="none"
                        styleType="minimal"
                        placeholder=""
                        ariaLabel={`${formatDimensionLabel(row.payloadKey)} ${dimensionUnit}`}
                        className="pointer-events-auto h-8 w-1/2 min-w-[96px] border-white/40 bg-white/[0.08] px-2 text-xs text-white placeholder:text-white/45 focus:border-emerald-400 focus:ring-emerald-400/40"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          className={
            "shrink-0 overflow-hidden " +
            PANEL_SHARED_UI.expandableTransitionClass +
            " " +
            toggleSlotStateClass
          }
        >
          <button
            type="button"
            onClick={onToggle}
            className={
              PANEL_SHARED_UI.toggleButtonClass + " pointer-events-auto"
            }
            aria-label={isOpen ? "Collapse panel" : "Expand panel"}
          >
            {!isOpen ? (
              <TbLayoutSidebarRightFilled
                className={PANEL_SHARED_UI.toggleIconSizeClass}
              />
            ) : (
              <TbLayoutSidebarRight
                className={PANEL_SHARED_UI.toggleIconSizeClass}
              />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
