import * as Yup from "yup";

export interface ChangeNameValues {
    username: string;
}

const initialValues: ChangeNameValues = {
    username: "",
};

const fields: {
    name: keyof ChangeNameValues;
    type: string;
    placeholder: string;
    label: string;
}[] = [
    {
        name: "username",
        type: "text",
        placeholder: "Enter a new username...",
        label: "username",
    },
];

export const validationSchema = Yup.object({
    username: Yup.string()
        .required("Username required")
        .min(3, "Username too short")
        .max(20, "Username too long")
        .matches(/^[a-zA-Z]/, "Username must start with a letter")
        .matches(/^\S*$/, "Username cannot contain spaces")
        .matches(/^[a-zA-Z][a-zA-Z0-9_.]*$/, "Invalid username"),
});

export const changeUsernameSchema = {
    initialValues,
    fields,
    validationSchema,
};
