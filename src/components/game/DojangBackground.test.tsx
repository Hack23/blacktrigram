import { render } from "@testing-library/react";
import { describe, it } from "vitest";
import { DojangBackground } from "./DojangBackground";

describe("DojangBackground", () => {
  it("renders correctly with default props", () => {
    render(<DojangBackground width={800} height={600} />);
  });

  it("should render with cyberpunk lighting", () => {
    render(
      <DojangBackground
        width={800}
        height={600}
        lighting="cyberpunk"
        animate={true}
      />
    );
  });

  it("should render with traditional lighting", () => {
    render(
      <DojangBackground
        width={800}
        height={600}
        lighting="traditional"
        animate={false}
      />
    );
  });
});
