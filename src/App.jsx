import { useEffect, lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import ChatBot from "./components/ChatBot";
import useAuthStore from "./store/authStore";

// Lazy-loaded untuk code splitting
const TourDetailPage = lazy(() => import("./pages/TourDetailPage"));
const BookingPage = lazy(() => import("./pages/BookingPage"));
const RegisterPage = lazy(() => import("./pages/RegisterPage"));
const DashboardPage = lazy(() => import("./pages/DashboardPage"));
const AdminPage = lazy(() => import("./pages/AdminPage"));
const B2BPage = lazy(() => import("./pages/B2BPage"));
const B2BRegisterPage = lazy(() => import("./pages/B2BRegisterPage"));

const Loader = () => (
  <div className="fixed inset-0 flex items-center justify-center bg-[#1A1A1A]">
    <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
  </div>
);

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

      {/* Chatbot muncul di semua halaman */}
      <ChatBot />

      <Suspense fallback={<Loader />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
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
    </BrowserRouter>
  );
}

export default App;
