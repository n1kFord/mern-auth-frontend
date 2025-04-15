import { render, screen, act } from "@testing-library/react";
import toast from "react-hot-toast";
import CustomToaster from "./CustomToaster";

// Mock matchMedia for testing environments
beforeAll(() => {
    global.matchMedia = jest.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        addListener: jest.fn(),
        removeListener: jest.fn(),
    }));
});

beforeEach(() => {
    jest.useFakeTimers();
});

afterEach(() => {
    jest.useRealTimers();
});

describe("CustomToaster Component", () => {
    describe("Rendering and Accessibility", () => {
        it("should render Toaster component correctly", async () => {
            render(<CustomToaster />);

            // Trigger a toast message to appear
            await act(async () => {
                toast("Test Toast");
            });

            // Wait for the toast message to appear in the document
            const toastMessage = await screen.findByText("Test Toast");

            // Check if the toast message is in the document
            expect(toastMessage).toBeInTheDocument();
        });
    });

    describe("Behavioral and Interactions", () => {
        it("should disappear after timeout (fade-out effect)", async () => {
            render(<CustomToaster />);

            await act(async () => {
                toast("Test Toast that fades out");
            });

            const toastMessage = await screen.findByText(
                "Test Toast that fades out",
            );

            expect(toastMessage).toBeInTheDocument();

            // Simulate the passing of time for the fade-out effect
            act(() => {
                jest.advanceTimersByTime(5000);
            });

            expect(toastMessage).not.toBeInTheDocument();
        });
    });

    describe("Conditional Rendering", () => {
        it("should show toast correctly when the screen is resized (media queries)", async () => {
            global.matchMedia = jest.fn().mockImplementation((query) => ({
                matches: true,
                media: query,
                addListener: jest.fn(),
                removeListener: jest.fn(),
            }));

            render(<CustomToaster />);

            await act(async () => {
                toast("Responsive Toast");
            });

            const toastMessage = await screen.findByText("Responsive Toast");

            expect(toastMessage).toBeInTheDocument();
        });
    });
});
