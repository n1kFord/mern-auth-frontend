import { render, screen } from "@testing-library/react";
import Modal, { ModalProps } from "./Modal";
import { resizeWindow } from "../../utils/testUtils";
import { axe } from "jest-axe";
import { closeIcon } from "../../assets";
import userEvent from "@testing-library/user-event";

describe("Modal Component", () => {
    const renderModal = (props: ModalProps) => {
        return render(<Modal {...props} />);
    };

    describe("Rendering and Accessibility", () => {
        it("should render the modal properly on all screen sizes and check accessibility attributes", () => {
            renderModal({
                isVisible: true,
                disableClose: false,
                onHide: jest.fn(),
                title: "Test Modal title",
                subtitle: "Test Modal subtitle",
                children: <p>Modal content</p>,
            });

            const screenSizes = [1440, 1024, 768, 375];
            for (const size of screenSizes) {
                resizeWindow(size);

                const modal = screen.getByTestId("modal");
                expect(modal).toHaveAttribute("aria-hidden", "false");

                const title = screen.getByTestId("modal-title");
                expect(modal).toHaveAttribute("aria-labelledby", "modal-title");
                expect(title).toHaveAttribute("id", "modal-title");

                const subtitle = screen.getByTestId("modal-subtitle");
                expect(modal).toHaveAttribute(
                    "aria-describedby",
                    "modal-subtitle",
                );
                expect(subtitle).toHaveAttribute("id", "modal-subtitle");

                expect(title).toBeVisible();
                expect(subtitle).toBeVisible();
                expect(screen.getByText("Modal content")).toBeVisible();

                const closeButton = screen.getByRole("button", {
                    name: "Close modal",
                });
                expect(closeButton).toBeVisible();

                expect(closeButton).not.toBeDisabled();

                const icon = closeButton.querySelector("img");
                expect(icon).toBeVisible();
                expect(icon).toHaveAttribute("src", closeIcon);
                expect(icon).toHaveAttribute("alt", "close modal");
            }
        });

        it("should have no accessibility violations", async () => {
            const { container } = renderModal({
                isVisible: true,
                disableClose: false,
                onHide: jest.fn(),
                title: "Test Modal title",
                subtitle: "Test Modal subtitle",
                children: <p>Modal content</p>,
            });
            const results = await axe(container);
            expect(results).toHaveNoViolations();
        });

        it("should not render the modal when isVisible is false", async () => {
            renderModal({
                isVisible: false,
                disableClose: false,
                onHide: jest.fn(),
                children: <p>Modal content</p>,
            });

            const modal = screen.getByTestId("modal");

            expect(modal).toHaveAttribute("aria-hidden", "true");
            expect(modal).not.toHaveClass("visible");
        });
    });

    describe("Behavior and Interactions", () => {
        it("should call onHide when the close button is clicked", () => {
            const onHideMock = jest.fn();

            renderModal({
                isVisible: true,
                disableClose: false,
                onHide: onHideMock,
                children: <p>Modal content</p>,
            });

            const closeButton = screen.getByRole("button", {
                name: "Close modal",
            });
            closeButton.click();

            expect(onHideMock).toHaveBeenCalledTimes(1);
        });

        it("should disable the close button when disableClose is true", () => {
            renderModal({
                isVisible: true,
                disableClose: true,
                onHide: jest.fn(),
                children: <p>Modal content</p>,
            });

            const closeButton = screen.getByRole("button", {
                name: "Close modal",
            });
            expect(closeButton).toBeDisabled();
        });

        it("should call onHide when the user clicks on the modal backdrop", () => {
            const onHideMock = jest.fn();
            renderModal({
                isVisible: true,
                disableClose: false,
                onHide: onHideMock,
                children: <p>Modal content</p>,
            });

            const modal = screen.getByTestId("modal");
            modal.click();

            expect(onHideMock).toHaveBeenCalledTimes(1);
        });

        it("should not call onHide when disableClose is true and the user clicks on the modal backdrop", () => {
            const onHideMock = jest.fn();
            renderModal({
                isVisible: true,
                disableClose: true,
                onHide: onHideMock,
                children: <p>Modal content</p>,
            });

            const modal = screen.getByTestId("modal");
            modal.click();

            expect(onHideMock).toHaveBeenCalledTimes(0);
        });

        it("should not call onHide when clicking inside the modal container", () => {
            const onHideMock = jest.fn();

            renderModal({
                isVisible: true,
                disableClose: false,
                onHide: onHideMock,
                children: <p>Modal content</p>,
            });

            const modalContainer = screen.getByRole("document");
            modalContainer.click();

            expect(onHideMock).toHaveBeenCalledTimes(0);
        });

        it("should add the keydown event listener to the window when isVisible is true", () => {
            const addEventListenerSpy = jest.spyOn(window, "addEventListener");

            renderModal({
                isVisible: true,
                disableClose: false,
                onHide: jest.fn(),
                children: <p>Modal content</p>,
            });

            expect(addEventListenerSpy).toHaveBeenCalledWith(
                "keydown",
                expect.any(Function),
            );
            addEventListenerSpy.mockRestore();
        });

        it("should remove the keydown event listener when isVisible becomes false", () => {
            const addEventListenerSpy = jest.spyOn(window, "addEventListener");
            const removeEventListenerSpy = jest.spyOn(
                window,
                "removeEventListener",
            );

            const onHideMock = jest.fn();

            const { rerender } = renderModal({
                isVisible: true,
                disableClose: false,
                onHide: onHideMock,
                children: <p>Modal content</p>,
            });

            expect(addEventListenerSpy).toHaveBeenCalledWith(
                "keydown",
                expect.any(Function),
            );

            const addedHandler = addEventListenerSpy.mock.calls[0][1];

            rerender(
                <Modal
                    isVisible={false}
                    disableClose={false}
                    onHide={onHideMock}
                >
                    <p>Modal content</p>
                </Modal>,
            );

            expect(removeEventListenerSpy).toHaveBeenCalledWith(
                "keydown",
                addedHandler,
            );

            addEventListenerSpy.mockRestore();
            removeEventListenerSpy.mockRestore();
        });

        it("should call onHide when the Escape key is pressed while the modal is visible", async () => {
            const onHideMock = jest.fn();

            renderModal({
                isVisible: true,
                disableClose: false,
                onHide: onHideMock,
                children: <p>Modal content</p>,
            });

            await userEvent.keyboard("{Escape}");

            expect(onHideMock).toHaveBeenCalledTimes(1);
        });

        it("should not call onHide when disableClose is true and the Escape key is pressed", async () => {
            const onHideMock = jest.fn();

            renderModal({
                isVisible: true,
                disableClose: true,
                onHide: onHideMock,
                children: <p>Modal content</p>,
            });

            await userEvent.keyboard("{Escape}");

            expect(onHideMock).toHaveBeenCalledTimes(0);
        });
    });

    describe("Conditional Rendering", () => {
        it("should not render the title if title prop is not provided", () => {
            renderModal({
                isVisible: true,
                disableClose: false,
                onHide: jest.fn(),
                children: <p>Modal content</p>,
            });

            const title = screen.queryByTestId("modal-title");
            expect(title).not.toBeInTheDocument();

            const modal = screen.getByTestId("modal");
            expect(modal).not.toHaveAttribute("aria-labelledby");
        });

        it("should not render the subtitle if subtitle prop is not provided", () => {
            renderModal({
                isVisible: true,
                disableClose: false,
                onHide: jest.fn(),
                title: "Uniquetitle123",
                children: <p>Modal content</p>,
            });

            const subtitle = screen.queryByTestId("modal-subtitle");
            expect(subtitle).not.toBeInTheDocument();

            const modal = screen.getByTestId("modal");
            expect(modal).not.toHaveAttribute("aria-describedby");
        });
    });
});
