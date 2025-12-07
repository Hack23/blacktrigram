/**
 * usePauseMenu Hook Tests
 * Tests for the pause menu state management hook
 */

import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { usePauseMenu } from "./usePauseMenu";

describe("usePauseMenu", () => {
  describe("Initial State", () => {
    it("should initialize with main submenu active", () => {
      const { result } = renderHook(() => usePauseMenu());

      expect(result.current.activeSubmenu).toBe("main");
    });

    it("should initialize with confirm dialog closed", () => {
      const { result } = renderHook(() => usePauseMenu());

      expect(result.current.confirmDialog.isOpen).toBe(false);
      expect(result.current.confirmDialog.title).toBe("");
      expect(result.current.confirmDialog.titleKorean).toBe("");
      expect(result.current.confirmDialog.message).toBe("");
      expect(result.current.confirmDialog.messageKorean).toBe("");
    });
  });

  describe("Submenu Navigation", () => {
    it("should show controls submenu", () => {
      const { result } = renderHook(() => usePauseMenu());

      act(() => {
        result.current.showControls();
      });

      expect(result.current.activeSubmenu).toBe("controls");
    });

    it("should show settings submenu", () => {
      const { result } = renderHook(() => usePauseMenu());

      act(() => {
        result.current.showSettings();
      });

      expect(result.current.activeSubmenu).toBe("settings");
    });

    it("should close submenu and return to main", () => {
      const { result } = renderHook(() => usePauseMenu());

      act(() => {
        result.current.showSettings();
      });

      expect(result.current.activeSubmenu).toBe("settings");

      act(() => {
        result.current.closeSubmenu();
      });

      expect(result.current.activeSubmenu).toBe("main");
    });
  });

  describe("Confirm Dialog Management", () => {
    it("should open confirm dialog with provided config", () => {
      const { result } = renderHook(() => usePauseMenu());
      const mockOnConfirm = vi.fn();

      act(() => {
        result.current.openConfirmDialog({
          title: "Test Title",
          titleKorean: "테스트 제목",
          message: "Test Message",
          messageKorean: "테스트 메시지",
          onConfirm: mockOnConfirm,
        });
      });

      expect(result.current.confirmDialog.isOpen).toBe(true);
      expect(result.current.confirmDialog.title).toBe("Test Title");
      expect(result.current.confirmDialog.titleKorean).toBe("테스트 제목");
      expect(result.current.confirmDialog.message).toBe("Test Message");
      expect(result.current.confirmDialog.messageKorean).toBe("테스트 메시지");
      expect(result.current.confirmDialog.onConfirm).toBe(mockOnConfirm);
    });

    it("should close confirm dialog", () => {
      const { result } = renderHook(() => usePauseMenu());

      act(() => {
        result.current.openConfirmDialog({
          title: "Test",
          titleKorean: "테스트",
          message: "Message",
          messageKorean: "메시지",
          onConfirm: vi.fn(),
        });
      });

      expect(result.current.confirmDialog.isOpen).toBe(true);

      act(() => {
        result.current.closeConfirmDialog();
      });

      expect(result.current.confirmDialog.isOpen).toBe(false);
    });

    it("should call onConfirm and close dialog when confirmAndClose is called", () => {
      const { result } = renderHook(() => usePauseMenu());
      const mockOnConfirm = vi.fn();

      act(() => {
        result.current.openConfirmDialog({
          title: "Test",
          titleKorean: "테스트",
          message: "Message",
          messageKorean: "메시지",
          onConfirm: mockOnConfirm,
        });
      });

      act(() => {
        result.current.confirmAndClose();
      });

      expect(mockOnConfirm).toHaveBeenCalledTimes(1);
      expect(result.current.confirmDialog.isOpen).toBe(false);
    });

    it("should handle confirmAndClose when no onConfirm is provided", () => {
      const { result } = renderHook(() => usePauseMenu());

      act(() => {
        result.current.openConfirmDialog({
          title: "Test",
          titleKorean: "테스트",
          message: "Message",
          messageKorean: "메시지",
          onConfirm: () => {},
        });
      });

      expect(() => {
        act(() => {
          result.current.confirmAndClose();
        });
      }).not.toThrow();

      expect(result.current.confirmDialog.isOpen).toBe(false);
    });
  });

  describe("State Transitions", () => {
    it("should transition from main to settings and back", () => {
      const { result } = renderHook(() => usePauseMenu());

      expect(result.current.activeSubmenu).toBe("main");

      act(() => {
        result.current.showSettings();
      });

      expect(result.current.activeSubmenu).toBe("settings");

      act(() => {
        result.current.closeSubmenu();
      });

      expect(result.current.activeSubmenu).toBe("main");
    });

    it("should transition from main to controls and back", () => {
      const { result } = renderHook(() => usePauseMenu());

      expect(result.current.activeSubmenu).toBe("main");

      act(() => {
        result.current.showControls();
      });

      expect(result.current.activeSubmenu).toBe("controls");

      act(() => {
        result.current.closeSubmenu();
      });

      expect(result.current.activeSubmenu).toBe("main");
    });

    it("should allow switching between submenus", () => {
      const { result } = renderHook(() => usePauseMenu());

      act(() => {
        result.current.showSettings();
      });

      expect(result.current.activeSubmenu).toBe("settings");

      act(() => {
        result.current.showControls();
      });

      expect(result.current.activeSubmenu).toBe("controls");
    });
  });

  describe("Confirm Dialog Isolation", () => {
    it("should keep confirm dialog state separate from submenu state", () => {
      const { result } = renderHook(() => usePauseMenu());

      act(() => {
        result.current.showSettings();
      });

      act(() => {
        result.current.openConfirmDialog({
          title: "Test",
          titleKorean: "테스트",
          message: "Message",
          messageKorean: "메시지",
          onConfirm: vi.fn(),
        });
      });

      expect(result.current.activeSubmenu).toBe("settings");
      expect(result.current.confirmDialog.isOpen).toBe(true);

      act(() => {
        result.current.closeConfirmDialog();
      });

      expect(result.current.activeSubmenu).toBe("settings");
      expect(result.current.confirmDialog.isOpen).toBe(false);
    });
  });
});
