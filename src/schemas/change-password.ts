import * as Yup from "yup";

export interface ChangePasswordValues {
    currentPassword: string;
    newPassword: string;
}

const initialValues: ChangePasswordValues = {
    currentPassword: "",
    newPassword: "",
};

const fields: {
    name: keyof ChangePasswordValues;
    type: string;
    placeholder: string;
    label: string;
}[] = [
    {
        name: "currentPassword",
        type: "password",
        placeholder: "Current password...",
        label: "your current password",
    },
    {
        name: "newPassword",
        type: "password",
        placeholder: "New password...",
        label: "new password",
    },
];

export const validationSchema = Yup.object({
    currentPassword: Yup.string()
        .required("Current password required")
        .min(6, "Current password too short")
        .max(128, "Current password too long"),
    newPassword: Yup.string()
        .required("New password required")
        .min(6, "New password too short")
        .max(128, "New password too long"),
});

export const changePasswordSchema = {
    initialValues,
    fields,
    validationSchema,
};
