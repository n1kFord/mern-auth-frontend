import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router-dom";
import * as yup from "yup";
import AuthBar from "./AuthBar";
import { resizeWindow } from "../utils/testUtils";
import { axe } from "jest-axe";

describe("AuthBar Component", () => {
    const defaultProps = {
        title: "Sign In",
        initialValues: { email: "", password: "" },
        validationSchema: yup.object({
            email: yup.string().email("Invalid email").required("Required"),
            password: yup.string().min(6, "Too short").required("Required"),
        }),
        onSubmit: jest.fn(),
        formFields: [
            {
                name: "email",
                type: "email",
                placeholder: "Enter your email",
                label: "Email",
            },
            {
                name: "password",
                type: "password",
                placeholder: "Enter your password",
                label: "Password",
            },
        ] as Array<{
            name: "email" | "password";
            type: string;
            placeholder: string;
            label: string;
        }>,
        switchText: "Don't have an account?",
        switchLink: "/signup",
        switchLinkText: "Sign up",
    };

    describe("Rendering and Accessibility", () => {
        it("should render the component on all screen sizes", () => {
            render(
                <BrowserRouter>
                    <AuthBar {...defaultProps} />
                </BrowserRouter>,
            );

            const screenSizes = [1440, 1024, 768, 375];

            for (const size of screenSizes) {
                resizeWindow(size);
                expect(screen.getByRole("main")).toBeInTheDocument();
                expect(
                    screen.getByRole("region", { name: "Sign In" }),
                ).toBeInTheDocument();
                expect(
                    screen.getByRole("form", { name: "Sign In" }),
                ).toBeInTheDocument();
                expect(screen.getByLabelText("Email")).toBeInTheDocument();
                expect(screen.getByLabelText("Password")).toBeInTheDocument();
                expect(
                    screen.getByRole("button", { name: "Submit" }),
                ).toBeInTheDocument();
                expect(
                    screen.getByRole("link", { name: "Sign in with Google" }),
                ).toBeInTheDocument();
                expect(
                    screen.getByRole("link", { name: "Sign in with Github" }),
                ).toBeInTheDocument();
                expect(
                    screen.getByRole("link", { name: "Sign up" }),
                ).toBeInTheDocument();
            }
        });

        it("should have no accessibility violations", async () => {
            const { container } = render(
                <BrowserRouter>
                    <AuthBar {...defaultProps} />
                </BrowserRouter>,
            );
            const results = await axe(container);
            expect(results).toHaveNoViolations();
        });
    });

    describe("Behavioral and Interactions", () => {
        test("should handle tab navigation across all interactive elements", async () => {
            render(
                <BrowserRouter>
                    <AuthBar {...defaultProps} />
                </BrowserRouter>,
            );
            const user = userEvent.setup();

            const emailInput = screen.getByLabelText("Email");
            const passwordInput = screen.getByLabelText("Password");
            const submitButton = screen.getByRole("button", { name: "Submit" });
            const googleButton = screen.getByRole("link", {
                name: "Sign in with Google",
            });
            const githubButton = screen.getByRole("link", {
                name: "Sign in with Github",
            });
            const switchLink = screen.getByRole("link", { name: "Sign up" });

            // Email input
            await user.tab();
            expect(emailInput).toHaveFocus();

            // Password input
            await user.tab();
            expect(passwordInput).toHaveFocus();

            // Submit button
            await user.tab();
            await user.tab();
            expect(submitButton).toHaveFocus();

            // Google OAuth button
            await user.tab();
            expect(googleButton).toHaveFocus();

            // GitHub OAuth button
            await user.tab();
            await user.tab();
            expect(githubButton).toHaveFocus();

            // Switch link
            await user.tab();
            await user.tab();
            expect(switchLink).toHaveFocus();
        });

        it("should navigate to the signup page on clicking the switch link", () => {
            render(
                <BrowserRouter>
                    <AuthBar {...defaultProps} />
                </BrowserRouter>,
            );

            const link = screen.getByText("Sign up").closest("a");
            expect(link).toHaveAttribute("href", "/signup");
        });

        it("should call onSubmit with correct values on form submit", async () => {
            const onSubmitMock = jest.fn();

            render(
                <BrowserRouter>
                    <AuthBar {...defaultProps} onSubmit={onSubmitMock} />
                </BrowserRouter>,
            );

            await userEvent.type(
                screen.getByLabelText("Email"),
                "test@example.com",
            );
            await userEvent.type(
                screen.getByLabelText("Password"),
                "password123",
            );

            await userEvent.click(
                screen.getByRole("button", { name: "Submit" }),
            );

            expect(onSubmitMock).toHaveBeenCalledTimes(1);
            expect(onSubmitMock).toHaveBeenCalledWith(
                { email: "test@example.com", password: "password123" },
                expect.anything(),
            );
        });

        it("should navigate to the google auth on clicking the 'Continue with Google'", async () => {
            render(
                <BrowserRouter>
                    <AuthBar {...defaultProps} />
                </BrowserRouter>,
            );

            const googleButton = screen.getByRole("link", {
                name: "Sign in with Google",
            });

            expect(googleButton).toHaveAttribute(
                "href",
                `${process.env.REACT_APP_API_LINK || "http://localhost:8080/api"}/auth/google`,
            );
        });

        it("should navigate to the github auth on clicking the 'Continue with Github'", async () => {
            render(
                <BrowserRouter>
                    <AuthBar {...defaultProps} />
                </BrowserRouter>,
            );

            const githubButton = screen.getByRole("link", {
                name: "Sign in with Github",
            });

            expect(githubButton).toHaveAttribute(
                "href",
                `${process.env.REACT_APP_API_LINK || "http://localhost:8080/api"}/auth/github`,
            );
        });
    });

    describe("Conditional Rendering", () => {
        it("should disable submit button while form is submitting", async () => {
            const onSubmitMock = jest.fn((_, actions) => {
                act(() => {
                    actions.setSubmitting(true);
                });
            });

            render(
                <BrowserRouter>
                    <AuthBar {...defaultProps} onSubmit={onSubmitMock} />
                </BrowserRouter>,
            );

            const submitButton = screen.getByRole("button", { name: "Submit" });

            expect(submitButton).not.toBeDisabled();

            await userEvent.type(
                screen.getByLabelText("Email"),
                "test@example.com",
            );
            await userEvent.type(
                screen.getByLabelText("Password"),
                "password123",
            );
            await userEvent.click(submitButton);

            expect(submitButton).toBeDisabled();
        });

        it("should display validation errors for invalid inputs", async () => {
            render(
                <BrowserRouter>
                    <AuthBar {...defaultProps} />
                </BrowserRouter>,
            );

            await userEvent.click(
                screen.getByRole("button", { name: "Submit" }),
            );

            expect(await screen.findAllByText("Required")).toHaveLength(2);
            expect(screen.queryByText("Invalid email")).not.toBeInTheDocument();

            await userEvent.type(
                screen.getByLabelText("Email"),
                "invalid-email",
            );

            await userEvent.click(
                screen.getByRole("button", { name: "Submit" }),
            );

            expect(
                await screen.findByText("Invalid email"),
            ).toBeInTheDocument();
        });
    });
});
