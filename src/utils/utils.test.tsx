import { AxiosError, AxiosHeaders } from "axios";
import { checkElements, resizeWindow } from "./testUtils";
import { render } from "@testing-library/react";
import { handleValidationError } from "./handleValidationError";
import toast from "react-hot-toast";

describe("checkElements utility", () => {
    it("should check if a single element is in the document", () => {
        const { container } = render(<div>Test Element</div>);
        const element = container.querySelector("div");

        if (element) {
            checkElements(element);
        } else {
            throw new Error("Element not found");
        }
    });

    it("should check if multiple elements are in the document", () => {
        const { container } = render(
            <>
                <div>Element 1</div>
                <div>Element 2</div>
            </>,
        );
        const elements = container.querySelectorAll("div");

        checkElements(Array.from(elements));
    });
});

describe("resizeWindow utility", () => {
    it("should resize the window and trigger resize event", () => {
        const initialWidth = global.innerWidth;
        const initialHeight = global.innerHeight;

        expect(global.innerWidth).toBe(initialWidth);
        expect(global.innerHeight).toBe(initialHeight);

        resizeWindow(1024, 768);

        expect(global.innerWidth).toBe(1024);
        expect(global.innerHeight).toBe(768);
    });
});

jest.mock("react-hot-toast", () => ({
    error: jest.fn(),
}));

describe("handleValidationError utility", () => {
    it("should display a custom error message when no server errors are provided", () => {
        const mockErrorResponse = new AxiosError(
            "Network error",
            "ERR_NETWORK",
            undefined,
            undefined,
            {
                data: { msg: "Network error occurred" },
                status: 500,
                statusText: "Internal Server Error",
                headers: new AxiosHeaders(),
                config: {
                    headers: new AxiosHeaders(),
                },
            },
        );

        handleValidationError(mockErrorResponse);

        expect(toast.error).toHaveBeenCalledWith("Network error occurred", {
            duration: 5000,
        });
    });

    it("should display the first server error message from validation errors", () => {
        const mockValidationError = new AxiosError(
            "Validation failed",
            "ERR_NETWORK",
            undefined,
            undefined,
            {
                data: {
                    errors: [
                        { msg: "Invalid email address" },
                        { msg: "Password too short" },
                    ],
                },
                status: 400,
                statusText: "Bad Request",
                headers: new AxiosHeaders(),
                config: {
                    headers: new AxiosHeaders(),
                },
            },
        );

        handleValidationError(mockValidationError);

        expect(toast.error).toHaveBeenCalledWith("Invalid email address", {
            duration: 5000,
        });
    });

    it("should display the default error message if no server error or validation errors are provided", () => {
        const mockUnknownError = new AxiosError(
            "Unknown error",
            "ERR_UNKNOWN",
            undefined,
            undefined,
            {
                data: {},
                status: 500,
                statusText: "Internal Server Error",
                headers: new AxiosHeaders(),
                config: {
                    headers: new AxiosHeaders(),
                },
            },
        );

        handleValidationError(mockUnknownError);

        expect(toast.error).toHaveBeenCalledWith(
            "An error occurred during the request",
            {
                duration: 5000,
            },
        );
    });

    it("should display a default error message for non-Axios errors", () => {
        const mockGenericError = new Error("Something went wrong");

        handleValidationError(mockGenericError);

        expect(toast.error).toHaveBeenCalledWith(
            "An error occurred during the request",
            {
                duration: 5000,
            },
        );
    });
});
