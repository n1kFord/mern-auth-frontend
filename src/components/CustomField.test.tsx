import { render, screen } from "@testing-library/react";
import { Formik, Form } from "formik";
import { axe } from "jest-axe";
import userEvent from "@testing-library/user-event";
import * as Yup from "yup";
import CustomField, { CustomFieldProps } from "./CustomField";

describe("CustomField component", () => {
    const validationSchema = Yup.object({
        email: Yup.string()
            .required("Email required")
            .matches(
                /^[\w.%+-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/,
                "Enter a valid email",
            ),
        username: Yup.string()
            .required("Username required")
            .min(3, "Username too short")
            .max(20, "Username too long")
            .matches(/^[a-zA-Z]/, "Username must start with a letter")
            .matches(/^\S*$/, "Username cannot contain spaces")
            .matches(/^[a-zA-Z][a-zA-Z0-9_.]*$/, "Invalid username"),
        password: Yup.string()
            .required("Password required")
            .min(6, "Password too short")
            .max(128, "Password too long"),
    });
    const initialValues = { email: "", username: "", password: "" };

    // Helper function to render the CustomField component with Formik
    const renderWithFormik = (props: CustomFieldProps) =>
        render(
            <Formik
                initialValues={initialValues}
                onSubmit={jest.fn()}
                validationSchema={validationSchema}
            >
                <Form>
                    <CustomField {...props} />
                </Form>
            </Formik>,
        );

    describe("Rendering and Accessibility", () => {
        it("should render the field with a label properly", () => {
            renderWithFormik({
                name: "username",
                type: "text",
                placeholder: "Enter your username",
                label: "Username",
                isSubmitting: false,
            });

            const inputElement = screen.getByLabelText("Username");

            expect(inputElement).toBeInTheDocument();
            expect(inputElement).toHaveAttribute("type", "text");
            expect(inputElement).toHaveAttribute("name", "username");
            expect(inputElement).toHaveAttribute(
                "placeholder",
                "Enter your username",
            );
        });

        it("should have no accessibility violations", async () => {
            const { container } = renderWithFormik({
                name: "username",
                type: "text",
                placeholder: "Enter your username",
                label: "Username",
                isSubmitting: false,
            });
            const results = await axe(container);
            expect(results).toHaveNoViolations();
        });

        it("should render the password toggle button properly", () => {
            renderWithFormik({
                name: "password",
                type: "password",
                placeholder: "Enter your password",
                label: "Password",
                isSubmitting: false,
            });

            const toggleButton = screen.getByRole("button", {
                name: "Show password",
            });
            expect(toggleButton).toBeInTheDocument();
            expect(toggleButton.querySelector("svg title")).toHaveTextContent(
                "Show",
            );
        });

        it("should not render password toggle if showPasswordToggle is false", () => {
            renderWithFormik({
                name: "password",
                type: "password",
                placeholder: "Enter your password",
                label: "Password",
                isSubmitting: false,
                showPasswordToggle: false,
            });

            expect(
                screen.queryByRole("button", { name: /Show password/i }),
            ).not.toBeInTheDocument();
        });

        it("should support autoComplete attribute", () => {
            renderWithFormik({
                name: "username",
                type: "text",
                placeholder: "Enter your username",
                label: "Username",
                isSubmitting: false,
                autoComplete: "username",
            });

            const input = screen.getByPlaceholderText("Enter your username");
            expect(input).toHaveAttribute("autocomplete", "username");
        });

        it("should apply custom variant styles", () => {
            renderWithFormik({
                name: "username",
                type: "text",
                placeholder: "Enter your username",
                label: "Username",
                isSubmitting: false,
                customVariant: "blue",
            });

            const fieldGroup = screen
                .getByLabelText("Username")
                .closest(".form__group");
            expect(fieldGroup).toHaveClass("blue");
        });
    });

    describe("Behavioral and Interactions", () => {
        it("should toggle the icon when the toggle button is clicked", async () => {
            renderWithFormik({
                name: "password",
                type: "password",
                placeholder: "Enter your password",
                label: "Password",
                isSubmitting: false,
            });

            const toggleButton = screen.getByRole("button", {
                name: "Show password",
            });

            await userEvent.click(toggleButton);
            expect(toggleButton.querySelector("svg title")).toHaveTextContent(
                "Hide",
            );

            await userEvent.click(toggleButton);
            expect(toggleButton.querySelector("svg title")).toHaveTextContent(
                "Show",
            );
        });

        it("should toggle password visibility when the toggle button is clicked", async () => {
            renderWithFormik({
                name: "password",
                type: "password",
                placeholder: "Enter your password",
                label: "Password",
                isSubmitting: false,
            });

            const input = screen.getByPlaceholderText("Enter your password");
            const toggleButton = screen.getByRole("button", {
                name: "Show password",
            });

            expect(input).toHaveAttribute("type", "password");

            await userEvent.click(toggleButton);
            expect(input).toHaveAttribute("type", "text");

            await userEvent.click(toggleButton);
            expect(input).toHaveAttribute("type", "password");
        });

        it("should display an error message for invalid email", async () => {
            renderWithFormik({
                name: "email",
                type: "text",
                placeholder: "Enter your email",
                label: "Email",
                isSubmitting: false,
            });

            const input = screen.getByPlaceholderText("Enter your email");

            await userEvent.type(input, "invalidemail");
            await userEvent.tab();

            expect(
                await screen.findByText("Enter a valid email"),
            ).toBeInTheDocument();
        });

        it("should display an error message for short password", async () => {
            renderWithFormik({
                name: "password",
                type: "password",
                placeholder: "Enter your password",
                label: "Password",
                isSubmitting: false,
            });

            const input = screen.getByPlaceholderText("Enter your password");

            await userEvent.type(input, "123");
            await userEvent.tab();

            expect(
                await screen.findByText("Password too short"),
            ).toBeInTheDocument();
        });

        it("should display a required error message when field is empty", async () => {
            renderWithFormik({
                name: "password",
                type: "password",
                placeholder: "Enter your password",
                label: "Password",
                isSubmitting: false,
            });

            const input = screen.getByPlaceholderText("Enter your password");

            await userEvent.clear(input);
            await userEvent.tab();

            expect(
                await screen.findByText("Password required"),
            ).toBeInTheDocument();
        });

        it("should focus on the input when label is clicked", async () => {
            renderWithFormik({
                name: "username",
                type: "text",
                placeholder: "Enter your username",
                label: "Username",
                isSubmitting: false,
            });

            const label = screen.getByText("Username");
            const input = screen.getByPlaceholderText("Enter your username");

            await userEvent.click(label);
            expect(input).toHaveFocus();
        });
    });

    describe("Conditional Rendering", () => {
        it("should disable the field when submitting", () => {
            renderWithFormik({
                name: "username",
                type: "text",
                placeholder: "Enter your username",
                label: "Username",
                isSubmitting: true,
            });

            expect(
                screen.getByPlaceholderText("Enter your username"),
            ).toBeDisabled();
        });

        it("should disable the password toggle button when submitting", () => {
            renderWithFormik({
                name: "password",
                type: "password",
                placeholder: "Enter your password",
                label: "Password",
                isSubmitting: true,
            });

            expect(
                screen.getByRole("button", { name: "Show password" }),
            ).toBeDisabled();
        });

        it("should apply error styles when field has an error", async () => {
            renderWithFormik({
                name: "password",
                type: "password",
                placeholder: "Enter your password",
                label: "Password",
                isSubmitting: false,
            });

            const input = screen.getByPlaceholderText("Enter your password");

            await userEvent.clear(input);
            await userEvent.tab();

            expect(
                await screen.findByText("Password required"),
            ).toBeInTheDocument();

            const fieldGroup = input.closest(".form__group");
            expect(fieldGroup).toHaveClass("error");
        });

        it("should apply loading styles when isSubmitting is true", () => {
            renderWithFormik({
                name: "username",
                type: "text",
                placeholder: "Enter your username",
                label: "Username",
                isSubmitting: true,
            });

            const fieldGroup = screen
                .getByLabelText("Username")
                .closest(".form__group");

            expect(fieldGroup).toHaveClass("loading");
        });
    });
});
