import { FC, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const RedirectToDashboard: FC = () => {
    const navigate = useNavigate();

    useEffect(() => {
        navigate("/dashboard");
    }, [navigate]);

    return null;
};

export default RedirectToDashboard;
