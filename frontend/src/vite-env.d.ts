/// <reference types="vite/client" />

interface ImportMetaEnv {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    readonly VITE_VOICEVOX_URL: string
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv
  }