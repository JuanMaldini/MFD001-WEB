import { useEffect, useMemo, useRef, useState } from "react";
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
  type PayloadItem,
} from "./e3ds/payloadItemFactory";
import { FormNumericInput } from "./formUtils/FormNumericInput";
import {
  convertDimensionValue,
  getDimensionLimits,
  normalizeToCm,
  type DimensionUnit,
} from "./formUtils/UnitsConversor";
import {
  DIMENSIONS_ITEMS,
  MODULES_SWITCH,
  MOVE_TO_DOOR,
  SETUP_TOGGLE_COOLDOWN_MS,
  TOGGLE_POCKET,
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

const createInitialDraftValues = (): Record<string, number> => {
  const initialValues: Record<string, number> = {};

  for (const item of DIMENSIONS_ITEMS) {
    const payloadKey = findInputPlaceholderKey(item.payload);

    if (payloadKey) {
      // Start each field at its own minimum (in inches, the default unit).
      initialValues[payloadKey] = getDimensionLimits(payloadKey, "in").min;
    }
  }

  return initialValues;
};

const getItemLabel = (item: PayloadItem | undefined): string => {
  if (!item) {
    return "";
  }
  return item.display.kind === "text"
    ? item.display.text
    : item.display.ariaLabel;
};

const toggleButtonClass = (active: boolean, disabled: boolean): string => {
  return (
    "pointer-events-auto rounded border px-2 py-[3px] text-[9px] font-semibold uppercase tracking-wide transition-all " +
    (disabled ? "cursor-not-allowed opacity-40 " : "") +
    (active
      ? "border-white bg-white text-black"
      : "border-white/40 text-white/80 hover:bg-white/[0.16] hover:text-white")
  );
};

const formatDimensionLabel = (payloadKey: string): string => {
  const baseKey = payloadKey.startsWith("p") ? payloadKey.slice(1) : payloadKey;
  return baseKey.charAt(0).toUpperCase() + baseKey.slice(1);
};

export function Sidebar({ isOpen, onToggle, onSelectItem }: SidebarProps) {
  const [dimensionUnit, setDimensionUnit] = useState<DimensionUnit>("in");
  const [isMovedToDoor, setIsMovedToDoor] = useState(false);
  const [isPocketOpen, setIsPocketOpen] = useState(false);
  const [isPaired, setIsPaired] = useState(false);
  const [pocketCooldown, setPocketCooldown] = useState(0);
  const pocketCooldownTimerRef = useRef<ReturnType<typeof setInterval> | null>(
    null,
  );
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

  const moveToDoorOnItem = MOVE_TO_DOOR[0];
  const moveToDoorOffItem = MOVE_TO_DOOR[1] ?? MOVE_TO_DOOR[0];
  const pocketCloseItem = TOGGLE_POCKET[0];
  const pocketOpenItem = TOGGLE_POCKET[1] ?? TOGGLE_POCKET[0];
  const moduleSimpleItem = MODULES_SWITCH[0];
  const modulePairedItem = MODULES_SWITCH[1] ?? MODULES_SWITCH[0];
  const isPocketDisabled = pocketCooldown > 0;

  const pocketLabel = getItemLabel(isPocketOpen ? pocketOpenItem : pocketCloseItem);
  const moduleLabel = getItemLabel(isPaired ? modulePairedItem : moduleSimpleItem);

  const moveToDoorItem = isMovedToDoor ? moveToDoorOnItem : moveToDoorOffItem;

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
            ? convertDimensionValue(value, dimensionUnit, nextUnit, payloadKey)
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

  const startPocketCooldown = () => {
    if (pocketCooldownTimerRef.current) {
      clearInterval(pocketCooldownTimerRef.current);
    }

    setPocketCooldown(Math.ceil(SETUP_TOGGLE_COOLDOWN_MS / 1000));

    pocketCooldownTimerRef.current = setInterval(() => {
      setPocketCooldown((previous) => {
        if (previous <= 1) {
          if (pocketCooldownTimerRef.current) {
            clearInterval(pocketCooldownTimerRef.current);
            pocketCooldownTimerRef.current = null;
          }
          return 0;
        }
        return previous - 1;
      });
    }, 1000);
  };

  const handlePocketToggle = () => {
    if (isPocketDisabled) {
      return;
    }

    const nextOpen = !isPocketOpen;
    const nextPocketItem = nextOpen ? pocketOpenItem : pocketCloseItem;

    if (!nextPocketItem) {
      return;
    }

    onSelectItem(nextPocketItem.payload);
    setIsPocketOpen(nextOpen);
    startPocketCooldown();
  };

  const handleModuleToggle = () => {
    const nextPaired = !isPaired;
    const nextModuleItem = nextPaired ? modulePairedItem : moduleSimpleItem;

    if (!nextModuleItem) {
      return;
    }

    onSelectItem(nextModuleItem.payload);
    setIsPaired(nextPaired);
  };

  useEffect(() => {
    return () => {
      if (pocketCooldownTimerRef.current) {
        clearInterval(pocketCooldownTimerRef.current);
      }
    };
  }, []);

  const commitDimensionValue = (
    payload: ItemPayload,
    payloadKey: string,
    nextValue: number,
  ) => {
    const limits = getDimensionLimits(payloadKey, dimensionUnit);
    const clampedValue = Math.min(
      limits.max,
      Math.max(limits.min, nextValue),
    );
    const normalizedCmValue = normalizeToCm(
      clampedValue,
      dimensionUnit,
      payloadKey,
    );

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
                  <p className="text-xs">Setup</p>
                  <div className="flex min-w-0 flex-wrap items-center justify-end gap-1">
                    <button
                      type="button"
                      onClick={handlePocketToggle}
                      disabled={isPocketDisabled}
                      aria-pressed={isPocketOpen}
                      aria-label={isPocketOpen ? "Close pocket" : "Open pocket"}
                      className={toggleButtonClass(false, isPocketDisabled)}
                    >
                      {pocketLabel}
                      {pocketCooldown > 0 ? (
                        <span className="ml-1 tabular-nums opacity-70">
                          {pocketCooldown}s
                        </span>
                      ) : null}
                    </button>

                    <button
                      type="button"
                      onClick={handleModuleToggle}
                      aria-pressed={isPaired}
                      aria-label={
                        isPaired
                          ? "Switch to simple module"
                          : "Switch to paired module"
                      }
                      className={toggleButtonClass(false, false)}
                    >
                      {moduleLabel}
                    </button>
                  </div>
                </div>

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
                      onClick={() =>
                        handleUnitChange(dimensionUnit === "in" ? "cm" : "in")
                      }
                      aria-label={`Unit: ${dimensionUnit}`}
                      className={toggleButtonClass(false, false)}
                    >
                      {dimensionUnit}
                    </button>
                  </div>
                </div>
                
                <div className="space-y-1.5">
                  {dimensionRows.map((row) => {
                    const rowLimits = getDimensionLimits(
                      row.payloadKey,
                      dimensionUnit,
                    );

                    return (
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
                          min={rowLimits.min}
                          max={rowLimits.max}
                          step={rowLimits.step}
                          usage="decimal"
                          clampMode="none"
                          styleType="minimal"
                          placeholder=""
                          ariaLabel={`${formatDimensionLabel(row.payloadKey)} ${dimensionUnit}`}
                          className="pointer-events-auto h-8 w-1/2 min-w-[96px] border-white/40 bg-white/[0.08] px-2 text-xs text-white placeholder:text-white/45 focus:border-emerald-400 focus:ring-emerald-400/40"
                        />
                      </div>
                    );
                  })}
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
