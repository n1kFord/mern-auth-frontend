import React, { useState } from "react";
import styled from "styled-components";
import CustomTooltip from "./CustomTooltip";
import { copyIcon } from "../assets";

interface CopyButtonProps {
    textToCopy: string;
    uniqueId: string;
    tooltipContent?: string;
    margin?: string;
    iconSize?: string;
}

const StyledButton = styled.button<{ $margin?: string }>`
    display: flex;
    align-items: center;
    justify-content: center;
    margin: ${(props) => props.$margin || "0"};

    background-color: transparent;
    border: none;
    opacity: 0.5;

    cursor: pointer;
    transition:
        opacity 0.3s linear,
        transform 0.1s linear;

    &:hover:not(&:active) {
        opacity: 0.7;
    }

    &:active {
        transform: scale(1.1);
        opacity: 1;
    }
`;

const Icon = styled.img<{ $iconSize?: string }>`
    width: ${(props) => props.$iconSize || "17px"};
    height: ${(props) => props.$iconSize || "17px"};
`;

const CopyButton: React.FC<CopyButtonProps> = ({
    textToCopy,
    uniqueId,
    tooltipContent = "Copied to clipboard!",
    margin,
    iconSize,
}) => {
    const [isCopied, setIsCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(textToCopy);
            setIsCopied(true);

            setTimeout(() => setIsCopied(false), 1800);
        } catch (err) {
            console.error("Failed to copy text: ", err);
        }
    };

    return (
        <>
            <StyledButton
                type="button"
                onClick={handleCopy}
                data-tooltip-id={uniqueId}
                $margin={margin}
                aria-label="Copy text to clipboard"
                aria-describedby={uniqueId}
            >
                <Icon src={copyIcon} alt="copy" $iconSize={iconSize} />
            </StyledButton>
            <CustomTooltip
                id={uniqueId}
                content={tooltipContent}
                isOpen={isCopied}
                openOnClick
                role="tooltip"
            />
        </>
    );
};

export default CopyButton;
