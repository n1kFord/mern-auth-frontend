/* eslint-disable jsx-a11y/no-static-element-interactions */
import { FC, ReactNode, useEffect } from "react";
import { closeIcon } from "../../assets";
import cn from "classnames";

export interface ModalProps {
    isVisible: boolean;
    disableClose?: boolean;
    onHide: () => void;
    title?: string;
    subtitle?: string;
    children: ReactNode;
}

const Modal: FC<ModalProps> = ({
    isVisible,
    disableClose,
    onHide,
    title,
    subtitle,
    children,
}) => {
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape" && !disableClose) {
                onHide();
            }
        };

        if (isVisible) {
            window.addEventListener("keydown", handleKeyDown);
        }

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [isVisible, disableClose, onHide]);

    return (
        <div
            className={cn("modal", { visible: isVisible })}
            aria-hidden={!isVisible}
            aria-labelledby={title ? "modal-title" : undefined}
            aria-describedby={subtitle ? "modal-subtitle" : undefined}
            data-testid="modal"
            onKeyDown={(e) => {
                if (e.key === "Escape" && !disableClose) {
                    onHide();
                }
            }}
            onClick={(e) => {
                if (e.target === e.currentTarget && !disableClose) {
                    onHide();
                }
            }}
        >
            <div className="modal__container" role="document">
                <button
                    type="button"
                    className="modal__close"
                    onClick={onHide}
                    disabled={disableClose}
                    aria-label="Close modal"
                >
                    <img
                        src={closeIcon}
                        alt="close modal"
                        width={32}
                        height={32}
                    />
                </button>
                {title && (
                    <h3
                        id="modal-title"
                        className="modal__title"
                        data-testid="modal-title"
                    >
                        {title}
                    </h3>
                )}
                {subtitle && (
                    <p
                        id="modal-subtitle"
                        className="modal__subtitle"
                        data-testid="modal-subtitle"
                    >
                        {subtitle}
                    </p>
                )}

                {children}
            </div>
        </div>
    );
};

export default Modal;
