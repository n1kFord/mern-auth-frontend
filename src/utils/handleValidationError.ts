import { AxiosError } from "axios";
import toast from "react-hot-toast";

export const handleValidationError = (
    error: unknown,
    defaultMsg: string = "An error occurred during the request",
) => {
    if (error instanceof AxiosError) {
        const serverErrors = error.response?.data?.errors;

        if (Array.isArray(serverErrors) && serverErrors.length > 0) {
            const firstError = serverErrors[0];
            toast.error(firstError.msg, { duration: 5000 });
        } else if (error.response?.data?.msg) {
            toast.error(error.response.data.msg, { duration: 5000 });
        } else {
            toast.error(defaultMsg, { duration: 5000 });
        }
    } else {
        toast.error(defaultMsg, { duration: 5000 });
    }
};
