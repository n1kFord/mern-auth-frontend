import { FC } from "react";
import { Form, Formik, FormikHelpers } from "formik";
import Modal from "./Modal";
import {
    changeUsernameSchema,
    ChangeNameValues,
} from "../../schemas/change-name";
import CustomField from "../CustomField";
import toast from "react-hot-toast";
import cn from "classnames";
import { handleValidationError } from "../../utils/handleValidationError";
import axiosInstance from "../../axiosConfig";
import { useUser } from "../../contexts/UserContext";

export interface ChangeUsernameModalProps {
    isVisible: boolean;
    onHide: () => void;
    currentUsername: string;
}

const ChangeUsernameModal: FC<ChangeUsernameModalProps> = ({
    isVisible,
    onHide,
    currentUsername,
}) => {
    const { setUser } = useUser();

    const handleHide = async (resetForm: () => void) => {
        onHide();
        await new Promise((resolve) => setTimeout(resolve, 400));
        resetForm();
    };

    const onSubmit = async (
        values: ChangeNameValues,
        actions: FormikHelpers<ChangeNameValues>,
    ) => {
        if (values.username === currentUsername) {
            toast.error("You have not changed your username.");
            actions.setSubmitting(false);
            return;
        }

        try {
            const response = await axiosInstance.post(
                "/user/change-username",
                { username: values.username },
                { withCredentials: true },
            );

            const { msg, newUsername } = response.data;

            toast.success(msg, {
                duration: 5000,
            });

            setUser((prevUser) =>
                prevUser ? { ...prevUser, username: newUsername } : null,
            );
            actions.resetForm();
            onHide();
        } catch (error) {
            handleValidationError(error);
        } finally {
            actions.setSubmitting(false);
        }
    };

    return (
        <Formik
            initialValues={changeUsernameSchema.initialValues}
            validationSchema={changeUsernameSchema.validationSchema}
            onSubmit={onSubmit}
        >
            {({ isSubmitting, submitForm, resetForm, values }) => (
                <Modal
                    isVisible={isVisible}
                    disableClose={isSubmitting}
                    onHide={() => {
                        handleHide(resetForm);
                    }}
                    title="your current username:"
                    subtitle={currentUsername}
                >
                    <div className="modal__content">
                        <Form
                            className="form"
                            aria-label="Change username form"
                            data-testid="change-username-form"
                        >
                            <fieldset
                                className="form__box"
                                aria-labelledby="change-username-fieldset"
                            >
                                {changeUsernameSchema.fields.map((field) => (
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
                            aria-label="Cancel username change"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            className={cn("modal__actions__btn", {
                                loading: isSubmitting,
                            })}
                            disabled={
                                isSubmitting ||
                                values.username === currentUsername
                            }
                            onClick={submitForm}
                            aria-label="Confirm username change"
                        >
                            Change
                        </button>
                    </div>
                </Modal>
            )}
        </Formik>
    );
};

export default ChangeUsernameModal;
