import { render, screen, waitFor } from "@testing-library/react";
import DeleteAccountModal, {
    DeleteAccountModalProps,
} from "./DeleteAccountModal";
import { resizeWindow } from "../../utils/testUtils";
import { UserContext } from "../../contexts/UserContext";
import userEvent from "@testing-library/user-event";
import toast from "react-hot-toast";
import axiosInstance from "../../axiosConfig";
import { AxiosError, AxiosHeaders } from "axios";
import { axe } from "jest-axe";

jest.mock("../../axiosConfig", () => ({
    delete: jest.fn(),
}));

jest.mock("react-hot-toast", () => ({
    success: jest.fn(),
    error: jest.fn(),
}));

beforeEach(() => {
    jest.clearAllMocks();
});

describe("DeleteAccountModal component", () => {
    const setUserMock = jest.fn();
    const renderDeleteModal = (props: DeleteAccountModalProps) => {
        return render(
            <UserContext.Provider
                value={{
                    user: {
                        username: "testUser",
                        email: "test@example.com",
                        logo: "test-logo.png",
                        created_at: "2023-01-01T00:00:00Z",
                        _id: "user123",
                        authProvider: "local",
                    },
                    setUser: setUserMock,
                    isLoading: false,
                }}
            >
                <DeleteAccountModal {...props} />
            </UserContext.Provider>,
        );
    };
    describe("Rendering and Accessibility", () => {
        it("should render the correct content in the modal properly on all screen sizes", () => {
            renderDeleteModal({ isVisible: true, onHide: jest.fn() });

            const screenSizes = [1440, 1024, 768, 375];
            for (const size of screenSizes) {
                resizeWindow(size);

                expect(screen.getByText("are you sure?")).toBeInTheDocument();
                expect(
                    screen.getByTestId("delete-modal-warning"),
                ).toBeInTheDocument();
                expect(
                    screen.getByTestId("delete-modal-sure"),
                ).toBeInTheDocument();

                expect(
                    screen.getByRole("button", {
                        name: "Cancel the account deletion",
                    }),
                ).toBeInTheDocument();
                expect(
                    screen.getByRole("button", {
                        name: "Confirm account deletion",
                    }),
                ).toBeInTheDocument();
            }
        });

        it("should have no accessibility violations", async () => {
            const { container } = renderDeleteModal({
                isVisible: true,
                onHide: jest.fn(),
            });
            const results = await axe(container);
            expect(results).toHaveNoViolations();
        });
    });

    describe("Behavioral and Interactions", () => {
        it("should call onHide when clicking 'Cancel' button", () => {
            const onHideMock = jest.fn();
            renderDeleteModal({ isVisible: true, onHide: onHideMock });

            const deleteButton = screen.getByRole("button", {
                name: "Cancel the account deletion",
            });

            deleteButton.click();

            expect(onHideMock).toHaveBeenCalledTimes(1);
        });

        it("should send a request to delete the account when 'Delete' button is clicked", async () => {
            renderDeleteModal({ isVisible: true, onHide: jest.fn() });

            const deleteButton = screen.getByRole("button", {
                name: "Confirm account deletion",
            });

            await userEvent.click(deleteButton);

            expect(axiosInstance.delete).toHaveBeenCalledWith(
                "/user/delete-account",
                { withCredentials: true },
            );
        });

        it("should call setUser with null after successful deletion", async () => {
            (axiosInstance.delete as jest.Mock).mockResolvedValue({
                data: { msg: "Account deleted successfully." },
            });

            const onHideMock = jest.fn();

            renderDeleteModal({ isVisible: true, onHide: onHideMock });

            const deleteButton = screen.getByRole("button", {
                name: "Confirm account deletion",
            });

            await userEvent.click(deleteButton);

            await waitFor(() => {
                expect(setUserMock).toHaveBeenCalledWith(null);
                expect(onHideMock).toHaveBeenCalled();
            });
        });

        it("should show success toast after successful deletion", async () => {
            (axiosInstance.delete as jest.Mock).mockResolvedValue({
                data: { msg: "Account deleted successfully." },
            });

            renderDeleteModal({ isVisible: true, onHide: jest.fn() });

            const deleteButton = screen.getByRole("button", {
                name: "Confirm account deletion",
            });

            await userEvent.click(deleteButton);

            await waitFor(() => {
                expect(toast.success).toHaveBeenCalledWith(
                    "Account deleted successfully.",
                    { duration: 5000 },
                );
            });
        });

        it("should show error toast when deletion fails", async () => {
            const mockErrorResponse = new AxiosError(
                "Deletion failed",
                "ERR_NETWORK",
                undefined,
                undefined,
                {
                    data: { msg: "Deletion failed. Please try again." },
                    status: 500,
                    statusText: "Internal Server Error",
                    headers: new AxiosHeaders(),
                    config: {
                        headers: new AxiosHeaders(),
                    },
                },
            );
            (axiosInstance.delete as jest.Mock).mockRejectedValue(
                mockErrorResponse,
            );

            renderDeleteModal({ isVisible: true, onHide: jest.fn() });

            const deleteButton = screen.getByRole("button", {
                name: "Confirm account deletion",
            });

            await userEvent.click(deleteButton);

            await waitFor(() => {
                expect(toast.error).toHaveBeenCalledWith(
                    "Deletion failed. Please try again.",
                    { duration: 5000 },
                );
            });
        });
    });

    describe("Conditional Rendering", () => {
        it("should disable 'Cancel' and 'Delete' buttons when submitting", async () => {
            (axiosInstance.delete as jest.Mock).mockImplementation(
                () => new Promise(() => {}),
            );

            renderDeleteModal({ isVisible: true, onHide: jest.fn() });

            const cancelButton = screen.getByRole("button", {
                name: "Cancel the account deletion",
            });
            const deleteButton = screen.getByRole("button", {
                name: "Confirm account deletion",
            });

            await userEvent.click(deleteButton);

            expect(cancelButton).toBeDisabled();
            expect(deleteButton).toBeDisabled();
        });

        it("should show 'Delete' button with loading state while submitting", async () => {
            (axiosInstance.delete as jest.Mock).mockImplementation(
                () => new Promise(() => {}),
            );

            renderDeleteModal({ isVisible: true, onHide: jest.fn() });

            const deleteButton = screen.getByRole("button", {
                name: "Confirm account deletion",
            });

            await userEvent.click(deleteButton);

            expect(deleteButton).toHaveClass("loading");
        });

        it("should re-enable buttons after submission completes", async () => {
            renderDeleteModal({ isVisible: true, onHide: jest.fn() });

            const cancelButton = screen.getByRole("button", {
                name: "Cancel the account deletion",
            });
            const deleteButton = screen.getByRole("button", {
                name: "Confirm account deletion",
            });

            await userEvent.click(deleteButton);

            await waitFor(() => {
                expect(cancelButton).toBeEnabled();
                expect(deleteButton).toBeEnabled();
            });
        });
    });
});
