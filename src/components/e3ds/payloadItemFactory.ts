import type { IconType } from "react-icons";

export type PayloadPrimitive = string | number | boolean;

export type ItemPayload = Record<string, PayloadPrimitive>;

export const INPUT = "input" as const;

interface BaseDisplay {
  ariaLabel: string;
}

export interface TextDisplay extends BaseDisplay {
  kind: "text";
  text: string;
}

export interface IconDisplay extends BaseDisplay {
  kind: "icon";
  icon: IconType;
}

export interface SvgDisplay extends BaseDisplay {
  kind: "svg";
  svgPath: string;
  alt: string;
}

export type ItemDisplay = TextDisplay | IconDisplay | SvgDisplay;

export interface PayloadItem {
  id: string;
  payload: ItemPayload;
  display: ItemDisplay;
}

export const findInputPlaceholderKey = (
  payload: ItemPayload,
): string | null => {
  const entry = Object.entries(payload).find(([, value]) => value === INPUT);
  return entry ? entry[0] : null;
};

export const resolveInputPayload = (
  payload: ItemPayload,
  nextValue: PayloadPrimitive,
): ItemPayload => {
  const inputKey = findInputPlaceholderKey(payload);

  if (!inputKey) {
    return payload;
  }

  return {
    ...payload,
    [inputKey]: nextValue,
  };
};

const normalizeToken = (value: string): string => {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

const sortedPayloadEntries = (
  payload: ItemPayload,
): Array<[string, PayloadPrimitive]> => {
  return Object.entries(payload).sort(([left], [right]) =>
    left.localeCompare(right),
  );
};

const composeItemId = (payload: ItemPayload, displayToken: string): string => {
  const payloadToken = sortedPayloadEntries(payload)
    .map(
      ([key, value]) =>
        `${normalizeToken(key)}-${normalizeToken(String(value))}`,
    )
    .join("--");
  const displayPart = normalizeToken(displayToken);
  return displayPart ? `${payloadToken}--${displayPart}` : payloadToken;
};

const composeIconAriaLabel = (payload: ItemPayload): string => {
  return sortedPayloadEntries(payload)
    .map(([, value]) => String(value))
    .join(" ");
};

const getIconToken = (icon: IconType): string => {
  const iconWithNames = icon as IconType & {
    displayName?: string;
    name?: string;
  };
  return iconWithNames.displayName ?? iconWithNames.name ?? "icon";
};

export const makeTextItem = (
  payload: ItemPayload,
  text: string,
): PayloadItem => ({
  id: composeItemId(payload, text),
  payload,
  display: {
    kind: "text",
    text,
    ariaLabel: text,
  },
});

export const makeIconItem = (
  payload: ItemPayload,
  icon: IconType,
): PayloadItem => ({
  id: composeItemId(payload, getIconToken(icon)),
  payload,
  display: {
    kind: "icon",
    icon,
    ariaLabel: composeIconAriaLabel(payload),
  },
});

export const serializeItemPayload = (payload: ItemPayload): string => {
  return JSON.stringify(payload);
};
