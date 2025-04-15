import { render } from "@testing-library/react";
import { MemoryRouter, useNavigate } from "react-router-dom";
import { useUser } from "../contexts/UserContext";
import PrivateRoute from "./PrivateRoute";

// Mock useNavigate
jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useNavigate: jest.fn(),
}));

// Mock useUser
jest.mock("../contexts/UserContext", () => ({
    useUser: jest.fn(),
}));

describe("PrivateRoute Component", () => {
    it("should render children if user is authenticated", () => {
        const mockUser = { id: 1, name: "Test User" };
        (useUser as jest.Mock).mockReturnValue({ user: mockUser });

        const { getByText } = render(
            <MemoryRouter>
                <PrivateRoute>
                    <div>Private Content</div>
                </PrivateRoute>
            </MemoryRouter>,
        );

        expect(getByText("Private Content")).toBeInTheDocument();
    });

    it("should navigate to '/login' if user is not authenticated", () => {
        const mockNavigate = jest.fn();
        (useUser as jest.Mock).mockReturnValue({ user: null });
        (useNavigate as jest.Mock).mockReturnValue(mockNavigate);

        render(
            <MemoryRouter>
                <PrivateRoute>
                    <div>Private Content</div>
                </PrivateRoute>
            </MemoryRouter>,
        );

        expect(mockNavigate).toHaveBeenCalledWith("/login");
    });

    it("should not render children if user is not authenticated", () => {
        const mockNavigate = jest.fn();
        (useUser as jest.Mock).mockReturnValue({ user: null });
        (useNavigate as jest.Mock).mockReturnValue(mockNavigate);

        const { queryByText } = render(
            <MemoryRouter>
                <PrivateRoute>
                    <div>Private Content</div>
                </PrivateRoute>
            </MemoryRouter>,
        );

        expect(queryByText("Private Content")).not.toBeInTheDocument();
        expect(mockNavigate).toHaveBeenCalledWith("/login");
    });
});
