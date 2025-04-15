import { FC } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import usePageBackground from "../hooks/usePageBackground";

const NotFound: FC = () => {
    const currentBackground =
        "linear-gradient(260deg, #537079 0%, #0c1a21 100%)";

    const background = usePageBackground(currentBackground);

    const navigate = useNavigate();
    return (
        <motion.main
            className="not-found"
            initial={{
                background: background,
            }}
            animate={{
                background: currentBackground,
            }}
            transition={{ duration: 2, ease: "linear" }}
        >
            <motion.div
                className="not-found__icons"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.05 }}
                transition={{ duration: 2, ease: "linear" }}
            />
            <div className="not-found__container">
                <motion.h1
                    className="not-found__title"
                    initial={{ opacity: 0.2 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1.3, ease: "easeIn" }}
                >
                    <b>404</b> not found
                </motion.h1>
                <motion.button
                    type="button"
                    className="not-found__back"
                    onClick={() => navigate(-1)}
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1.5, ease: "linear", delay: 0.5 }}
                >
                    return to previous page
                </motion.button>
            </div>
        </motion.main>
    );
};

export default NotFound;
