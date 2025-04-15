import { act, render, screen, waitFor } from "@testing-library/react";
import { UserContext } from "../../contexts/UserContext";
import ChangePasswordModal, {
    ChangePasswordModalProps,
} from "./ChangePasswordModal";
import { resizeWindow } from "../../utils/testUtils";
import { changePasswordSchema } from "../../schemas/change-password";
import userEvent from "@testing-library/user-event";
import axiosInstance from "../../axiosConfig";
import toast from "react-hot-toast";
import { AxiosError, AxiosHeaders } from "axios";
import { axe } from "jest-axe";
import { MemoryRouter } from "react-router-dom";

jest.mock("../../axiosConfig", () => ({
    post: jest.fn(),
}));

jest.mock("react-hot-toast", () => ({
    success: jest.fn(),
    error: jest.fn(),
}));

beforeEach(() => {
    jest.clearAllMocks();
});

describe("ChangePasswordModal component", () => {
    const setUserMock = jest.fn();
    const renderChangeModal = (props: ChangePasswordModalProps) => {
        return render(
            <MemoryRouter>
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
                    <ChangePasswordModal {...props} />
                </UserContext.Provider>
            </MemoryRouter>,
        );
    };

    describe("Rendering and Accessibility", () => {
        it("should render the correct content in the modal properly on all screen sizes", () => {
            renderChangeModal({
                isVisible: true,
                onHide: jest.fn(),
            });

            const screenSizes = [1440, 1024, 768, 375];

            for (const size of screenSizes) {
                resizeWindow(size);
                expect(screen.getByText("change password")).toBeInTheDocument();
                expect(
                    screen.getByRole("form", { name: "Change password form" }),
                ).toBeInTheDocument();

                changePasswordSchema.fields.forEach((field) => {
                    // Ensure the input linked to the label is rendered
                    const input = screen.getByLabelText(field.label, {
                        selector: "input",
                    });
                    expect(input).toBeInTheDocument();
                    expect(input).toHaveAttribute("type", field.type);
                    expect(input).toHaveAttribute("name", field.name);
                    expect(input).toHaveAttribute(
                        "placeholder",
                        field.placeholder,
                    );
                });

                expect(
                    screen.getByRole("button", {
                        name: "Cancel password change",
                    }),
                ).toBeInTheDocument();
                expect(
                    screen.getByRole("button", {
                        name: "Confirm password change",
                    }),
                ).toBeInTheDocument();
            }
        });

        it("should have no accessibility violations", async () => {
            const { container } = renderChangeModal({
                isVisible: true,
                onHide: jest.fn(),
            });

            const results = await axe(container);
            expect(results).toHaveNoViolations();
        });
    });

    describe("Behavioral and Interactions", () => {
        it("should call the onHide function when 'Cancel' button is clicked", async () => {
            const onHideMock = jest.fn();

            renderChangeModal({
                isVisible: true,
                onHide: onHideMock,
            });

            await userEvent.click(
                screen.getByRole("button", {
                    name: "Cancel password change",
                }),
            );

            expect(onHideMock).toHaveBeenCalled();
        });

        it("should reset the form after the animation delay", async () => {
            renderChangeModal({
                isVisible: true,
                onHide: jest.fn(),
            });

            const currentPasswordInput = screen.getByLabelText(
                "your current password",
            );

            const cancelButton = screen.getByRole("button", {
                name: "Cancel password change",
            });

            await userEvent.type(
                currentPasswordInput,
                "randomcurrentpassword123",
            );

            expect(currentPasswordInput).toHaveValue(
                "randomcurrentpassword123",
            ); // Ensure input was updated

            await userEvent.click(cancelButton);

            // Wait for the reset delay and verify the form is reset
            await act(async () => {
                await new Promise((resolve) => setTimeout(resolve, 400)); // Match the delay in handleHide
            });

            expect(currentPasswordInput).toHaveValue("");
        });

        it("should submit the form correctly when 'Apply' button is clicked", async () => {
            (axiosInstance.post as jest.Mock).mockResolvedValue({
                data: { msg: "Password changed successfully." },
            });

            const onHideMock = jest.fn();

            renderChangeModal({
                isVisible: true,
                onHide: onHideMock,
            });

            const currentPasswordInput = screen.getByLabelText(
                "your current password",
            );
            const newPasswordInput = screen.getByLabelText("new password");

            const submitButton = screen.getByRole("button", {
                name: "Confirm password change",
            });

            await userEvent.type(
                currentPasswordInput,
                "randomcurrentpassword123",
            );
            await userEvent.type(newPasswordInput, "randomnewpassword123");

            await userEvent.click(submitButton);

            expect(axiosInstance.post).toHaveBeenCalledWith(
                "/user/change-password",
                {
                    currentPassword: "randomcurrentpassword123",
                    newPassword: "randomnewpassword123",
                },
                { withCredentials: true },
            );

            await waitFor(() => {
                expect(setUserMock).toHaveBeenCalledWith(null);
                expect(onHideMock).toHaveBeenCalled();
            });

            // Assert toast.success was called
            expect(toast.success).toHaveBeenCalledWith(
                "Password changed successfully.",
                {
                    duration: 5000,
                },
            );
        });

        it("should display an error toast with the appropriate message if the password is not changed", async () => {
            const mockErrorResponse = new AxiosError(
                "Change failed",
                "ERR_NETWORK",
                undefined,
                undefined,
                {
                    data: { msg: "Change failed. Please try again." },
                    status: 500,
                    statusText: "Internal Server Error",
                    headers: new AxiosHeaders(),
                    config: {
                        headers: new AxiosHeaders(),
                    },
                },
            );
            (axiosInstance.post as jest.Mock).mockRejectedValue(
                mockErrorResponse,
            );

            renderChangeModal({
                isVisible: true,
                onHide: jest.fn(),
            });

            const currentPasswordInput = screen.getByLabelText(
                "your current password",
            );
            const newPasswordInput = screen.getByLabelText("new password");

            const submitButton = screen.getByRole("button", {
                name: "Confirm password change",
            });

            await userEvent.type(
                currentPasswordInput,
                "randomcurrentpassword123",
            );
            await userEvent.type(newPasswordInput, "randomnewpassword123");

            await userEvent.click(submitButton);

            await waitFor(() => {
                expect(toast.error).toHaveBeenCalledWith(
                    "Change failed. Please try again.",
                    { duration: 5000 },
                );
            });
        });
    });

    describe("Conditional Rendering", () => {
        it("should disable 'Cancel' and 'Apply' buttons when submitting", async () => {
            (axiosInstance.post as jest.Mock).mockImplementation(
                () => new Promise(() => {}),
            );

            renderChangeModal({
                isVisible: true,
                onHide: jest.fn(),
            });

            const currentPasswordInput = screen.getByLabelText(
                "your current password",
            );
            const newPasswordInput = screen.getByLabelText("new password");

            const cancelButton = screen.getByRole("button", {
                name: "Cancel password change",
            });

            const submitButton = screen.getByRole("button", {
                name: "Confirm password change",
            });

            await userEvent.type(
                currentPasswordInput,
                "randomcurrentpassword123",
            );
            await userEvent.type(newPasswordInput, "randomnewpassword123");

            await userEvent.click(submitButton);

            expect(cancelButton).toBeDisabled();
            expect(submitButton).toBeDisabled();
        });

        it("should show 'Apply' button with loading state while submitting", async () => {
            (axiosInstance.post as jest.Mock).mockImplementation(
                () => new Promise(() => {}),
            );

            renderChangeModal({
                isVisible: true,
                onHide: jest.fn(),
            });

            const currentPasswordInput = screen.getByLabelText(
                "your current password",
            );
            const newPasswordInput = screen.getByLabelText("new password");

            const submitButton = screen.getByRole("button", {
                name: "Confirm password change",
            });

            await userEvent.type(
                currentPasswordInput,
                "randomcurrentpassword123",
            );
            await userEvent.type(newPasswordInput, "randomnewpassword123");

            await userEvent.click(submitButton);

            expect(submitButton).toHaveClass("loading");
        });

        it("should re-enable buttons after submission completes", async () => {
            (axiosInstance.post as jest.Mock).mockResolvedValue({
                data: { msg: "Password changed successfully." },
            });

            renderChangeModal({
                isVisible: true,
                onHide: jest.fn(),
            });

            const currentPasswordInput = screen.getByLabelText(
                "your current password",
            );
            const newPasswordInput = screen.getByLabelText("new password");

            const cancelButton = screen.getByRole("button", {
                name: "Cancel password change",
            });

            const submitButton = screen.getByRole("button", {
                name: "Confirm password change",
            });

            await userEvent.type(
                currentPasswordInput,
                "randomcurrentpassword123",
            );
            await userEvent.type(newPasswordInput, "randomnewpassword123");

            await userEvent.click(submitButton);

            await waitFor(() => {
                expect(cancelButton).toBeEnabled();
                expect(submitButton).toBeEnabled();
            });
        });
    });
});
