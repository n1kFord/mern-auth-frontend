import { ToastBar, Toaster } from "react-hot-toast";

const CustomToaster = () => (
    <Toaster
        data-testid="toaster"
        position="bottom-center"
        aria-live="polite"
        aria-atomic="true"
        aria-relevant="additions"
        toastOptions={{
            style: {
                zIndex: 20,
                maxWidth: "fit-content",
                marginBottom: 5,
                padding: "8px 20px",
                color: "#ffffff9d",
                backgroundColor: "#2e453f",
            },
            success: {
                iconTheme: {
                    primary: "#689388",
                    secondary: "#ffffffc5",
                },
            },
            error: {
                style: {
                    backgroundColor: "#4d3a3a",
                },
                iconTheme: {
                    primary: "#b15555",
                    secondary: "#ffffffc5",
                },
            },
        }}
    >
        {(t) => (
            <ToastBar
                toast={t}
                style={{
                    ...t.style,
                    animation: `${t.visible ? "fade-in" : "fade-out"} 1s`,
                }}
                aria-live="assertive"
            />
        )}
    </Toaster>
);

export default CustomToaster;
