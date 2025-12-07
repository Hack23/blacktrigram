/**
 * usePauseMenu Hook - State management for pause menu
 * 
 * Manages:
 * - Pause menu visibility
 * - Active submenu (controls, settings)
 * - Confirmation dialog state
 */

import { useCallback, useState } from "react";

export type PauseSubmenu = "main" | "controls" | "settings" | null;

export interface ConfirmDialogState {
  readonly isOpen: boolean;
  readonly title: string;
  readonly titleKorean: string;
  readonly message: string;
  readonly messageKorean: string;
  readonly onConfirm: () => void;
}

export interface UsePauseMenuResult {
  readonly activeSubmenu: PauseSubmenu;
  readonly confirmDialog: ConfirmDialogState;
  readonly showControls: () => void;
  readonly showSettings: () => void;
  readonly closeSubmenu: () => void;
  readonly openConfirmDialog: (config: Omit<ConfirmDialogState, "isOpen">) => void;
  readonly closeConfirmDialog: () => void;
  readonly confirmAndClose: () => void;
}

const defaultConfirmDialog: ConfirmDialogState = {
  isOpen: false,
  title: "",
  titleKorean: "",
  message: "",
  messageKorean: "",
  onConfirm: () => {},
};

/**
 * Hook for managing pause menu state
 */
export function usePauseMenu(): UsePauseMenuResult {
  const [activeSubmenu, setActiveSubmenu] = useState<PauseSubmenu>("main");
  const [confirmDialog, setConfirmDialog] = useState<ConfirmDialogState>(defaultConfirmDialog);

  const showControls = useCallback(() => {
    setActiveSubmenu("controls");
  }, []);

  const showSettings = useCallback(() => {
    setActiveSubmenu("settings");
  }, []);

  const closeSubmenu = useCallback(() => {
    setActiveSubmenu("main");
  }, []);

  const openConfirmDialog = useCallback(
    (config: Omit<ConfirmDialogState, "isOpen">) => {
      setConfirmDialog({
        ...config,
        isOpen: true,
      });
    },
    []
  );

  const closeConfirmDialog = useCallback(() => {
    setConfirmDialog(defaultConfirmDialog);
  }, []);

  const confirmAndClose = useCallback(() => {
    if (confirmDialog.onConfirm) {
      confirmDialog.onConfirm();
    }
    closeConfirmDialog();
  }, [confirmDialog, closeConfirmDialog]);

  return {
    activeSubmenu,
    confirmDialog,
    showControls,
    showSettings,
    closeSubmenu,
    openConfirmDialog,
    closeConfirmDialog,
    confirmAndClose,
  };
}
