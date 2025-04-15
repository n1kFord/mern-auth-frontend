import { render, screen } from "@testing-library/react";
import { useBackground, BackgroundProvider } from "./BackgroundContext";
import userEvent from "@testing-library/user-event";

const TestComponent = () => {
    const { background, setBackground } = useBackground();

    return (
        <div>
            <p data-testid="background-value">{background}</p>
            <button
                onClick={() => setBackground("blue")}
                data-testid="change-background-btn"
            >
                Change Background
            </button>
        </div>
    );
};

describe("BackgroundContext", () => {
    test("should throw an error if used outside of BackgroundProvider", () => {
        const originalError = console.error;
        console.error = jest.fn();

        const renderWithoutProvider = () => render(<TestComponent />);
        expect(renderWithoutProvider).toThrow(
            "useBackground must be used within a BackgroundProvider",
        );

        console.error = originalError;
    });

    test("should provide default background value", () => {
        render(
            <BackgroundProvider>
                <TestComponent />
            </BackgroundProvider>,
        );

        const backgroundValue = screen.getByTestId("background-value");
        expect(backgroundValue).toHaveTextContent("");
    });

    test("should update background value when setBackground is called", async () => {
        render(
            <BackgroundProvider>
                <TestComponent />
            </BackgroundProvider>,
        );

        const backgroundValue = screen.getByTestId("background-value");
        expect(backgroundValue).toHaveTextContent("");

        const changeBackgroundBtn = screen.getByTestId("change-background-btn");
        await userEvent.click(changeBackgroundBtn);

        expect(backgroundValue).toHaveTextContent("blue");
    });
});
