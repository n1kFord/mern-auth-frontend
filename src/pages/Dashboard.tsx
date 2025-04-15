import { FC, useState } from "react";
import { motion } from "framer-motion";
import cn from "classnames";
import usePageBackground from "../hooks/usePageBackground";
import { editIcon } from "../assets";
import CopyButton from "../components/CopyButton";
import {
    ChangeUsernameModal,
    ChangePasswordModal,
    DeleteAccountModal,
} from "../components/modals";
import { useUser } from "../contexts/UserContext";

const Dashboard: FC = () => {
    const { user } = useUser();
    const isOAuthUser = user?.authProvider !== "local";

    const currentBackground =
        "linear-gradient(240deg, #667e85 0%, #0c1a21 100%)";

    const background = usePageBackground(currentBackground);

    const [isChangeUsernameModalVisible, setIsChangeUsernameModalVisible] =
        useState<boolean>(false);

    const [isChangePasswordModalVisible, setIsChangePasswordModalVisible] =
        useState<boolean>(false);

    const [isDeleteAccountModalVisible, setIsDeleteAccountModalVisible] =
        useState<boolean>(false);

    const actionButtons: {
        label: string;
        isLight: boolean;
        disabled: boolean;
        onClick: () => void;
    }[] = [
        {
            label: "Change username",
            isLight: false,
            disabled: false,
            onClick: () => {
                setIsChangeUsernameModalVisible(true);
            },
        },
        {
            label: "Change password",
            isLight: false,
            disabled: isOAuthUser,
            onClick: () => {
                if (!isOAuthUser) {
                    setIsChangePasswordModalVisible(true);
                }
            },
        },
        {
            label: "Delete account",
            isLight: true,
            disabled: false,
            onClick: () => {
                setIsDeleteAccountModalVisible(true);
            },
        },
    ];

    return (
        <motion.main
            className="dashboard"
            initial={{
                background: background,
            }}
            animate={{
                background: currentBackground,
            }}
            transition={{ duration: 2, ease: "linear" }}
        >
            <motion.div
                className="dashboard__card"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, ease: "linear" }}
            >
                <div className="dashboard__card__container">
                    <h1 className="dashboard__title" id="dashboard-heading">
                        Dashboard
                    </h1>
                    <div
                        className="dashboard__info"
                        aria-labelledby="dashboard-heading"
                    >
                        <img
                            src={user!.logo}
                            alt="your logo"
                            className="dashboard__info__logo"
                            width={121}
                            height={121}
                        />
                        <div
                            className="dashboard__info__details"
                            aria-label="User Information"
                            role="list"
                        >
                            <div
                                className="dashboard__info__item"
                                role="listitem"
                            >
                                <h2 className="dashboard__info__item__label">
                                    username:
                                </h2>
                                <p
                                    className="dashboard__info__item__value"
                                    data-testid="user-name"
                                >
                                    {user!.username}
                                </p>
                                <button
                                    type="button"
                                    aria-label="Edit username"
                                    className="dashboard__info__item__button"
                                    onClick={() =>
                                        setIsChangeUsernameModalVisible(true)
                                    }
                                >
                                    <img
                                        src={editIcon}
                                        alt=""
                                        width={17}
                                        height={17}
                                    />
                                </button>
                            </div>
                            <div
                                className="dashboard__info__item"
                                role="listitem"
                            >
                                <h2 className="dashboard__info__item__label">
                                    email:
                                </h2>
                                <p className="dashboard__info__item__value email">
                                    {user!.email}
                                </p>
                                <CopyButton
                                    textToCopy={user!.email}
                                    uniqueId="copy-email"
                                    margin="0 0 0 4px"
                                />
                            </div>
                        </div>
                    </div>
                    <div
                        className="dashboard__actions"
                        role="group"
                        aria-label="User actions"
                    >
                        {actionButtons.map((button, i) => (
                            <motion.button
                                key={button.label}
                                type="button"
                                aria-label={button.label}
                                className={cn("dashboard__actions__item", {
                                    light: button.isLight,
                                })}
                                disabled={button.disabled}
                                onClick={button.onClick}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{
                                    duration: 1.2,
                                    ease: "easeInOut",
                                    delay: 0.3 * i,
                                }}
                            >
                                {button.label}
                            </motion.button>
                        ))}
                    </div>
                    <div className="dashboard__other-info">
                        <div className="dashboard__other-info__item">
                            <h2 className="dashboard__other-info__item__label">
                                created at:
                            </h2>
                            <p className="dashboard__other-info__item__value">
                                {user!.created_at}
                            </p>
                        </div>
                        <div className="dashboard__other-info__item">
                            <h2 className="dashboard__other-info__item__label">
                                id:
                            </h2>
                            <p className="dashboard__other-info__item__value">
                                {user!._id}
                            </p>
                            <CopyButton
                                textToCopy={user!._id}
                                uniqueId="copy-id"
                                margin="0 0 1px 2px"
                            />
                        </div>
                    </div>
                </div>
            </motion.div>

            <ChangeUsernameModal
                isVisible={isChangeUsernameModalVisible}
                onHide={() => setIsChangeUsernameModalVisible(false)}
                currentUsername={user!.username}
            />
            <ChangePasswordModal
                isVisible={isChangePasswordModalVisible}
                onHide={() => setIsChangePasswordModalVisible(false)}
            />
            <DeleteAccountModal
                isVisible={isDeleteAccountModalVisible}
                onHide={() => setIsDeleteAccountModalVisible(false)}
            />
        </motion.main>
    );
};

export default Dashboard;
