import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import App from "./App";
import { useUser } from "./contexts/UserContext";

jest.mock("./contexts/UserContext", () => ({
    useUser: jest.fn(),
}));

jest.mock("./components/CustomToaster", () => {
    const MockToaster = () => <div>MockToaster</div>;
    MockToaster.displayName = "MockToaster";
    return MockToaster;
});

jest.mock("./components/Navbar", () => {
    const MockNavbar = () => <div>MockNavbar</div>;
    MockNavbar.displayName = "MockNavbar";
    return MockNavbar;
});

jest.mock("./components/PrivateRoute", () => {
    const MockPrivateRoute = ({ children }: { children: React.ReactNode }) =>
        children;
    MockPrivateRoute.displayName = "MockPrivateRoute";
    return MockPrivateRoute;
});

jest.mock("./components/RedirectToDashboard", () => {
    const MockRedirect = () => <div>Redirected</div>;
    MockRedirect.displayName = "MockRedirectToDashboard";
    return MockRedirect;
});

jest.mock("./pages", () => ({
    Home: () => <div>Home Page</div>,
    Register: () => <div>Register Page</div>,
    Login: () => <div>Login Page</div>,
    Dashboard: () => <div>Dashboard Page</div>,
    About: () => <div>About Page</div>,
    NotFound: () => <div>404 Not Found</div>,
}));

describe("App routing", () => {
    it("renders public routes for unauthenticated user", () => {
        (useUser as jest.Mock).mockReturnValue({ user: null });

        render(
            <MemoryRouter initialEntries={["/"]}>
                <App />
            </MemoryRouter>,
        );

        expect(screen.getByText("Home Page")).toBeInTheDocument();
        expect(screen.queryByText("MockNavbar")).not.toBeInTheDocument();
    });

    it("redirects to dashboard when user is authenticated", () => {
        (useUser as jest.Mock).mockReturnValue({
            user: { username: "testUser" },
        });

        render(
            <MemoryRouter initialEntries={["/login"]}>
                <App />
            </MemoryRouter>,
        );

        expect(screen.getByText("Redirected")).toBeInTheDocument();
        expect(screen.getByText("MockNavbar")).toBeInTheDocument();
    });

    it("renders dashboard for authenticated user", () => {
        (useUser as jest.Mock).mockReturnValue({
            user: { username: "testUser" },
        });

        render(
            <MemoryRouter initialEntries={["/dashboard"]}>
                <App />
            </MemoryRouter>,
        );

        expect(screen.getByText("Dashboard Page")).toBeInTheDocument();
    });

    it("renders not found for unknown route", () => {
        (useUser as jest.Mock).mockReturnValue({ user: null });

        render(
            <MemoryRouter initialEntries={["/some/unknown"]}>
                <App />
            </MemoryRouter>,
        );

        expect(screen.getByText("404 Not Found")).toBeInTheDocument();
    });
});
