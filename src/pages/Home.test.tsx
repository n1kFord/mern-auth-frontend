import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Home from "./Home";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { checkElements, resizeWindow } from "../utils/testUtils";
import { axe } from "jest-axe";

describe("Home Page", () => {
    describe("Rendering and Accessibility", () => {
        it("should render the title and links properly on all screen sizes", () => {
            render(
                <MemoryRouter>
                    <Home />
                </MemoryRouter>,
            );
            const title = screen.getByRole("heading", { level: 1 });

            const registerLink = screen.getByRole("link", {
                name: "Register for an account",
            });
            const loginLink = screen.getByRole("link", {
                name: "Login to your account",
            });

            const screenSizes = [1440, 1024, 768, 375];

            for (const size of screenSizes) {
                resizeWindow(size);
                checkElements([title, registerLink, loginLink]);
            }
        });

        it("should have no accessibility violations", async () => {
            const { container } = render(
                <MemoryRouter>
                    <Home />
                </MemoryRouter>,
            );
            const results = await axe(container);
            expect(results).toHaveNoViolations();
        });
    });

    describe("Behavioral and Interactions", () => {
        it("should follow the correct focus order when navigating with Tab", async () => {
            render(
                <MemoryRouter>
                    <Home />
                </MemoryRouter>,
            );
            const registerLink = screen.getByRole("link", {
                name: "Register for an account",
            });

            const loginLink = screen.getByRole("link", {
                name: "Login to your account",
            });

            registerLink.focus();
            expect(registerLink).toHaveFocus();

            await userEvent.tab();
            expect(loginLink).toHaveFocus();
        });

        it("should navigate correctly when clicking on links", async () => {
            const renderNav = () =>
                render(
                    <MemoryRouter initialEntries={["/"]}>
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route
                                path="/register"
                                element={<div>Register Page</div>}
                            />
                            <Route
                                path="/login"
                                element={<div>Login Page</div>}
                            />
                        </Routes>
                    </MemoryRouter>,
                );

            renderNav();

            const registerLink = screen.getByRole("link", {
                name: "Register for an account",
            });

            await userEvent.click(registerLink);
            expect(screen.getByText("Register Page")).toBeInTheDocument();

            renderNav();

            const loginLink = screen.getByRole("link", {
                name: "Login to your account",
            });

            await userEvent.click(loginLink);

            expect(screen.getByText("Login Page")).toBeInTheDocument();
        });
    });
});
