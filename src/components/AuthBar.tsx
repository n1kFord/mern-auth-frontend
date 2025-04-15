import { Link } from "react-router-dom";
import { Formik, Form, FormikHelpers } from "formik";
import cn from "classnames";
import { motion } from "framer-motion";

import CustomField from "../components/CustomField";
import { oauthGithubIcon, oauthGoogleIcon } from "../assets";

interface AuthBarProps<T> {
    title: string;
    initialValues: T;
    validationSchema: unknown;
    onSubmit: (values: T, actions: FormikHelpers<T>) => void;
    formFields: {
        name: keyof T;
        type: string;
        placeholder: string;
        label: string;
    }[];
    switchText: string;
    switchLink: string;
    switchLinkText: string;
}

const AuthBar = <T extends object>({
    title,
    initialValues,
    validationSchema,
    onSubmit,
    formFields,
    switchText,
    switchLink,
    switchLinkText,
}: AuthBarProps<T>) => {
    return (
        <motion.main
            className="auth"
            initial={{ opacity: 0.8 }}
            animate={{ opacity: 1 }}
            transition={{
                duration: 0.8,
                ease: "linear",
            }}
            role="main"
        >
            <motion.div
                className="auth__card"
                initial={{ scale: 0.985, borderRadius: 35 }}
                animate={{ scale: 1, borderRadius: 19 }}
                transition={{
                    duration: 1,
                    ease: "easeInOut",
                }}
                role="region"
                aria-labelledby="auth-title"
            >
                <h1 id="auth-title" className="auth__title">
                    {title}
                </h1>
                <div className="auth__form-container">
                    <Formik
                        initialValues={initialValues}
                        validationSchema={validationSchema}
                        onSubmit={onSubmit}
                    >
                        {({ isSubmitting }) => (
                            <Form
                                className="form"
                                noValidate
                                autoComplete="off"
                                role="form"
                                aria-labelledby="auth-title"
                            >
                                <fieldset className="form__box">
                                    {formFields.map((field) => (
                                        <CustomField
                                            key={String(field.name)}
                                            name={String(field.name)}
                                            type={field.type}
                                            placeholder={field.placeholder}
                                            label={field.label}
                                            isSubmitting={isSubmitting}
                                            autoComplete="off"
                                        />
                                    ))}
                                    <button
                                        type="submit"
                                        className={cn(
                                            "form__submit auth__submit",
                                            { loading: isSubmitting },
                                        )}
                                        disabled={isSubmitting}
                                        aria-disabled={isSubmitting}
                                    >
                                        Submit
                                    </button>
                                </fieldset>
                            </Form>
                        )}
                    </Formik>
                </div>
                <div className="auth__providers">
                    <h2 className="auth__providers__title">or</h2>
                    <nav
                        className="auth__providers__buttons"
                        aria-label="OAuth providers"
                    >
                        <a
                            href="http://localhost:8080/api/auth/google"
                            aria-label="Sign in with Google"
                        >
                            <button
                                type="button"
                                className="auth__providers__buttons__item"
                                tabIndex={0}
                            >
                                <img
                                    src={oauthGoogleIcon}
                                    alt="google"
                                    width={23}
                                    height={23}
                                />
                                Continue with Google
                            </button>
                        </a>
                        <a
                            href="http://localhost:8080/api/auth/github"
                            aria-label="Sign in with Github"
                        >
                            <button
                                type="button"
                                className="auth__providers__buttons__item"
                                tabIndex={0}
                            >
                                <img
                                    src={oauthGithubIcon}
                                    alt="github"
                                    width={23}
                                    height={23}
                                />
                                Continue with Github
                            </button>
                        </a>
                    </nav>
                </div>
            </motion.div>
            <span className="auth__switch">
                {switchText}{" "}
                <Link to={switchLink} tabIndex={0}>
                    {switchLinkText}
                </Link>
            </span>
        </motion.main>
    );
};

export default AuthBar;
