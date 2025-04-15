import React from "react";
import { Field, useField, ErrorMessage } from "formik";
import cn from "classnames";
import { HideSVG, ShowSVG } from "./svg-icons";

export interface CustomFieldProps {
    customVariant?: "blue";
    name: string;
    type: string;
    placeholder: string;
    label: string;
    isSubmitting: boolean;
    showPasswordToggle?: boolean;
    autoComplete?: string;
}

const CustomField: React.FC<CustomFieldProps> = ({
    customVariant,
    name,
    type,
    placeholder,
    label,
    isSubmitting,
    showPasswordToggle = true,
    autoComplete = "on",
}) => {
    const meta = useField(name)[1];

    const [isShowingPassword, setIsShowingPassword] =
        React.useState<boolean>(false);

    const togglePasswordVisibility = () => {
        setIsShowingPassword((prevState) => !prevState);
    };

    return (
        <div
            className={cn("form__group", {
                error: meta.touched && meta.error,
                loading: isSubmitting,
                [`${customVariant}`]: customVariant,
            })}
        >
            <label className="form__label" htmlFor={name}>
                {label}
            </label>
            <div className="form__input-wrapper">
                <Field
                    as="input"
                    className="form__input"
                    type={
                        type === "password"
                            ? isShowingPassword
                                ? "text"
                                : "password"
                            : type
                    }
                    name={name}
                    id={name}
                    placeholder={placeholder}
                    disabled={isSubmitting}
                    autoComplete={autoComplete}
                    value={meta.value || ""}
                    aria-invalid={
                        meta.touched && meta.error ? "true" : undefined
                    }
                    aria-describedby={
                        meta.touched && meta.error ? `${name}-error` : undefined
                    }
                />
                {type === "password" && showPasswordToggle && (
                    <button
                        className="form__icon-btn"
                        type="button"
                        aria-label={
                            isShowingPassword
                                ? "Hide password"
                                : "Show password"
                        }
                        aria-pressed={isShowingPassword}
                        onClick={togglePasswordVisibility}
                        disabled={isSubmitting}
                    >
                        {isShowingPassword ? <HideSVG /> : <ShowSVG />}
                    </button>
                )}
            </div>
            <div
                className="form__error-container"
                aria-live="polite"
                aria-atomic="true"
            >
                <ErrorMessage
                    name={name}
                    component="p"
                    className="form__error-msg"
                />
            </div>
        </div>
    );
};

export default CustomField;
