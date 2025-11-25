import { render, screen, waitFor } from "@testing-library/react";
import React from "react";
import { describe, expect, it, vi } from "vitest";
import { AudioProvider, useAudio } from "../AudioProvider";

describe("AudioProvider - Deferred Initialization", () => {
  it("should not initialize audio automatically when deferInitialization is true", () => {
    const TestComponent = () => {
      const audio = useAudio();
      return <div>{audio.isAudioReady ? "Ready" : "Not Ready"}</div>;
    };

    render(
      <AudioProvider deferInitialization={true}>
        <TestComponent />
      </AudioProvider>
    );

    expect(screen.getByText("Not Ready")).toBeInTheDocument();
  });

  it("should initialize audio automatically when deferInitialization is false", async () => {
    const TestComponent = () => {
      const audio = useAudio();
      return <div>{audio.isAudioReady ? "Ready" : "Not Ready"}</div>;
    };

    render(
      <AudioProvider deferInitialization={false}>
        <TestComponent />
      </AudioProvider>
    );

    await waitFor(
      () => {
        expect(screen.getByText("Ready")).toBeInTheDocument();
      },
      { timeout: 2000 }
    );
  });

  it("should initialize audio when initializeAudio is called", async () => {
    const TestComponent = () => {
      const audio = useAudio();
      
      React.useEffect(() => {
        audio.initializeAudio();
      }, [audio.initializeAudio]); // Use specific method instead of entire context

      return <div>{audio.isAudioReady ? "Ready" : "Not Ready"}</div>;
    };

    render(
      <AudioProvider deferInitialization={true}>
        <TestComponent />
      </AudioProvider>
    );

    await waitFor(
      () => {
        expect(screen.getByText("Ready")).toBeInTheDocument();
      },
      { timeout: 2000 }
    );
  });

  it("should provide initializeAudio function in context", () => {
    const TestComponent = () => {
      const audio = useAudio();
      return (
        <div>
          {typeof audio.initializeAudio === "function" ? "Has Function" : "No Function"}
        </div>
      );
    };

    render(
      <AudioProvider deferInitialization={true}>
        <TestComponent />
      </AudioProvider>
    );

    expect(screen.getByText("Has Function")).toBeInTheDocument();
  });

  it("should maintain backward compatibility without deferInitialization prop", async () => {
    const TestComponent = () => {
      const audio = useAudio();
      return <div>{audio.isAudioReady ? "Ready" : "Not Ready"}</div>;
    };

    render(
      <AudioProvider>
        <TestComponent />
      </AudioProvider>
    );

    // Should auto-initialize (default behavior)
    await waitFor(
      () => {
        expect(screen.getByText("Ready")).toBeInTheDocument();
      },
      { timeout: 2000 }
    );
  });

  it("should handle initialization errors gracefully", async () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    const TestComponent = () => {
      const audio = useAudio();
      
      React.useEffect(() => {
        audio.initializeAudio();
      }, [audio]);

      return <div>{audio.isAudioReady ? "Ready" : "Not Ready"}</div>;
    };

    render(
      <AudioProvider deferInitialization={true}>
        <TestComponent />
      </AudioProvider>
    );

    // Even with errors, should mark as ready in fallback mode
    await waitFor(
      () => {
        expect(screen.getByText("Ready")).toBeInTheDocument();
      },
      { timeout: 2000 }
    );

    consoleSpy.mockRestore();
  });
});
