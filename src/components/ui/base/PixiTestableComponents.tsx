import React from "react";
import { usePixiExtensions } from "../../../utils/pixiExtensions";

interface PixiTestData {
  readonly type: string;
  readonly [key: string]: any;
}

interface TestablePixiProps {
  children?: React.ReactNode;
  x?: number;
  y?: number;
  "pixi-data"?: PixiTestData;
  interactive?: boolean;
  onPointerDown?: () => void;
  onPointerUp?: () => void;
}

// Testable PixiJS components that expose pixi-data
export const TestablePixiContainer: React.FC<TestablePixiProps> = ({
  "pixi-data": pixiData,
  ...props
}) => {
  usePixiExtensions();

  return (
    <pixiContainer
      {...props}
      ref={(container: any) => {
        if (container && pixiData) {
          container.pixiData = pixiData;
        }
      }}
    />
  );
};

export const TestablePixiGraphics: React.FC<
  TestablePixiProps & {
    draw: (graphics: any) => void;
  }
> = ({ "pixi-data": pixiData, draw, ...props }) => {
  usePixiExtensions();

  return (
    <pixiGraphics
      {...props}
      draw={draw}
      ref={(graphics: any) => {
        if (graphics && pixiData) {
          graphics.pixiData = pixiData;
        }
      }}
    />
  );
};

export const TestablePixiText: React.FC<
  TestablePixiProps & {
    text: string;
    style?: any;
    anchor?: number | { x: number; y: number };
  }
> = ({ "pixi-data": pixiData, ...props }) => {
  usePixiExtensions();

  return (
    <pixiText
      {...props}
      ref={(text: any) => {
        if (text && pixiData) {
          text.pixiData = pixiData;
        }
      }}
    />
  );
};

// Korean martial arts specific testable components
export const TestableTrigramButton: React.FC<{
  stance: string;
  korean: string;
  english: string;
  x?: number;
  y?: number;
  size?: number;
  isActive?: boolean;
  onClick?: () => void;
}> = ({ stance, korean, english, isActive, onClick, ...props }) => {
  usePixiExtensions();

  return (
    <TestablePixiContainer
      {...props}
      pixi-data={{
        type: "trigram-stance",
        stance,
        korean,
        english,
        isActive,
      }}
      interactive={true}
      onPointerDown={onClick}
    >
      <TestablePixiGraphics
        draw={(g) => {
          g.clear();
          g.beginFill(isActive ? 0xffd700 : 0x666666, 0.8);
          g.drawCircle(0, 0, props.size || 30);
          g.endFill();
        }}
        pixi-data={{
          type: "trigram-stance-button",
          stance,
        }}
      />
      <TestablePixiText
        text={korean}
        style={{ fontSize: 14, fill: 0xffffff }}
        anchor={0.5}
        pixi-data={{
          type: "trigram-stance-text",
          stance,
          text: korean,
        }}
      />
    </TestablePixiContainer>
  );
};

export const TestablePlayer: React.FC<{
  playerId: string;
  archetype: string;
  health: number;
  stance: string;
  x?: number;
  y?: number;
  onClick?: () => void;
}> = ({ playerId, archetype, health, stance, onClick, ...props }) => {
  usePixiExtensions();

  return (
    <TestablePixiContainer
      {...props}
      pixi-data={{
        type: "player",
        playerId,
        archetype,
        health,
        stance,
      }}
      interactive={true}
      onPointerDown={onClick}
    >
      <TestablePixiGraphics
        draw={(g) => {
          g.clear();
          g.beginFill(0x00ccff, 1.0);
          g.drawRect(-30, -60, 60, 120);
          g.endFill();
        }}
        pixi-data={{
          type: "player-body",
          playerId,
        }}
      />
      <TestablePixiText
        text={archetype}
        style={{ fontSize: 12, fill: 0xffffff }}
        anchor={0.5}
        y={-80}
        pixi-data={{
          type: "player-archetype-label",
          playerId,
          archetype,
        }}
      />
    </TestablePixiContainer>
  );
};
