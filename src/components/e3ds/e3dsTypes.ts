export interface SendDataToUEMessage {
  cmd: "sendDataToUE";
  value: unknown;
}

export interface E3DSStageEvent {
  type?: string;
  [key: string]: unknown;
}

export type E3DSMessageHandler = (event: MessageEvent) => void;

export const E3DS_READY_STAGE = "stage5_playBtnPressed";
export const E3DS_RESET_STAGES = [
  "sessionExpired",
  "videoStreamFailed",
] as const;
