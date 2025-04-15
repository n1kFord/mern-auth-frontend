import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Login from "./Login";
import { useUser } from "../contexts/UserContext";
import { MemoryRouter, useNavigate } from "react-router-dom";
import axiosInstance from "../axiosConfig";
import toast from "react-hot-toast";
import { BackgroundProvider } from "../contexts/BackgroundContext";

jest.mock("../contexts/UserContext", () => ({
    useUser: jest.fn(),
}));
jest.mock("react-hot-toast", () => ({
    __esModule: true,
    default: {
        success: jest.fn(),
    },
}));
jest.mock("react-router-dom", () => {
    const actual = jest.requireActual("react-router-dom");
    return {
        ...actual,
        useNavigate: jest.fn(),
    };
});
jest.mock("../axiosConfig");
jest.mock("../utils/handleValidationError", () => ({
    handleValidationError: jest.fn(),
}));

const mockSetUser = jest.fn();
const mockNavigate = jest.fn();

describe("Login page", () => {
    beforeEach(() => {
        (useUser as jest.Mock).mockReturnValue({ setUser: mockSetUser });
        (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
    });

    it("should render AuthBar with login title", () => {
        render(
            <MemoryRouter>
                <BackgroundProvider>
                    <Login />
                </BackgroundProvider>
            </MemoryRouter>,
        );

        expect(
            screen.getByRole("heading", { name: /login to your account/i }),
        ).toBeInTheDocument();
    });

    it("should submit the login form and navigates to dashboard", async () => {
        const mockResponse = {
            data: {
                msg: "Login successful",
                user: { username: "testUser" },
            },
        };
        (axiosInstance.post as jest.Mock).mockResolvedValue(mockResponse);

        render(
            <MemoryRouter>
                <BackgroundProvider>
                    <Login />
                </BackgroundProvider>
            </MemoryRouter>,
        );

        await userEvent.type(
            screen.getByLabelText("email address"),
            "test@example.com",
        );
        await userEvent.type(screen.getByLabelText("password"), "password123");
        await userEvent.click(screen.getByRole("button", { name: "Submit" }));

        await waitFor(() => {
            expect(axiosInstance.post).toHaveBeenCalledWith(
                "/auth/login",
                { email: "test@example.com", password: "password123" },
                { withCredentials: true },
            );
            expect(mockSetUser).toHaveBeenCalledWith({ username: "testUser" });
            expect(toast.success).toHaveBeenCalledWith("Login successful", {
                duration: 5000,
            });
            expect(mockNavigate).toHaveBeenCalledWith("/dashboard");
        });
    });
});
