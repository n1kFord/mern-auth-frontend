import { FC } from "react";
import { FormikHelpers } from "formik";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axiosInstance from "../axiosConfig";
import { useUser } from "../contexts/UserContext";
import AuthBar from "../components/AuthBar";
import { loginSchema, LoginValues } from "../schemas/login";
import usePageBackground from "../hooks/usePageBackground";
import { handleValidationError } from "../utils/handleValidationError";

const Login: FC = () => {
    const { setUser } = useUser();
    const navigate = useNavigate();

    const currentBackground =
        "linear-gradient(180deg, #667e85 0%, rgba(12, 26, 33, 0.73) 100%)";

    const background = usePageBackground(currentBackground);

    const onSubmit = async (
        values: LoginValues,
        actions: FormikHelpers<LoginValues>,
    ) => {
        try {
            const response = await axiosInstance.post("/auth/login", values, {
                withCredentials: true,
            });

            const { msg, user } = response.data;
            toast.success(msg, {
                duration: 5000,
            });

            setUser(user);
            navigate("/dashboard");

            actions.resetForm();
        } catch (error: unknown) {
            handleValidationError(error, "An error occurred during login");
        } finally {
            actions.setSubmitting(false);
        }
    };

    return (
        <motion.main
            initial={{
                background,
            }}
            animate={{
                background: currentBackground,
            }}
            transition={{ duration: 2, ease: "linear" }}
        >
            <AuthBar<LoginValues>
                title="Login to your account"
                initialValues={loginSchema.initialValues}
                validationSchema={loginSchema.validationSchema}
                onSubmit={onSubmit}
                formFields={loginSchema.fields}
                switchText="Don't have an account?"
                switchLink="/register"
                switchLinkText="Register"
            />
        </motion.main>
    );
};

export default Login;
