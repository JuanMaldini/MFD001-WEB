import { USE_E3DS_WEBSDK } from "../../../websdkBool";

export type StreamingMode = "e3ds" | "native";

interface StreamingModeConfig {
  mode: StreamingMode;
  usesE3DSWebSdk: boolean;
  iframeUrl?: string;
}

const normalize = (value: string | undefined): string | undefined => {
  const clean = value?.trim();
  return clean ? clean : undefined;
};

export const getStreamingModeConfig = (): StreamingModeConfig => {
  const e3dsIframeUrl = normalize(
    import.meta.env.VITE_E3DS_IFRAME_URL as string | undefined,
  );
  const nativeIframeUrl = normalize(
    import.meta.env.VITE_NATIVE_IFRAME_URL as string | undefined,
  );

  if (USE_E3DS_WEBSDK) {
    return {
      mode: "e3ds",
      usesE3DSWebSdk: true,
      iframeUrl: e3dsIframeUrl,
    };
  }

  return {
    mode: "native",
    usesE3DSWebSdk: false,
    iframeUrl: nativeIframeUrl,
  };
};
