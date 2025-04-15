import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import Dashboard from "./Dashboard";
import { IUser, UserContext } from "../contexts/UserContext";
import { BackgroundProvider } from "../contexts/BackgroundContext";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";

const mockSetUser = jest.fn();
const mockUser: IUser = {
    username: "testUser",
    email: "test@example.com",
    logo: "test-logo.png",
    created_at: "2023-01-01T00:00:00Z",
    _id: "user123",
    authProvider: "local",
};

const renderDashboardPage = () =>
    render(
        <MemoryRouter>
            <UserContext.Provider
                value={{
                    user: mockUser,
                    setUser: mockSetUser,
                    isLoading: false,
                }}
            >
                <BackgroundProvider>
                    <Dashboard />
                </BackgroundProvider>
            </UserContext.Provider>
        </MemoryRouter>,
    );

describe("Dashboard component", () => {
    describe("Rendering and Accessibility", () => {
        it("should have no accessibility violations", async () => {
            const { container } = renderDashboardPage();
            const results = await axe(container);
            expect(results).toHaveNoViolations();
        });

        it("should render dashboard title and user info", () => {
            renderDashboardPage();

            expect(
                screen.getByRole("heading", { name: "Dashboard" }),
            ).toBeInTheDocument();
            expect(screen.getByTestId("user-name")).toHaveTextContent(
                mockUser.username,
            );
            expect(screen.getByText(mockUser.email)).toBeInTheDocument();
            expect(screen.getByText(mockUser.created_at)).toBeInTheDocument();
            expect(screen.getByText(mockUser._id)).toBeInTheDocument();
        });

        it("should render action buttons with correct labels", () => {
            renderDashboardPage();

            expect(
                screen.getByRole("button", { name: "Change username" }),
            ).toBeInTheDocument();
            expect(
                screen.getByRole("button", { name: "Change password" }),
            ).toBeInTheDocument();
            expect(
                screen.getByRole("button", { name: "Delete account" }),
            ).toBeInTheDocument();
        });
    });

    describe("Behavioral and Interactions", () => {
        it("should open modals on action button clicks", async () => {
            renderDashboardPage();

            const user = userEvent.setup();

            const changeUsernameButton = screen.getByRole("button", {
                name: "Change username",
            });
            const changePasswordButton = screen.getByRole("button", {
                name: "Change password",
            });
            const deleteAccountButton = screen.getByRole("button", {
                name: "Delete account",
            });

            await user.click(changeUsernameButton);
            expect(
                screen.getByText(/your current username:/i),
            ).toBeInTheDocument();

            await user.click(changePasswordButton);
            expect(screen.getByText("change password")).toBeInTheDocument();

            await user.click(deleteAccountButton);
            expect(screen.getByText(/are you sure?/i)).toBeInTheDocument();
        });
    });

    describe("Conditional Rendering", () => {
        it("should disable the 'change password' button for Oauth users", () => {
            render(
                <MemoryRouter>
                    <UserContext.Provider
                        value={{
                            user: {
                                username: "testUser",
                                email: "test@example.com",
                                logo: "test-logo.png",
                                created_at: "2023-01-01T00:00:00Z",
                                _id: "user123",
                                authProvider: "github",
                            },
                            setUser: mockSetUser,
                            isLoading: false,
                        }}
                    >
                        <BackgroundProvider>
                            <Dashboard />
                        </BackgroundProvider>
                    </UserContext.Provider>
                </MemoryRouter>,
            );

            expect(
                screen.getByRole("button", { name: "Change password" }),
            ).toBeDisabled();
        });
    });
});
