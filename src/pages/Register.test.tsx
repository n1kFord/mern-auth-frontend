import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Register from "./Register";
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

describe("Register page", () => {
    beforeEach(() => {
        (useUser as jest.Mock).mockReturnValue({ setUser: mockSetUser });
        (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
    });

    it("should render AuthBar with register title", () => {
        render(
            <MemoryRouter>
                <BackgroundProvider>
                    <Register />
                </BackgroundProvider>
            </MemoryRouter>,
        );

        expect(
            screen.getByRole("heading", { name: /register your account/i }),
        ).toBeInTheDocument();
    });

    it("should submit the register form and navigates to dashboard", async () => {
        const mockResponse = {
            data: {
                msg: "Registration successful",
                user: { username: "newUser" },
            },
        };
        (axiosInstance.post as jest.Mock).mockResolvedValue(mockResponse);

        render(
            <MemoryRouter>
                <BackgroundProvider>
                    <Register />
                </BackgroundProvider>
            </MemoryRouter>,
        );

        await userEvent.type(screen.getByLabelText("username"), "newUser");
        await userEvent.type(
            screen.getByLabelText("email address"),
            "newuser@example.com",
        );
        await userEvent.type(screen.getByLabelText("password"), "password123");

        await userEvent.click(screen.getByRole("button", { name: "Submit" }));

        await waitFor(() => {
            expect(axiosInstance.post).toHaveBeenCalledWith(
                "/auth/register",
                {
                    username: "newUser",
                    email: "newuser@example.com",
                    password: "password123",
                },
                { withCredentials: true },
            );
            expect(mockSetUser).toHaveBeenCalledWith({ username: "newUser" });
            expect(toast.success).toHaveBeenCalledWith(
                "Registration successful",
                {
                    duration: 5000,
                },
            );
            expect(mockNavigate).toHaveBeenCalledWith("/dashboard");
        });
    });
});
