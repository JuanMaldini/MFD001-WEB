import { IoClose, IoLocationOutline, IoLocationSharp } from "react-icons/io5";
import { PANEL_SHARED_UI } from "./constants/panelsConfig";
import { type ItemPayload } from "./e3ds/payloadItemFactory";
import { BOTTOMBAR_LOCATION_ITEMS } from "./payload";

interface BottomBarProps {
  isOpen: boolean;
  onToggle: () => void;
  onSelectItem: (payload: ItemPayload) => void;
}

export function BottomBar({ isOpen, onToggle, onSelectItem }: BottomBarProps) {
  const expandableStateClass = isOpen
    ? "max-h-[50dvh] opacity-100 translate-y-0 pointer-events-auto"
    : "max-h-0 opacity-0 translate-y-0 pointer-events-none";
  const columnGapClass = isOpen
    ? PANEL_SHARED_UI.panelStackGapOpenClass
    : PANEL_SHARED_UI.panelStackGapClosedClass;
  const toggleSlotStateClass = isOpen
    ? PANEL_SHARED_UI.bottomBarToggleSlotOpenClass
    : PANEL_SHARED_UI.bottomBarToggleSlotClosedClass;

  return (
    <div className="h-auto w-full overflow-hidden bg-transparent text-white pointer-events-none">
      <div
        className={
          "relative flex flex-col items-center justify-end px-2 pb-2 pointer-events-none " +
          PANEL_SHARED_UI.expandableTransitionClass +
          " " +
          columnGapClass
        }
      >
        <div
          className={
            "relative z-10 w-auto max-w-full overflow-hidden pb-px " +
            PANEL_SHARED_UI.expandableTransitionClass +
            " " +
            expandableStateClass
          }
        >
          <div className="overflow-hidden rounded border border-white bg-transparent px-2 py-2">
            <div className="flex flex-row flex-wrap items-center justify-center gap-2">
              {BOTTOMBAR_LOCATION_ITEMS.map((item) => {
                const content =
                  item.display.kind === "text" ? (
                    item.display.text
                  ) : item.display.kind === "icon" ? (
                    <item.display.icon className="h-[18px] w-[18px] text-white" />
                  ) : (
                    <img
                      src={item.display.svgPath}
                      alt={item.display.alt}
                      className="h-[18px] w-[18px]"
                    />
                  );

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => onSelectItem(item.payload)}
                    className={PANEL_SHARED_UI.bottomBarOptionButtonClass}
                    aria-label={item.display.ariaLabel}
                  >
                    {content}
                  </button>
                );
              })}

              <button
                type="button"
                onClick={onToggle}
                className={PANEL_SHARED_UI.bottomBarOptionButtonClass}
                aria-label="Close bottom panel"
              >
                <IoClose className="h-[18px] w-[18px] text-white" />
              </button>
            </div>
          </div>
        </div>

        <div
          className={
            "w-full overflow-hidden " +
            PANEL_SHARED_UI.expandableTransitionClass +
            " " +
            toggleSlotStateClass
          }
        >
          <div className="flex justify-center">
            <button
              type="button"
              onClick={onToggle}
              className={
                PANEL_SHARED_UI.toggleButtonClass +
                " relative z-0 pointer-events-auto"
              }
              aria-label={
                isOpen ? "Collapse bottom panel" : "Expand bottom panel"
              }
            >
              {isOpen ? (
                <IoLocationSharp
                  className={
                    PANEL_SHARED_UI.toggleIconSizeClass +
                    " transition-transform duration-200"
                  }
                />
              ) : (
                <IoLocationOutline
                  className={
                    PANEL_SHARED_UI.toggleIconSizeClass +
                    " transition-transform duration-200"
                  }
                />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
