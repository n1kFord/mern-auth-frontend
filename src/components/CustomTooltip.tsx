import { FC, useState, useEffect } from "react";
import { ITooltip, Tooltip } from "react-tooltip";

const CustomTooltip: FC<ITooltip> = (props) => {
    const [fontSize, setFontSize] = useState(
        window.innerWidth <= 480 ? 12 : 14,
    );

    useEffect(() => {
        const handleResize = () => {
            setFontSize(window.innerWidth <= 480 ? 12 : 14);
        };

        window.addEventListener("resize", handleResize);

        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <Tooltip
            style={{
                backgroundColor: "#25414a",
                color: "#e6e6e6",
                fontSize: fontSize,
            }}
            place="bottom"
            role="tooltip" // ARIA role for tooltips
            aria-live="polite" // Ensures the tooltip content is announced politely
            aria-hidden={!props.isOpen} // Hides tooltip from screen readers when not visible
            {...props}
        />
    );
};

export default CustomTooltip;
