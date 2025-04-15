import { FC } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import cn from "classnames";
import toast from "react-hot-toast";
import axiosInstance from "../axiosConfig";
import { AxiosError } from "axios";
import { useUser } from "../contexts/UserContext";

const Navbar: FC = () => {
    const navigate = useNavigate();
    const { setUser } = useUser();

    const navLinks: { name: string; route: string }[] = [
        { name: "About it", route: "/about" },
        { name: "Dashboard", route: "/dashboard" },
    ];

    const handleLogout = async () => {
        try {
            const response = await axiosInstance.post("/auth/logout", {
                withCredentials: true,
            });

            const { msg } = response.data;
            toast.success(msg, { duration: 5000 });

            setUser(null);
            navigate("/login");
        } catch (error: unknown) {
            if (error instanceof AxiosError && error.response?.data?.msg) {
                toast.error(error.response.data.msg, { duration: 5000 });
            } else {
                toast.error("An error occurred", { duration: 5000 });
            }
        }
    };

    return (
        <nav className="nav-bar" aria-label="Main navigation">
            <ul className="nav-bar__list">
                {navLinks.map((link) => (
                    <li key={link.route}>
                        <NavLink
                            className={({ isActive }) =>
                                cn("nav-bar__link", { active: isActive })
                            }
                            to={link.route}
                        >
                            {link.name}
                        </NavLink>
                    </li>
                ))}
                <li>
                    <button
                        className="nav-bar__button"
                        type="button"
                        onClick={handleLogout}
                        aria-label="Log out"
                    >
                        Log out
                    </button>
                </li>
            </ul>
        </nav>
    );
};

export default Navbar;
