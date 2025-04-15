import { FC } from "react";
import { Route, Routes } from "react-router-dom";
import CustomToaster from "./components/CustomToaster";
import Navbar from "./components/Navbar";
import { Home, Register, Login, Dashboard, About, NotFound } from "./pages";
import { BackgroundProvider } from "./contexts/BackgroundContext";
import { useUser } from "./contexts/UserContext";
import PrivateRoute from "./components/PrivateRoute";
import RedirectToDashboard from "./components/RedirectToDashboard";

const App: FC = () => {
    const { user } = useUser();
    return (
        <BackgroundProvider>
            <CustomToaster />
            {user && <Navbar />}
            <Routes>
                <Route
                    path="/"
                    element={user ? <RedirectToDashboard /> : <Home />}
                />
                <Route
                    path="/register"
                    element={user ? <RedirectToDashboard /> : <Register />}
                />
                <Route
                    path="/login"
                    element={user ? <RedirectToDashboard /> : <Login />}
                />
                <Route
                    path="/dashboard"
                    element={
                        <PrivateRoute>
                            <Dashboard />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/about"
                    element={
                        <PrivateRoute>
                            <About />
                        </PrivateRoute>
                    }
                />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </BackgroundProvider>
    );
};

export default App;
