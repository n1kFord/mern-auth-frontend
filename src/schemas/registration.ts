import * as Yup from "yup";

export interface RegistrationValues {
    username: string;
    email: string;
    password: string;
}

const initialValues: RegistrationValues = {
    username: "",
    email: "",
    password: "",
};

const fields: {
    name: keyof RegistrationValues;
    type: string;
    placeholder: string;
    label: string;
}[] = [
    {
        name: "username",
        type: "text",
        placeholder: "Enter a username...",
        label: "username",
    },
    {
        name: "email",
        type: "email",
        placeholder: "Enter your email...",
        label: "email address",
    },
    {
        name: "password",
        type: "password",
        placeholder: "Enter your password...",
        label: "password",
    },
];

const validationSchema = Yup.object({
    username: Yup.string()
        .required("Username required")
        .min(3, "Username too short")
        .max(20, "Username too long")
        .matches(/^[a-zA-Z]/, "Username must start with a letter")
        .matches(/^\S*$/, "Username cannot contain spaces")
        .matches(/^[a-zA-Z][a-zA-Z0-9_.]*$/, "Invalid username"),
    email: Yup.string()
        .required("Email required")
        .matches(
            /^[\w.%+-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/,
            "Enter a valid email",
        ),
    password: Yup.string()
        .required("Password required")
        .min(6, "Password too short")
        .max(128, "Password too long"),
});

export const registrationSchema = {
    initialValues,
    fields,
    validationSchema,
};
