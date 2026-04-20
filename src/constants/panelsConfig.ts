export interface PanelDefaultOpenState {
  sidebar: boolean;
  bottomBar: boolean;
}

export const PANEL_DEFAULT_OPEN_STATE: PanelDefaultOpenState = {
  sidebar: false,
  bottomBar: false,
};

export interface PanelSharedUiConfig {
  containerWidthClass: string;
  expandableTransitionClass: string;
  toggleButtonClass: string;
  toggleIconSizeClass: string;
  closeButtonClass: string;
  sidebarOptionButtonClass: string;
  bottomBarOptionButtonClass: string;
  panelInlineGapClosedClass: string;
  panelInlineGapOpenClass: string;
  panelStackGapClosedClass: string;
  panelStackGapOpenClass: string;
  sidebarToggleSlotClosedClass: string;
  sidebarToggleSlotOpenClass: string;
  bottomBarToggleSlotClosedClass: string;
  bottomBarToggleSlotOpenClass: string;
}

export const PANEL_SHARED_UI: PanelSharedUiConfig = {
  containerWidthClass: "w-[min(315px,calc(100vw-1rem))] max-w-full",
  expandableTransitionClass: "transition-all duration-300 ease-out",
  toggleButtonClass:
    "group inline-flex shrink-0 items-center justify-center rounded-md border border-white bg-white/[0.06] p-1 text-white transition-all duration-200 hover:bg-white/[0.1] hover:drop-shadow-[0_0_6px_rgba(255,255,255,0.55)] active:bg-white/[0.16] active:drop-shadow-[0_0_8px_rgba(255,255,255,0.65)]",
  toggleIconSizeClass:
    "h-[34px] w-[34px] text-white transition-all duration-200 group-hover:drop-shadow-[0_0_6px_rgba(255,255,255,0.75)] group-active:drop-shadow-[0_0_8px_rgba(255,255,255,0.9)]",
  closeButtonClass:
    "inline-flex h-7 w-7 items-center justify-center rounded-md border border-white bg-white/[0.06] p-1 text-white transition-all duration-200 hover:bg-white/[0.1] hover:drop-shadow-[0_0_6px_rgba(255,255,255,0.55)] active:bg-white/[0.16] active:drop-shadow-[0_0_8px_rgba(255,255,255,0.65)]",
  sidebarOptionButtonClass:
    "inline-flex h-7 w-7 items-center justify-center rounded-md border border-white p-1 text-white transition-all duration-200",
  bottomBarOptionButtonClass:
    "inline-flex h-8 w-8 items-center justify-center rounded-md border border-white bg-white/[0.06] p-1 text-sm font-semibold text-white transition-all duration-200 hover:bg-white/[0.1] hover:drop-shadow-[0_0_6px_rgba(255,255,255,0.55)] active:bg-white/[0.16] active:drop-shadow-[0_0_8px_rgba(255,255,255,0.65)]",
  panelInlineGapClosedClass: "gap-2",
  panelInlineGapOpenClass: "gap-0",
  panelStackGapClosedClass: "gap-2",
  panelStackGapOpenClass: "gap-0",
  sidebarToggleSlotClosedClass: "max-w-12 opacity-100 pointer-events-auto",
  sidebarToggleSlotOpenClass: "max-w-0 opacity-0 pointer-events-none",
  bottomBarToggleSlotClosedClass: "max-h-12 opacity-100 pointer-events-auto",
  bottomBarToggleSlotOpenClass: "max-h-0 opacity-0 pointer-events-none",
};
