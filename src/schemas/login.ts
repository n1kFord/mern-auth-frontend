import * as Yup from "yup";

export interface LoginValues {
    email: string;
    password: string;
}

const initialValues: LoginValues = {
    email: "",
    password: "",
};

const fields: {
    name: keyof LoginValues;
    type: string;
    placeholder: string;
    label: string;
}[] = [
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

export const validationSchema = Yup.object({
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

export const loginSchema = {
    initialValues,
    fields,
    validationSchema,
};
