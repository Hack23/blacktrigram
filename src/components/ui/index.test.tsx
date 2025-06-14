import { render } from "@testing-library/react";
import { Application } from "@pixi/react";
import { BaseButton } from "./base/BaseButton";
import { KoreanHeader } from "./KoreanHeader";

describe("UI Components", () => {
  const koreanText = "버튼"; // Fix: Use string as expected by BaseButton

  it("renders BaseButton with Korean text", () => {
    render(
      <Application>
        <BaseButton
          text={koreanText} // Fix: Use string
          onClick={() => {}}
        />
      </Application>
    );
  });

  it("renders KoreanHeader with title", () => {
    const titleText = { korean: "제목", english: "Title" };

    render(
      <Application>
        <KoreanHeader
          title={titleText} // Fix: Use correct type
        />
      </Application>
    );
  });
});
