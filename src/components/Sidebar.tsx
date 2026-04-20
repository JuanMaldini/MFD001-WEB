import { useState } from "react";
import { IoClose } from "react-icons/io5";
import {
  TbLayoutSidebarRight,
  TbLayoutSidebarRightFilled,
} from "react-icons/tb";
import { PANEL_SHARED_UI } from "../constants/panelsConfig";
import { type ItemPayload } from "./e3ds/payloadItemFactory";
import { SIDEBAR_DAYTIME_ITEMS, SIDEBAR_MOVIE_ITEMS } from "./payload";

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  onSelectItem: (payload: ItemPayload) => void;
}

type DaylightMode = (typeof SIDEBAR_DAYTIME_ITEMS)[number]["id"];
type MovieTransportState = "stopped" | "playing" | "paused";

export function Sidebar({ isOpen, onToggle, onSelectItem }: SidebarProps) {
  const [daylightMode, setDaylightMode] = useState<DaylightMode>(
    SIDEBAR_DAYTIME_ITEMS[0].id,
  );
  const [movieTransportState, setMovieTransportState] =
    useState<MovieTransportState>("stopped");
  const expandableStateClass = isOpen
    ? "max-w-full flex-1 opacity-100 translate-x-0 pointer-events-auto"
    : "max-w-0 flex-[0_0_0] opacity-0 translate-x-0 pointer-events-none";
  const rowGapClass = isOpen
    ? PANEL_SHARED_UI.panelInlineGapOpenClass
    : PANEL_SHARED_UI.panelInlineGapClosedClass;
  const toggleSlotStateClass = isOpen
    ? PANEL_SHARED_UI.sidebarToggleSlotOpenClass
    : PANEL_SHARED_UI.sidebarToggleSlotClosedClass;
  const moviePlayItem = SIDEBAR_MOVIE_ITEMS.find(
    (item) => item.payload.pMovie === "play",
  );
  const moviePauseItem = SIDEBAR_MOVIE_ITEMS.find(
    (item) => item.payload.pMovie === "pause",
  );
  const movieStopItem = SIDEBAR_MOVIE_ITEMS.find(
    (item) => item.payload.pMovie === "stop",
  );

  const renderItemContent = (item: (typeof SIDEBAR_DAYTIME_ITEMS)[number]) => {
    if (item.display.kind === "icon") {
      return <item.display.icon className="h-[18px] w-[18px] text-white" />;
    }

    if (item.display.kind === "text") {
      return (
        <span className="text-[11px] font-semibold uppercase tracking-wide">
          {item.display.text}
        </span>
      );
    }

    return (
      <img
        src={item.display.svgPath}
        alt={item.display.alt}
        className="h-[18px] w-[18px]"
      />
    );
  };

  const handleMovieToggle = () => {
    const shouldPlay =
      movieTransportState === "stopped" || movieTransportState === "paused";
    const nextItem = shouldPlay ? moviePlayItem : moviePauseItem;

    if (!nextItem) {
      return;
    }

    onSelectItem(nextItem.payload);
    setMovieTransportState(shouldPlay ? "playing" : "paused");
  };

  const handleMovieStop = () => {
    if (movieStopItem) {
      onSelectItem(movieStopItem.payload);
    }

    setMovieTransportState("stopped");
  };

  const movieToggleItem =
    movieTransportState === "playing" ? moviePauseItem : moviePlayItem;
  const movieToggleIsActive = movieTransportState !== "stopped";
  const movieStopIsActive = movieTransportState === "stopped";

  return (
    <div className="h-auto w-full overflow-hidden bg-transparent text-white pointer-events-none">
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
          <div className="w-full min-w-0 overflow-hidden rounded border border-white bg-transparent">
            <div className="flex items-center justify-between gap-2 px-2 py-2">
              <h2 className="text-right text-sm font-semibold">Configurator</h2>
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
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm">Daytime</p>
                <div className="flex items-center gap-1">
                  {SIDEBAR_DAYTIME_ITEMS.map((item) => {
                    const isActive = daylightMode === item.id;

                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => {
                          setDaylightMode(item.id);
                          onSelectItem(item.payload);
                        }}
                        className={
                          PANEL_SHARED_UI.sidebarOptionButtonClass +
                          " " +
                          (isActive
                            ? "bg-white/[0.16] drop-shadow-[0_0_8px_rgba(255,255,255,0.65)]"
                            : "bg-white/[0.06] hover:bg-white/[0.1] hover:drop-shadow-[0_0_6px_rgba(255,255,255,0.55)] active:bg-white/[0.16] active:drop-shadow-[0_0_8px_rgba(255,255,255,0.65)]")
                        }
                        aria-label={item.display.ariaLabel}
                        aria-pressed={isActive}
                      >
                        {renderItemContent(item)}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="border-t border-white px-2 py-2">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm">Movie</p>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={handleMovieToggle}
                    className={
                      PANEL_SHARED_UI.sidebarOptionButtonClass +
                      " " +
                      (movieToggleIsActive
                        ? "bg-white/[0.16] drop-shadow-[0_0_8px_rgba(255,255,255,0.65)]"
                        : "bg-white/[0.06] hover:bg-white/[0.1] hover:drop-shadow-[0_0_6px_rgba(255,255,255,0.55)] active:bg-white/[0.16] active:drop-shadow-[0_0_8px_rgba(255,255,255,0.65)]")
                    }
                    aria-label={
                      movieTransportState === "playing"
                        ? "Pause movie"
                        : "Play movie"
                    }
                    aria-pressed={movieToggleIsActive}
                  >
                    {movieToggleItem
                      ? renderItemContent(movieToggleItem)
                      : null}
                  </button>

                  <button
                    type="button"
                    onClick={handleMovieStop}
                    className={
                      PANEL_SHARED_UI.sidebarOptionButtonClass +
                      " " +
                      (movieStopIsActive
                        ? "bg-white/[0.16] drop-shadow-[0_0_8px_rgba(255,255,255,0.65)]"
                        : "bg-white/[0.06] hover:bg-white/[0.1] hover:drop-shadow-[0_0_6px_rgba(255,255,255,0.55)] active:bg-white/[0.16] active:drop-shadow-[0_0_8px_rgba(255,255,255,0.65)]")
                    }
                    aria-label="Stop movie"
                    aria-pressed={movieStopIsActive}
                  >
                    {movieStopItem ? renderItemContent(movieStopItem) : null}
                  </button>
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
            {isOpen ? (
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
