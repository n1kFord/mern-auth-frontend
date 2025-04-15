import { FC } from "react";
import { FormikHelpers } from "formik";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axiosInstance from "../axiosConfig";
import { useUser } from "../contexts/UserContext";
import AuthBar from "../components/AuthBar";
import {
    registrationSchema,
    RegistrationValues,
} from "../schemas/registration";
import usePageBackground from "../hooks/usePageBackground";
import { handleValidationError } from "../utils/handleValidationError";

const Register: FC = () => {
    const { setUser } = useUser();
    const navigate = useNavigate();

    const currentBackground =
        "linear-gradient(220deg, #667e85 0%, rgba(12, 26, 33, 0.73) 100%)";

    const background = usePageBackground(currentBackground);

    const onSubmit = async (
        values: RegistrationValues,
        actions: FormikHelpers<RegistrationValues>,
    ) => {
        try {
            const response = await axiosInstance.post(
                "/auth/register",
                values,
                {
                    withCredentials: true,
                },
            );

            const { msg, user } = response.data;
            toast.success(msg, {
                duration: 5000,
            });

            setUser(user);
            navigate("/dashboard");

            actions.resetForm();
        } catch (error: unknown) {
            handleValidationError(error, "An error occurred during register");
        } finally {
            actions.setSubmitting(false);
        }
    };

    return (
        <motion.main
            initial={{
                background: background,
            }}
            animate={{
                background: currentBackground,
            }}
            transition={{ duration: 2, ease: "linear" }}
        >
            <AuthBar<RegistrationValues>
                title="Register your account"
                initialValues={registrationSchema.initialValues}
                validationSchema={registrationSchema.validationSchema}
                onSubmit={onSubmit}
                formFields={registrationSchema.fields}
                switchText="Already have an account?"
                switchLink="/login"
                switchLinkText="Login"
            />
        </motion.main>
    );
};

export default Register;
