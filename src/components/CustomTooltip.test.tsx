import { render, screen, waitFor } from "@testing-library/react";
import { act } from "react";
import CustomTooltip from "./CustomTooltip";

describe("CustomTooltip component", () => {
    const defaultProps = {
        id: "test-tooltip",
        content: "Test tooltip content",
        isOpen: true,
    };

    const renderComponent = (props = {}) =>
        render(<CustomTooltip {...defaultProps} {...props} />);

    describe("Rendering and Accessibility", () => {
        test("should render properly", async () => {
            renderComponent();
            const tooltip = await waitFor(() =>
                screen.getByText(/test tooltip content/i),
            );
            expect(tooltip).toBeInTheDocument();
            expect(tooltip).toHaveStyle("background-color: #25414a");
            expect(tooltip).toHaveStyle("color: #e6e6e6");
        });

        test("should have the correct id", () => {
            renderComponent();
            const tooltip = screen.getByText(/test tooltip content/i);
            expect(tooltip).toHaveAttribute("id", "test-tooltip");
        });
    });

    describe("Behavioral and Interactions", () => {
        test("should apply custom styles", () => {
            renderComponent({
                style: { backgroundColor: "#123456", color: "#ffffff" },
            });

            const tooltip = screen.getByText(/test tooltip content/i);
            expect(tooltip).toHaveStyle("background-color: #123456");
            expect(tooltip).toHaveStyle("color: #ffffff");
        });

        test("should set font size based on window width", async () => {
            global.innerWidth = 480;
            act(() => {
                global.dispatchEvent(new Event("resize"));
            });

            renderComponent();
            const tooltip = await waitFor(() =>
                screen.getByText(/test tooltip content/i),
            );
            expect(tooltip).toHaveStyle("font-size: 12px");

            act(() => {
                global.innerWidth = 600;
                global.dispatchEvent(new Event("resize"));
            });

            await waitFor(() => {
                expect(tooltip).toHaveStyle("font-size: 14px");
            });
        });
    });

    describe("Conditional Rendering", () => {
        test("should not render tooltip when isOpen is false", () => {
            renderComponent({ isOpen: false });
            const tooltip = screen.queryByText(/test tooltip content/i);
            expect(tooltip).not.toBeInTheDocument();
        });

        test("should display updated content", async () => {
            const { rerender } = renderComponent();
            const tooltip = await waitFor(() =>
                screen.getByText(/test tooltip content/i),
            );
            expect(tooltip).toBeInTheDocument();

            rerender(
                <CustomTooltip {...defaultProps} content="Updated content" />,
            );
            expect(screen.getByText(/updated content/i)).toBeInTheDocument();
        });
    });
});
