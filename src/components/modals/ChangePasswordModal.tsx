import { FC } from "react";
import { Form, Formik, FormikHelpers } from "formik";
import CustomField from "../CustomField";
import {
    changePasswordSchema,
    ChangePasswordValues,
} from "../../schemas/change-password";
import cn from "classnames";
import Modal from "./Modal";
import axiosInstance from "../../axiosConfig";
import toast from "react-hot-toast";
import { handleValidationError } from "../../utils/handleValidationError";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../contexts/UserContext";

export interface ChangePasswordModalProps {
    isVisible: boolean;
    onHide: () => void;
}

const ChangePasswordModal: FC<ChangePasswordModalProps> = ({
    isVisible,
    onHide,
}) => {
    const { setUser } = useUser();
    const navigate = useNavigate();
    const handleHide = async (resetForm: () => void) => {
        onHide();
        await new Promise((resolve) => setTimeout(resolve, 400));
        resetForm();
    };

    const onSubmit = async (
        values: ChangePasswordValues,
        actions: FormikHelpers<ChangePasswordValues>,
    ) => {
        try {
            const response = await axiosInstance.post(
                "/user/change-password",
                values,
                { withCredentials: true },
            );

            const { msg } = response.data;

            toast.success(msg, {
                duration: 5000,
            });

            onHide();

            setUser(null);
            navigate("/login");
        } catch (error) {
            handleValidationError(error);
        } finally {
            actions.resetForm();
            actions.setSubmitting(false);
        }
    };

    return (
        <Formik
            initialValues={changePasswordSchema.initialValues}
            validationSchema={changePasswordSchema.validationSchema}
            onSubmit={onSubmit}
        >
            {({ isSubmitting, submitForm, resetForm }) => (
                <Modal
                    isVisible={isVisible}
                    disableClose={isSubmitting}
                    onHide={() => {
                        handleHide(resetForm);
                    }}
                    title="change password"
                >
                    <div className="modal__content">
                        <Form
                            className="form"
                            noValidate
                            aria-label="Change password form"
                            data-testid="change-password-form"
                        >
                            <fieldset className="form__box">
                                {changePasswordSchema.fields.map((field) => (
                                    <CustomField
                                        key={String(field.name)}
                                        customVariant={
                                            field.name === "currentPassword"
                                                ? "blue"
                                                : undefined
                                        }
                                        name={String(field.name)}
                                        type={field.type}
                                        placeholder={field.placeholder}
                                        label={field.label}
                                        isSubmitting={isSubmitting}
                                        autoComplete="off"
                                    />
                                ))}
                            </fieldset>
                        </Form>
                    </div>
                    <div className="modal__actions">
                        <button
                            type="button"
                            className="modal__actions__btn cancel"
                            disabled={isSubmitting}
                            onClick={() => {
                                handleHide(resetForm);
                            }}
                            aria-label="Cancel password change"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            className={cn("modal__actions__btn", {
                                loading: isSubmitting,
                            })}
                            disabled={isSubmitting}
                            onClick={submitForm}
                            aria-label="Confirm password change"
                        >
                            Apply
                        </button>
                    </div>
                </Modal>
            )}
        </Formik>
    );
};

export default ChangePasswordModal;
