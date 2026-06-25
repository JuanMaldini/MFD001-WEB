import { TbRulerMeasure2 } from "react-icons/tb";
import { TbRulerMeasure } from "react-icons/tb";
import { FaLocationDot } from "react-icons/fa6";
import { IoLocationOutline } from "react-icons/io5";


import {
  INPUT,
  makeIconItem,
  makeTextItem,
  type PayloadItem,
} from "./e3ds/payloadItemFactory";

export const DIMENSIONS_ITEMS: PayloadItem[] = [
  makeIconItem({ pHeight: INPUT }, TbRulerMeasure2),
  makeIconItem({ pWidth: INPUT }, TbRulerMeasure),
];

//slider working beetween 0 and 1 starting in 0.
export const OPEN_DOOR_SLIDER: PayloadItem[] = [
  makeTextItem({ pOpenDoor: INPUT }, "Open"),
];

export const MOVE_TO_DOOR: PayloadItem[] = [
  makeIconItem({ pMoveToLocation: 50 }, IoLocationOutline),
  makeIconItem({ pMoveToLocation: 0 }, FaLocationDot),
]

export const TOGGLE_POCKET: PayloadItem[] = [
  makeTextItem({ pTogglePocket: 0 }, "Open"),
  makeTextItem({ pTogglePocket: 1 }, "Close"),
]

export const TOGGLE_POCKET_VISIBILITY: PayloadItem[] = [
  makeTextItem({ pPocketHidden: 0 }, "Pocket Show"),
  makeTextItem({ pPocketHidden: 1 }, "Pocket Hide"),
]

export const MODULES_SWITCH: PayloadItem[] = [
  makeTextItem({ pSwitchModule: 0 }, "Simple"),
  makeTextItem({ pSwitchModule: 1 }, "Paired"),
]

// Time (ms) the Setup toggle stays disabled after a change before re-enabling.
export const SETUP_TOGGLE_COOLDOWN_MS = 20000;
