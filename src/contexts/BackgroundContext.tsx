import { createContext, useContext, useState, FC, ReactNode } from "react";

type BackgroundContextType = {
    background: string;
    setBackground: (background: string) => void;
};

const BackgroundContext = createContext<BackgroundContextType | undefined>(
    undefined,
);

export const useBackground = () => {
    const context = useContext(BackgroundContext);
    if (!context) {
        throw new Error(
            "useBackground must be used within a BackgroundProvider",
        );
    }
    return context;
};

export const BackgroundProvider: FC<{ children: ReactNode }> = ({
    children,
}) => {
    const [background, setBackground] = useState<string>("");

    return (
        <BackgroundContext.Provider value={{ background, setBackground }}>
            {children}
        </BackgroundContext.Provider>
    );
};
