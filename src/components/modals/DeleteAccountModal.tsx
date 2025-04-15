import { FC, useState } from "react";
import toast from "react-hot-toast";
import cn from "classnames";
import Modal from "./Modal";
import { handleValidationError } from "../../utils/handleValidationError";
import axiosInstance from "../../axiosConfig";
import { useUser } from "../../contexts/UserContext";

export interface DeleteAccountModalProps {
    isVisible: boolean;
    onHide: () => void;
}

const DeleteAccountModal: FC<DeleteAccountModalProps> = ({
    isVisible,
    onHide,
}) => {
    const { setUser } = useUser();
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const onSubmit = async () => {
        setIsSubmitting(true);
        try {
            const response = await axiosInstance.delete(
                "/user/delete-account",
                { withCredentials: true },
            );

            const { msg } = response.data;

            toast.success(msg, {
                duration: 5000,
            });

            setUser(null);
            onHide();
        } catch (error) {
            handleValidationError(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Modal
            isVisible={isVisible}
            disableClose={isSubmitting}
            onHide={() => {
                if (!isSubmitting) onHide();
            }}
            title="are you sure?"
        >
            <div className="modal__content">
                <p className="modal__text" data-testid="delete-modal-warning">
                    <b>Deleting</b> your account <b>will remove</b> all your
                    data permanently. This action cannot be undone.
                </p>
                <p className="modal__text" data-testid="delete-modal-sure">
                    If you are sure about this decision, please confirm by
                    clicking the <b>&quot;Delete&quot;</b> button below.
                </p>
            </div>
            <div className="modal__actions">
                <button
                    type="button"
                    className="modal__actions__btn cancel"
                    disabled={isSubmitting}
                    onClick={onHide}
                    aria-label="Cancel the account deletion"
                >
                    Cancel
                </button>
                <button
                    type="button"
                    className={cn("modal__actions__btn delete", {
                        loading: isSubmitting,
                    })}
                    disabled={isSubmitting}
                    onClick={onSubmit}
                    aria-label="Confirm account deletion"
                >
                    Delete
                </button>
            </div>
        </Modal>
    );
};

export default DeleteAccountModal;
