import { render } from "@testing-library/react";
import { MemoryRouter, useNavigate } from "react-router-dom";
import RedirectToDashboard from "./RedirectToDashboard";

// Mock useNavigate
jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useNavigate: jest.fn(),
}));

describe("RedirectToDashboard Component", () => {
    it("should navigate to '/dashboard' on render", () => {
        const mockNavigate = jest.fn();
        (useNavigate as jest.Mock).mockReturnValue(mockNavigate);

        render(
            <MemoryRouter>
                <RedirectToDashboard />
            </MemoryRouter>,
        );

        // Check if navigate was called with the correct argument
        expect(mockNavigate).toHaveBeenCalledWith("/dashboard");
    });
});
