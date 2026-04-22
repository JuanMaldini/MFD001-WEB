import {
  E3DS_READY_STAGE,
  E3DS_RESET_STAGES,
  type E3DSMessageHandler,
  type E3DSStageEvent,
  type SendDataToUEMessage,
} from "./e3dsTypes";

let registeredIframe: HTMLIFrameElement | null = null;
const listeners = new Set<E3DSMessageHandler>();
let isWindowListenerBound = false;

const forwardMessage = (event: MessageEvent): void => {
  const iframeWindow = registeredIframe?.contentWindow;
  if (!iframeWindow || event.source !== iframeWindow) {
    return;
  }

  listeners.forEach((listener) => listener(event));
};

const bindWindowListener = (): void => {
  if (isWindowListenerBound) {
    return;
  }

  window.addEventListener("message", forwardMessage);
  isWindowListenerBound = true;
};

const maybeUnbindWindowListener = (): void => {
  if (!isWindowListenerBound || listeners.size > 0) {
    return;
  }

  window.removeEventListener("message", forwardMessage);
  isWindowListenerBound = false;
};

const getStageType = (event: MessageEvent): string | null => {
  if (typeof event.data === "string") {
    return null;
  }

  const data = event.data as E3DSStageEvent;
  if (typeof data.type !== "string") {
    return null;
  }

  return data.type;
};

export const registerE3DSIframe = (iframe: HTMLIFrameElement | null): void => {
  registeredIframe = iframe;
};

export const subscribeToE3DSMessages = (
  listener: E3DSMessageHandler,
): (() => void) => {
  listeners.add(listener);
  bindWindowListener();

  return () => {
    listeners.delete(listener);
    maybeUnbindWindowListener();
  };
};

export const sendPayloadToUE = (payload: unknown): boolean => {
  const iframeWindow = registeredIframe?.contentWindow;
  if (!iframeWindow) {
    return false;
  }

  const envelope: SendDataToUEMessage = {
    cmd: "sendDataToUE",
    value: payload,
  };

  console.log(payload);
  iframeWindow.postMessage(JSON.stringify(envelope), "*");
  return true;
};

export const isReadyStageMessage = (event: MessageEvent): boolean => {
  return getStageType(event) === E3DS_READY_STAGE;
};

export const isResetStageMessage = (event: MessageEvent): boolean => {
  const stageType = getStageType(event);
  if (!stageType) {
    return false;
  }

  return E3DS_RESET_STAGES.includes(
    stageType as (typeof E3DS_RESET_STAGES)[number],
  );
};
