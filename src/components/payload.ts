import { IoSunnyOutline } from "react-icons/io5";
import { MdOutlineModeNight } from "react-icons/md";
import { TbSunset2 } from "react-icons/tb";
import { CiPause1 } from "react-icons/ci";
import { CiPlay1 } from "react-icons/ci";
import { CiStop1 } from "react-icons/ci";

import {
  makeIconItem,
  makeTextItem,
  type PayloadItem,
} from "./e3ds/payloadItemFactory";

export const BOTTOMBAR_LOCATION_ITEMS: PayloadItem[] = [
  makeTextItem({ pLocation: "0" }, "1"),
  makeTextItem({ pLocation: "1" }, "2"),
  makeTextItem({ pLocation: "2" }, "3"),
  makeTextItem({ pLocation: "3" }, "4"),
  makeTextItem({ pLocation: "4" }, "5"),
];

export const SIDEBAR_DAYTIME_ITEMS: PayloadItem[] = [
  makeIconItem({ pDaytime: "11:3" }, IoSunnyOutline),
  makeIconItem({ pDaytime: "14:75" }, TbSunset2),
  makeIconItem({ pDaytime: "19" }, MdOutlineModeNight),
];

export const SIDEBAR_MOVIE_ITEMS: PayloadItem[] = [
  makeIconItem({ pMovie: "play" }, CiPlay1),
  makeIconItem({ pMovie: "pause" }, CiPause1),
  makeIconItem({ pMovie: "stop" }, CiStop1),
];
