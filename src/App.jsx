import { useEffect, lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import useAuthStore from "./store/authStore";
import Chatbot from "./components/ui/Chatbot";

// Lazy-loaded routes for Code Splitting (Reduces main bundle size & fixes PageSpeed Insights)
const ToursPage = lazy(() => import("./pages/ToursPage"));
const TourDetailPage = lazy(() => import("./pages/TourDetailPage"));
const BookingPage = lazy(() => import("./pages/BookingPage"));
const RegisterPage = lazy(() => import("./pages/RegisterPage"));
const DashboardPage = lazy(() => import("./pages/DashboardPage"));
const AdminPage = lazy(() => import("./pages/AdminPage"));
const B2BPage = lazy(() => import("./pages/B2BPage"));
const B2BRegisterPage = lazy(() => import("./pages/B2BRegisterPage"));

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
      <Suspense fallback={<div className="fixed inset-0 flex items-center justify-center bg-[#1A1A1A]"><div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div></div>}>
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
      </Suspense>
      <Chatbot />
    </BrowserRouter>
  );
}

export default App;
