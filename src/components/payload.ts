import { TbRulerMeasure2 } from "react-icons/tb";
import { TbRulerMeasure } from "react-icons/tb";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";

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
  makeIconItem({ pVisibility: 1 }, FaEye),
  makeIconItem({ pVisibility: 0 }, FaEyeSlash),
] 