import { render, screen, waitFor } from "@testing-library/react";
import { axe } from "jest-axe";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import Navbar from "./Navbar";
import { IUser, UserContext } from "../contexts/UserContext";
import axiosInstance from "../axiosConfig";
import toast from "react-hot-toast";
import { AxiosError, AxiosHeaders } from "axios";
import userEvent from "@testing-library/user-event";
import { checkElements, resizeWindow } from "../utils/testUtils";

// Mock axiosInstance
jest.mock("../axiosConfig", () => ({
    post: jest.fn(),
}));

// Create a mock function for useNavigate
const mockNavigate = jest.fn();

// Mock react-router-dom's useNavigate
jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useNavigate: () => mockNavigate,
}));

jest.mock("react-hot-toast", () => ({
    success: jest.fn(),
    error: jest.fn(),
}));

// Test data
const mockSetUser = jest.fn();
const mockUser: IUser = {
    username: "testUser",
    email: "test@example.com",
    logo: "test-logo.png",
    created_at: "2023-01-01T00:00:00Z",
    _id: "user123",
    authProvider: "local",
};

// Helper function to render Navbar with context
const renderNavbar = () =>
    render(
        <UserContext.Provider
            value={{
                user: mockUser,
                setUser: mockSetUser,
                isLoading: false,
            }}
        >
            <MemoryRouter>
                <Navbar />
            </MemoryRouter>
        </UserContext.Provider>,
    );

describe("Navbar Component", () => {
    describe("Rendering and Accessibility", () => {
        it("should render the navbar links and log out button on all screen sizes", async () => {
            renderNavbar();
            const links = screen.getAllByRole("link");
            const logoutButton = screen.getByRole("button", {
                name: "Log out",
            });
            const screenSizes = [1440, 1024, 768, 375];

            for (const size of screenSizes) {
                resizeWindow(size);
                checkElements([...links, logoutButton]);
            }
        });

        it("should have no accessibility violations", async () => {
            const { container } = renderNavbar();
            const results = await axe(container);
            expect(results).toHaveNoViolations();
        });
    });

    describe("Behavioral and Interactions", () => {
        it("should call logout function when Log out button is clicked", async () => {
            const mockResponse = { data: { msg: "Logged out successfully" } };
            (axiosInstance.post as jest.Mock).mockResolvedValueOnce(
                mockResponse,
            );

            renderNavbar();

            const logoutButton = screen.getByRole("button", {
                name: "Log out",
            });
            const user = userEvent.setup();
            await user.click(logoutButton);

            await waitFor(() =>
                expect(axiosInstance.post).toHaveBeenCalledWith(
                    "/auth/logout",
                    {
                        withCredentials: true,
                    },
                ),
            );
            expect(mockSetUser).toHaveBeenCalledWith(null);
            expect(mockNavigate).toHaveBeenCalledWith("/login");
        });

        it("should display error toast if logout fails", async () => {
            const mockErrorResponse = new AxiosError(
                "Logout failed",
                "ERR_NETWORK",
                undefined,
                undefined,
                {
                    data: { msg: "Logout failed" },
                    status: 500,
                    statusText: "Internal Server Error",
                    headers: new AxiosHeaders(),
                    config: {
                        headers: new AxiosHeaders(),
                    },
                },
            );

            (axiosInstance.post as jest.Mock).mockRejectedValueOnce(
                mockErrorResponse,
            );

            renderNavbar();

            const logoutButton = screen.getByRole("button", {
                name: "Log out",
            });
            const user = userEvent.setup();
            await user.click(logoutButton);

            await waitFor(() =>
                expect(toast.error).toHaveBeenCalledWith("Logout failed", {
                    duration: 5000,
                }),
            );
        });

        it("should allow navigation using keyboard", async () => {
            renderNavbar();

            const user = userEvent.setup();
            const links = screen.getAllByRole("link");
            const logoutButton = screen.getByRole("button", {
                name: "Log out",
            });

            for (let i = 0; i < links.length; i++) {
                await user.tab();
                expect(links[i]).toHaveFocus();
            }

            await user.tab();
            expect(logoutButton).toHaveFocus();
        });
    });

    describe("Conditional Rendering", () => {
        it("should navigate to correct routes", async () => {
            render(
                <UserContext.Provider
                    value={{
                        user: mockUser,
                        setUser: mockSetUser,
                        isLoading: false,
                    }}
                >
                    <MemoryRouter>
                        <Navbar />
                        <Routes>
                            <Route path="/" element={<div>Home Page</div>} />
                            <Route
                                path="/about"
                                element={<div>About Page</div>}
                            />
                            <Route
                                path="/dashboard"
                                element={<div>Dashboard Page</div>}
                            />
                        </Routes>
                    </MemoryRouter>
                </UserContext.Provider>,
            );

            const user = userEvent.setup();
            const dashboardLink = screen.getByRole("link", {
                name: "Dashboard",
            });
            const aboutLink = screen.getByRole("link", { name: "About it" });

            await user.click(dashboardLink);
            expect(screen.getByText("Dashboard Page")).toBeInTheDocument();
            expect(dashboardLink).toHaveClass("active");

            await user.click(aboutLink);
            expect(screen.getByText("About Page")).toBeInTheDocument();
            expect(aboutLink).toHaveClass("active");
        });
    });
});
