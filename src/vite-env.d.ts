/// <reference types="vite/client" />
/// <reference types="react" />

interface ImportMetaEnv {
  readonly VITE_BASE_URL: string;
  readonly VITE_API_URL: string;
  readonly VITE_ENABLE_ANALYTICS: string;
  readonly APP_VERSION: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare const APP_VERSION: string;

// Global JSX declarations
declare global {
  namespace JSX {
    // Fix JSX.Element for React 18
    interface Element
      extends React.ReactElement<React.ComponentProps<any>, any> {}
  }
}

// Game asset type declarations
declare module "*.png" {
  const src: string;
  export default src;
}

declare module "*.jpg" {
  const src: string;
  export default src;
}

declare module "*.mp3" {
  const src: string;
  export default src;
}

declare module "*.wav" {
  const src: string;
  export default src;
}
