import { TbRulerMeasure2 } from "react-icons/tb";
import { TbRulerMeasure } from "react-icons/tb";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import { IoLocationOutline } from "react-icons/io5";


import {
  INPUT,
  makeIconItem,
  type PayloadItem,
} from "./e3ds/payloadItemFactory";

export const DIMENSIONS_ITEMS: PayloadItem[] = [
  makeIconItem({ pHeight: INPUT }, TbRulerMeasure2),
  makeIconItem({ pWidth: INPUT }, TbRulerMeasure),
];

export const VISIBILITY_TOGGLE_MODEL: PayloadItem[] = [
  makeIconItem({ pHideBox: 1 }, FaEyeSlash),
  makeIconItem({ pHideBox: 0 }, FaEye),
] 

export const MOVE_TO_DOOR: PayloadItem[] = [
  makeIconItem({ pMoveToLocation: 50 }, IoLocationOutline),
  makeIconItem({ pMoveToLocation: 0 }, FaLocationDot),
]
