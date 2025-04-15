import { useEffect } from "react";
import { useBackground } from "../contexts/BackgroundContext";

const usePageBackground = (currentBackground: string) => {
    const { background, setBackground } = useBackground();

    useEffect(() => {
        setBackground(currentBackground);
    }, [setBackground, currentBackground]);

    return background || currentBackground;
};

export default usePageBackground;
