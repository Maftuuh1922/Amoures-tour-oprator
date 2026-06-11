import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import HomePage from "./pages/HomePage";
import ToursPage from "./pages/ToursPage";
import TourDetailPage from "./pages/TourDetailPage";
import BookingPage from "./pages/BookingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import AdminPage from "./pages/AdminPage";
import B2BPage from "./pages/B2BPage";
import B2BRegisterPage from "./pages/B2BRegisterPage";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import useAuthStore from "./store/authStore";

function App() {
  const initialize = useAuthStore((s) => s.initialize);
  useEffect(() => {
    initialize();
  }, [initialize]);

  return (
    <BrowserRouter>
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 4000,
          style: {
            background: "#1A1A1A",
            color: "#fff",
            borderRadius: "10px",
            padding: "12px 20px",
          },
          success: { iconTheme: { primary: "#FFC107", secondary: "#1A1A1A" } },
          error: { iconTheme: { primary: "#ef4444", secondary: "#fff" } },
        }}
      />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/tours" element={<ToursPage />} />
        <Route path="/tour/:id" element={<TourDetailPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/b2b" element={<B2BPage />} />
        <Route path="/b2b/register" element={<B2BRegisterPage />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/booking/:packageId" element={<BookingPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/admin" element={<AdminPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
