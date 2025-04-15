import { render, screen, waitFor, act } from "@testing-library/react";
import CopyButton from "./CopyButton";
import { copyIcon } from "../assets";

// Mock ResizeObserver to prevent errors in the test environment
beforeEach(() => {
    // Mock the clipboard API correctly using Object.defineProperty
    Object.defineProperty(global.navigator, "clipboard", {
        value: {
            writeText: jest.fn().mockResolvedValue(undefined), // Mock the writeText function
        },
        writable: true, // Allow the property to be writable in the test environment
    });

    // Mock ResizeObserver with correct method implementations
    global.ResizeObserver = jest.fn().mockImplementation(() => ({
        observe: jest.fn(),
        unobserve: jest.fn(),
        disconnect: jest.fn(),
    }));

    jest.useFakeTimers();
});

afterEach(() => {
    jest.useRealTimers();
});

describe("CopyButton Component", () => {
    describe("Rendering and Accessibility", () => {
        it("should render the button properly", () => {
            render(<CopyButton textToCopy="Test text" uniqueId="test-1" />);

            // Check if the button is rendered
            const button = screen.getByRole("button", {
                name: "Copy text to clipboard",
            });
            expect(button).toBeInTheDocument();

            // Check if the icon is rendered inside the button
            const icon = screen.getByRole("img");
            expect(icon).toHaveAttribute("src", copyIcon);
        });

        it("should apply custom icon size and margin", () => {
            render(
                <CopyButton
                    textToCopy="Test text"
                    uniqueId="test-1"
                    iconSize="24px"
                    margin="10px"
                />,
            );

            const button = screen.getByRole("button", {
                name: "Copy text to clipboard",
            });
            const icon = screen.getByRole("img");

            // Check if custom margin is applied to the button
            expect(button).toHaveStyle("margin: 10px");

            // Check if custom icon size is applied
            expect(icon).toHaveStyle("width: 24px");
            expect(icon).toHaveStyle("height: 24px");
        });
    });

    describe("Behavioral and Interactions", () => {
        it("should copy the correct text to the clipboard", async () => {
            render(<CopyButton textToCopy="Test text" uniqueId="test-1" />);

            // Trigger the click event on the button and wrap it in act()
            await act(async () => {
                screen
                    .getByRole("button", { name: "Copy text to clipboard" })
                    .click();
            });

            // Wait for the clipboard write action
            await waitFor(() => {
                // Ensure the clipboard writeText function was called with the correct text
                expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
                    "Test text",
                );
            });
        });
    });

    describe("Conditional Rendering", () => {
        it("should show the tooltip when text is copied", async () => {
            render(<CopyButton textToCopy="Test text" uniqueId="test-1" />);

            // Trigger the click event on the button and wrap it in act()
            await act(async () => {
                screen
                    .getByRole("button", { name: "Copy text to clipboard" })
                    .click();
            });

            // Wait for the tooltip to appear
            await waitFor(() => {
                expect(
                    screen.getByText("Copied to clipboard!"),
                ).toBeInTheDocument();
            });
        });

        it("should hide the tooltip after the timeout", async () => {
            render(<CopyButton textToCopy="Test text" uniqueId="test-1" />);

            // Trigger the click event on the button and wrap it in act()
            await act(async () => {
                screen
                    .getByRole("button", { name: "Copy text to clipboard" })
                    .click();
            });

            // Wait for the tooltip to appear
            await waitFor(() => {
                expect(
                    screen.getByText("Copied to clipboard!"),
                ).toBeInTheDocument();
            });

            // Fast forward the timers and check that the tooltip disappears
            act(() => {
                jest.advanceTimersByTime(1800); // Wait for the tooltip to disappear after timeout
            });

            // Ensure the tooltip is no longer in the document
            await waitFor(() => {
                expect(
                    screen.queryByText("Copied to clipboard!"),
                ).not.toBeInTheDocument();
            });
        });
    });
});
