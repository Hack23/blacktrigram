import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Application } from "@pixi/react"; // For context wrapping
import { ProgressTracker } from "../ProgressTracker";
import { TrigramWheel } from "../TrigramWheel";
import { KoreanHeader } from "../KoreanHeader";
import { KOREAN_COLORS } from "../../../types/constants";
import { TrigramStance } from "@/types";
import {
  KoreanText,
  KoreanTitle,
  KoreanTechniqueText,
  KoreanStatusText,
  KoreanMartialText,
} from "../base";

// Helper function (consider moving to a utils file if used elsewhere)
const createKoreanText = (korean: string, english: string): KoreanTextType => ({
  korean,
  english,
});

describe("Korean UI Components", () => {
  it("KoreanText renders Korean and English text", () => {
    const { getByText } = render(
      <Application>
        <Stage>
          <KoreanText korean="안녕하세요" english="Hello" />
        </Stage>
      </Application>
    );
    expect(getByText("안녕하세요")).toBeInTheDocument();
    expect(getByText("(Hello)")).toBeInTheDocument(); // Assuming English is wrapped in parens
  });

  it("KoreanTitle renders correctly", () => {
    const { getByText } = render(
      <Application>
        <Stage>
          <KoreanTitle korean="제목" english="Title" level={1} />
        </Stage>
      </Application>
    );
    expect(getByText("제목")).toBeInTheDocument();
    expect(getByText("Title")).toBeInTheDocument();
  });

  it("KoreanTechniqueText renders correctly", () => {
    const { getByText } = render(
      <Application>
        <Stage>
          <KoreanTechniqueText
            korean={createKoreanText("천국의 주먹", "Heaven's Fist")} // Provide KoreanText object
            trigram="geon"
            showStanceSymbol
          />
        </Stage>
      </Application>
    );
    expect(getByText("천국의 주먹")).toBeInTheDocument();
    expect(getByText("(Heaven's Fist)")).toBeInTheDocument();
  });

  it("KoreanStatusText renders correctly", () => {
    const { getByText } = render(
      <Application>
        <Stage>
          <KoreanStatusText
            korean={createKoreanText("건강", "Health")} // Provide KoreanText object
            statusKey="health"
            value={80}
            maxValue={100}
          />
        </Stage>
      </Application>
    );
    expect(getByText("건강: 80/100")).toBeInTheDocument();
  });

  it("KoreanMartialText renders correctly", () => {
    const { getByText } = render(
      <Application>
        <Stage>
          <KoreanMartialText // Use the component
            korean={createKoreanText("사범", "Master")}
            martialVariant="master"
            showHonorific
          />
        </Stage>
      </Application>
    );
    expect(getByText("사범님")).toBeInTheDocument(); // Assuming showHonorific adds 님
  });

  it("TrigramWheel renders", () => {
    const { container } = render(
      <Application>
        <Stage>
          <TrigramWheel
            currentStance={"geon" as TrigramStance}
            onStanceSelect={() => {}}
          />
        </Stage>
      </Application>
    );
    expect(container.querySelector("canvas")).toBeInTheDocument(); // Basic check
  });

  it("ProgressTracker renders", () => {
    const { container } = render(
      <Application>
        <Stage>
          <ProgressTracker
            label="Health"
            value={75}
            maxValue={100}
            barColor={KOREAN_COLORS.SUCCESS_GREEN}
          />
        </Stage>
      </Application>
    );
    expect(container.querySelector("canvas")).toBeInTheDocument(); // Basic check
  });

  it("renders ProgressTracker with correct props", () => {
    render(
      <Application>
        <ProgressTracker
          label="Test Health"
          value={75}
          maxValue={100}
          barColor={KOREAN_COLORS.POSITIVE_GREEN}
        />
      </Application>
    );

    expect(screen.getByText("Test Health")).toBeInTheDocument();
    expect(screen.getByText("75")).toBeInTheDocument();
    expect(screen.getByText("/100")).toBeInTheDocument();
    // Add more assertions as needed
  });
});
