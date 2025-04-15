import { renderHook } from "@testing-library/react";
import { BackgroundProvider } from "../contexts/BackgroundContext";
import usePageBackground from "./usePageBackground";

describe("usePageBackground", () => {
    it("should set the background to the currentBackground value on mount", () => {
        const { result } = renderHook(
            () => usePageBackground("test-background"),
            {
                wrapper: BackgroundProvider,
            },
        );

        expect(result.current).toBe("test-background");
    });

    it("should update background context correctly", () => {
        const { result } = renderHook(
            () => usePageBackground("initial-background"),
            {
                wrapper: BackgroundProvider,
            },
        );

        expect(result.current).toBe("initial-background");

        // Render the hook again with a new background
        const { result: updatedResult } = renderHook(
            () => usePageBackground("updated-background"),
            { wrapper: BackgroundProvider },
        );

        expect(updatedResult.current).toBe("updated-background");
    });
});
