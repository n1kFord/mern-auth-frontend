import { act, render, screen, waitFor } from "@testing-library/react";
import { UserContext } from "../../contexts/UserContext";
import ChangeUsernameModal, {
    ChangeUsernameModalProps,
} from "./ChangeUsernameModal";
import { resizeWindow } from "../../utils/testUtils";
import { changeUsernameSchema } from "../../schemas/change-name";
import userEvent from "@testing-library/user-event";
import axiosInstance from "../../axiosConfig";
import toast from "react-hot-toast";
import { AxiosError, AxiosHeaders } from "axios";
import { axe } from "jest-axe";

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

describe("ChangeUsernameModal component", () => {
    const setUserMock = jest.fn();
    const renderСhangeModal = (props: ChangeUsernameModalProps) => {
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
                <ChangeUsernameModal {...props} />
            </UserContext.Provider>,
        );
    };

    describe("Rendering and Accessibility", () => {
        it("should render the correct content in the modal properly on all screen sizes", () => {
            renderСhangeModal({
                isVisible: true,
                onHide: jest.fn(),
                currentUsername: "testUser",
            });

            const screenSizes = [1440, 1024, 768, 375];
            for (const size of screenSizes) {
                resizeWindow(size);

                expect(
                    screen.getByText("your current username:"),
                ).toBeInTheDocument();
                expect(screen.getByText("testUser")).toBeInTheDocument();
                expect(
                    screen.getByRole("form", { name: "Change username form" }),
                ).toBeInTheDocument();

                changeUsernameSchema.fields.forEach((field) => {
                    // Ensure the input linked to the label is rendered
                    const input = screen.getByLabelText(field.label, {
                        selector: "input",
                    });
                    expect(input).toBeInTheDocument();
                    expect(input).toHaveAttribute("name", field.name);
                    expect(input).toHaveAttribute("type", field.type);
                    expect(input).toHaveAttribute(
                        "placeholder",
                        field.placeholder,
                    );
                });

                expect(
                    screen.getByRole("button", {
                        name: "Cancel username change",
                    }),
                ).toBeInTheDocument();
                expect(
                    screen.getByRole("button", {
                        name: "Confirm username change",
                    }),
                ).toBeInTheDocument();
            }
        });

        it("should have no accessibility violations", async () => {
            const { container } = renderСhangeModal({
                isVisible: true,
                onHide: jest.fn(),
                currentUsername: "testUser",
            });
            const results = await axe(container);
            expect(results).toHaveNoViolations();
        });
    });

    describe("Behavioral and Interactions", () => {
        it("should call the onHide function when 'Cancel' button is clicked", async () => {
            const onHideMock = jest.fn();
            renderСhangeModal({
                isVisible: true,
                onHide: onHideMock,
                currentUsername: "testUser",
            });

            await userEvent.click(
                screen.getByRole("button", {
                    name: "Cancel username change",
                }),
            );

            expect(onHideMock).toHaveBeenCalled();
        });

        it("should reset the form after the animation delay", async () => {
            renderСhangeModal({
                isVisible: true,
                onHide: jest.fn(),
                currentUsername: "testUser",
            });

            const usernameInput = screen.getByRole("textbox", {
                name: "username",
            });
            const cancelButton = screen.getByRole("button", {
                name: "Cancel username change",
            });

            await userEvent.type(usernameInput, "newUsername");
            expect(usernameInput).toHaveValue("newUsername"); // Ensure input was updated

            await userEvent.click(cancelButton);

            // Wait for the reset delay and verify the form is reset
            await act(async () => {
                await new Promise((resolve) => setTimeout(resolve, 400)); // Match the delay in handleHide
            });
            expect(usernameInput).toHaveValue("");
        });

        it("should submit the form correctly when 'Change' button is clicked", async () => {
            const newUsername = "testUser2";
            (axiosInstance.post as jest.Mock).mockResolvedValue({
                data: { msg: "Username changed successfully.", newUsername },
            });

            const onHideMock = jest.fn();
            renderСhangeModal({
                isVisible: true,
                onHide: onHideMock,
                currentUsername: "testUser",
            });

            const usernameInput = screen.getByRole("textbox", {
                name: "username",
            });

            const submitButton = screen.getByRole("button", {
                name: "Confirm username change",
            });

            await userEvent.type(usernameInput, newUsername);

            await userEvent.click(submitButton);

            // Assert axios post was called with the correct payload
            expect(axiosInstance.post).toHaveBeenCalledWith(
                "/user/change-username",
                { username: newUsername },
                { withCredentials: true },
            );

            // Assert setUser was called to update the username
            expect(setUserMock).toHaveBeenCalledWith(expect.any(Function));

            const updateUserFunction = setUserMock.mock.calls[0][0];
            const currentUser = {
                username: "testUser",
                email: "test@example.com",
                logo: "test-logo.png",
                created_at: "2023-01-01T00:00:00Z",
                _id: "user123",
            };

            const updatedUser = updateUserFunction(currentUser);

            expect(updatedUser).toEqual({
                ...currentUser,
                username: newUsername,
            });

            // Assert toast.success was called
            expect(toast.success).toHaveBeenCalledWith(
                "Username changed successfully.",
                {
                    duration: 5000,
                },
            );

            // Assert the modal was closed
            expect(onHideMock).toHaveBeenCalled();
        });

        it("should display an error toast with the appropriate message if the username is not changed", async () => {
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

            renderСhangeModal({
                isVisible: true,
                onHide: jest.fn(),
                currentUsername: "testUser",
            });

            const usernameInput = screen.getByRole("textbox", {
                name: "username",
            });

            const submitButton = screen.getByRole("button", {
                name: "Confirm username change",
            });

            await userEvent.type(usernameInput, "randomUsername123");

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
        it("should disable 'Cancel' and 'Change' buttons when submitting", async () => {
            (axiosInstance.post as jest.Mock).mockImplementation(
                () => new Promise(() => {}),
            );

            renderСhangeModal({
                isVisible: true,
                onHide: jest.fn(),
                currentUsername: "testUser",
            });

            const usernameInput = screen.getByRole("textbox", {
                name: "username",
            });

            const cancelButton = screen.getByRole("button", {
                name: "Cancel username change",
            });

            const submitButton = screen.getByRole("button", {
                name: "Confirm username change",
            });

            await userEvent.type(usernameInput, "randomUsername123");

            await userEvent.click(submitButton);

            expect(cancelButton).toBeDisabled();
            expect(submitButton).toBeDisabled();
        });

        it("should disable 'Change' button when the new username is identical to the current one", async () => {
            renderСhangeModal({
                isVisible: true,
                onHide: jest.fn(),
                currentUsername: "testUser",
            });

            const usernameInput = screen.getByRole("textbox", {
                name: "username",
            });

            const submitButton = screen.getByRole("button", {
                name: "Confirm username change",
            });

            await userEvent.type(usernameInput, "testUser");
            expect(submitButton).toBeDisabled();
        });

        it("should show 'Change' button with loading state while submitting", async () => {
            (axiosInstance.post as jest.Mock).mockImplementation(
                () => new Promise(() => {}),
            );

            renderСhangeModal({
                isVisible: true,
                onHide: jest.fn(),
                currentUsername: "testUser",
            });

            const usernameInput = screen.getByRole("textbox", {
                name: "username",
            });

            const submitButton = screen.getByRole("button", {
                name: "Confirm username change",
            });

            await userEvent.type(usernameInput, "randomUsername123");

            await userEvent.click(submitButton);

            expect(submitButton).toHaveClass("loading");
        });

        it("should re-enable buttons after submission completes", async () => {
            const newUsername = "testUser2";
            (axiosInstance.post as jest.Mock).mockResolvedValue({
                data: { msg: "Username changed successfully.", newUsername },
            });
            renderСhangeModal({
                isVisible: true,
                onHide: jest.fn(),
                currentUsername: "testUser",
            });

            const cancelButton = screen.getByRole("button", {
                name: "Cancel username change",
            });

            const submitButton = screen.getByRole("button", {
                name: "Confirm username change",
            });

            const usernameInput = screen.getByRole("textbox", {
                name: "username",
            });

            await userEvent.type(usernameInput, newUsername);

            await userEvent.click(submitButton);

            await waitFor(() => {
                expect(cancelButton).toBeEnabled();
                expect(submitButton).toBeEnabled();
            });
        });
    });
});
