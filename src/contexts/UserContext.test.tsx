import { render, screen, act } from "@testing-library/react";
import { useUser, UserProvider } from "./UserContext";
import axiosInstance from "../axiosConfig";

jest.mock("../axiosConfig");

const TestComponent = () => {
    const { user, setUser, isLoading } = useUser();
    return (
        <div>
            <div data-testid="is-loading">
                {isLoading ? "Loading" : "Loaded"}
            </div>
            <div data-testid="user">{user ? user.username : "No user"}</div>
            <button
                data-testid="set-user"
                onClick={() =>
                    setUser({
                        username: "testUser",
                        email: "",
                        logo: "",
                        created_at: "",
                        _id: "",
                        authProvider: "local",
                    })
                }
            >
                Set User
            </button>
        </div>
    );
};

describe("UserContext", () => {
    let consoleErrorSpy: jest.SpyInstance;

    beforeAll(() => {
        consoleErrorSpy = jest
            .spyOn(console, "error")
            .mockImplementation(() => {});
    });

    afterAll(() => {
        consoleErrorSpy.mockRestore();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should render children within the UserProvider", () => {
        render(
            <UserProvider>
                <TestComponent />
            </UserProvider>,
        );

        expect(screen.getByTestId("is-loading")).toBeInTheDocument();
        expect(screen.getByTestId("user")).toBeInTheDocument();
    });

    it("should show loading initially and fetch user data", async () => {
        (axiosInstance.get as jest.Mock).mockResolvedValueOnce({
            data: {
                user: {
                    username: "John",
                    email: "john@example.com",
                    logo: "",
                    created_at: "",
                    _id: "123",
                },
            },
        });

        await act(async () => {
            render(
                <UserProvider>
                    <TestComponent />
                </UserProvider>,
            );
        });

        expect(screen.getByTestId("is-loading")).toHaveTextContent("Loaded");
        expect(screen.getByTestId("user")).toHaveTextContent("John");
    });

    it("should handle error when fetching user data", async () => {
        (axiosInstance.get as jest.Mock).mockRejectedValueOnce(
            new Error("Not authenticated"),
        );

        await act(async () => {
            render(
                <UserProvider>
                    <TestComponent />
                </UserProvider>,
            );
        });

        expect(screen.getByTestId("is-loading")).toHaveTextContent("Loaded");
        expect(screen.getByTestId("user")).toHaveTextContent("No user");
    });

    it("should allow setting the user", () => {
        render(
            <UserProvider>
                <TestComponent />
            </UserProvider>,
        );

        expect(screen.getByTestId("user")).toHaveTextContent("No user");

        act(() => {
            screen.getByTestId("set-user").click();
        });

        expect(screen.getByTestId("user")).toHaveTextContent("testUser");
    });

    it("should throw error if useUser is used outside UserProvider", () => {
        const consoleErrorMock = jest
            .spyOn(console, "error")
            .mockImplementation(() => {});
        const renderOutsideProvider = () => render(<TestComponent />);

        expect(renderOutsideProvider).toThrow(
            "useUser must be used within a UserProvider",
        );

        consoleErrorMock.mockRestore();
    });
});
