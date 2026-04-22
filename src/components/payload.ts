import { TbRulerMeasure2 } from "react-icons/tb";
import { TbRulerMeasure } from "react-icons/tb";

import {
  INPUT,
  makeIconItem,
  type PayloadItem,
} from "./e3ds/payloadItemFactory";

export const BOTTOMBAR_LOCATION_ITEMS: PayloadItem[] = [];

export const DIMENSIONS_ITEMS: PayloadItem[] = [
  makeIconItem({ pHeight: INPUT }, TbRulerMeasure2),
  makeIconItem({ pWidth: INPUT }, TbRulerMeasure),
];
