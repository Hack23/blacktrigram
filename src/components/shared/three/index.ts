/**
 * Barrel exports for shared/three module
 *
 * Only re-exports symbols that are actually consumed through this barrel.
 * Components used via direct imports (e.g., from "./effects/DamageNumbers")
 * are NOT re-exported here to avoid dead code.
 *
 * @module components/shared/three
 * @korean 공유3D컴포넌트
 */

// UI components consumed through barrel by components/index.ts and screens
export { KoreanButton } from "./ui/KoreanButton";
export type { KoreanButtonProps } from "./ui/KoreanButton";

export { KoreanPanel } from "./ui/KoreanPanel";
export type { KoreanPanelProps } from "./ui/KoreanPanel";

export { KoreanText } from "./ui/KoreanText";
export type { KoreanTextProps } from "./ui/KoreanText";

export { MenuList } from "./ui/MenuList";
export type { MenuItem, MenuListProps } from "./ui/MenuList";

export { ArchetypeCard } from "./ui/ArchetypeCard";
export type { ArchetypeCardProps } from "./ui/ArchetypeCard";

export { ProgressBar } from "./ui/ProgressBar";
export type { ProgressBarProps, ProgressBarType } from "./ui/ProgressBar";

// VitalPoint types consumed by TrainingScreen3D
export type { BodyRegionFilter } from "./ui/VitalPointOverlayControlsHtml";

// Effects consumed through barrel by TrainingScreen3D
export { default as VitalPointMarkers3D } from "./effects/VitalPointMarkers3D";
export type { VitalPointMarkers3DProps } from "./effects/VitalPointMarkers3D";

// Models consumed through barrel by TrainingScreen3D
export { Player3DWithTransitions } from "./models/Player3DWithTransitions";
export type { Player3DWithTransitionsProps } from "./models/Player3DWithTransitions";

// Scene consumed through barrel by ControlsScreen3D, IntroScreen3D, PhilosophyScreen3D
export { BackgroundScene3D } from "./scene/BackgroundScene3D";
export type { BackgroundScene3DProps } from "./scene/BackgroundScene3D";
