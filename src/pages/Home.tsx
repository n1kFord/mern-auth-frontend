import { FC } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { backgroundImg } from "../assets";

const Home: FC = () => {
    return (
        <main className="home" aria-labelledby="home-title">
            <img src={backgroundImg} alt="" className="home__bg" />
            <div className="home__container">
                <h1 id="home-title" className="home__title">
                    MERN AUTH
                </h1>
                <motion.nav
                    className="home__auth"
                    initial={{ opacity: 0.8, scale: 0.97 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{
                        duration: 0.8,
                        ease: "linear",
                    }}
                    aria-label="Authentication navigation"
                >
                    <Link
                        to="/register"
                        className="home__auth__link"
                        aria-label="Register for an account"
                    >
                        Register
                    </Link>
                    <Link
                        to="/login"
                        className="home__auth__link"
                        aria-label="Login to your account"
                    >
                        Login
                    </Link>
                </motion.nav>
            </div>
        </main>
    );
};

export default Home;
