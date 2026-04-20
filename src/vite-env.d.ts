/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_E3DS_IFRAME_URL?: string;
  readonly VITE_NATIVE_IFRAME_URL?: string;
  readonly VITE_AUTH_ACCESS_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
