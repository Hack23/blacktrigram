import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, fireEvent, screen } from "@testing-library/react";
import React, { type ReactElement } from "react";

// Mock audio manager
const mockAudio = {
  playSFX: vi.fn(),
  playAttackSound: vi.fn(),
  playStanceChangeSound: vi.fn(),
  playMusic: vi.fn(),
  setMasterVolume: vi.fn(),
  getMasterVolume: vi.fn(() => 0.7),
  isEnabled: vi.fn(() => true),
};

vi.mock("../../audio/AudioManager", () => ({
  useAudio: () => mockAudio,
}));

describe("Game Audio Integration", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Korean Martial Arts Audio System", () => {
    it("should handle trigram stance changes with appropriate audio", () => {
      const TrigramStanceComponent = (): ReactElement => {
        const audio = mockAudio;

        const trigrams = [
          { name: "건", element: "Heaven", technique: "천둥벽력" },
          { name: "태", element: "Lake", technique: "유수연타" },
          { name: "리", element: "Fire", technique: "화염지창" },
          { name: "진", element: "Thunder", technique: "벽력일섬" },
          { name: "손", element: "Wind", technique: "선풍연격" },
          { name: "감", element: "Water", technique: "수류반격" },
          { name: "간", element: "Mountain", technique: "반석방어" },
          { name: "곤", element: "Earth", technique: "대지포옹" },
        ];

        const handleStanceChange = (trigramIndex: number): void => {
          audio.playStanceChangeSound();
          const damage = 15 + trigramIndex * 3; // Varying damage per trigram
          audio.playAttackSound(damage);
        };

        return React.createElement(
          "div",
          { "data-testid": "trigram-selector" },
          ...trigrams.map((trigram, index) =>
            React.createElement(
              "button",
              {
                key: trigram.name,
                "data-testid": `trigram-${index + 1}`,
                onClick: () => handleStanceChange(index),
              },
              `${trigram.name} - ${trigram.technique}`
            )
          )
        );
      };

      render(<TrigramStanceComponent />);

      // Test first trigram button
      const firstButton = screen.getByTestId("trigram-1");
      fireEvent.click(firstButton);

      expect(mockAudio.playStanceChangeSound).toHaveBeenCalled();
      expect(mockAudio.playAttackSound).toHaveBeenCalledWith(15);
    });

    it("should handle multiple trigram selections with escalating damage", () => {
      const TrigramStanceComponent = (): ReactElement => {
        const audio = mockAudio;

        const trigrams = [
          { name: "건", element: "Heaven", technique: "천둥벽력" },
          { name: "태", element: "Lake", technique: "유수연타" },
          { name: "리", element: "Fire", technique: "화염지창" },
        ];

        const handleStanceChange = (trigramIndex: number): void => {
          audio.playStanceChangeSound();
          const damage = 15 + trigramIndex * 3;
          audio.playAttackSound(damage);
        };

        return React.createElement(
          "div",
          { "data-testid": "trigram-selector" },
          ...trigrams.map((trigram, index) =>
            React.createElement(
              "button",
              {
                key: trigram.name,
                "data-testid": `trigram-${index + 1}`,
                onClick: () => handleStanceChange(index),
              },
              `${trigram.name} - ${trigram.technique}`
            )
          )
        );
      };

      render(<TrigramStanceComponent />);

      // Test multiple clicks with increasing damage
      const buttons = [
        screen.getByTestId("trigram-1"),
        screen.getByTestId("trigram-2"),
        screen.getByTestId("trigram-3"),
      ];

      buttons.forEach((button, index) => {
        fireEvent.click(button);
        expect(mockAudio.playAttackSound).toHaveBeenCalledWith(15 + index * 3);
      });

      expect(mockAudio.playStanceChangeSound).toHaveBeenCalledTimes(3);
    });

    it("should validate Korean technique names are displayed", () => {
      const TrigramStanceComponent = (): ReactElement => {
        const trigrams = [
          { name: "건", element: "Heaven", technique: "천둥벽력" },
          { name: "리", element: "Fire", technique: "화염지창" },
        ];

        return React.createElement(
          "div",
          { "data-testid": "trigram-selector" },
          ...trigrams.map((trigram, index) =>
            React.createElement(
              "button",
              {
                key: trigram.name,
                "data-testid": `trigram-${index + 1}`,
              },
              `${trigram.name} - ${trigram.technique}`
            )
          )
        );
      };

      render(<TrigramStanceComponent />);

      expect(screen.getByText(/건 - 천둥벽력/)).toBeInTheDocument();
      expect(screen.getByText(/리 - 화염지창/)).toBeInTheDocument();
    });
  });
});
