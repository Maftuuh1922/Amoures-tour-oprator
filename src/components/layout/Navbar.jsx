import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Menu,
  X,
  LogOut,
  User,
  ChevronDown,
  Plane,
  Building2,
  LayoutDashboard,
  Shield,
} from "lucide-react";
import toast from "react-hot-toast";
import useAuthStore from "../../store/authStore";

const NAV_LINKS = [
  { label: "Beranda", href: "#hero" },
  { label: "Destinasi", href: "#destinations" },
  { label: "Paket Tur", href: "#tours" },
  { label: "Tentang Kami", href: "#about" },
  { label: "Kontak", href: "#contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { user, profile, logout } = useAuthStore();
  const userMenuRef = useRef(null);

  /* ── scroll: swap glass tint ── */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* ── close dropdown on outside click ── */
  useEffect(() => {
    const handler = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target))
        setUserMenuOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  /* ── close mobile on resize ── */
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 768) setMobileOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const handleAnchorClick = (e, href) => {
    e.preventDefault();
    setMobileOpen(false);
    const el = document.querySelector(href);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    } else {
      navigate("/");
      setTimeout(
        () =>
          document.querySelector(href)?.scrollIntoView({ behavior: "smooth" }),
        350,
      );
    }
  };

  const handleLogout = async () => {
    setUserMenuOpen(false);
    setMobileOpen(false);
    await logout();
    toast.success("Berhasil keluar.");
    navigate("/");
  };

  const displayName =
    profile?.full_name || user?.email?.split("@")[0] || "Pengguna";
  const avatarLetter = displayName.charAt(0).toUpperCase();
  const isAdmin = profile?.role === "admin";

  /* ─────────────────────────────────────────────────────────────────────────
     Visual states
     • Not scrolled (on hero image): very light glass — white/10, border white/20
     • Scrolled: stronger frosted glass — white/75, border white/40, deeper shadow
  ───────────────────────────────────────────────────────────────────────── */
  const glassBase = "backdrop-blur-xl border transition-all duration-500";
  const glassIdle = "bg-white/10 border-white/20 shadow-lg shadow-black/10";
  const glassScrolled = "bg-white/80 border-white/50 shadow-xl shadow-black/15";

  const isHomePage = location.pathname === "/";
  const effectiveScrolled = scrolled || !isHomePage;

  const textColor = effectiveScrolled ? "text-gray-700" : "text-white";
  const logoColor = effectiveScrolled ? "text-dark" : "text-white";

  return (
    <>
      {/* ── Floating bar ── */}
      <nav
        className={`
          fixed z-50
          top-4 left-1/2 -translate-x-1/2
          w-[calc(100%-2rem)] max-w-7xl
          ${mobileOpen ? "rounded-3xl" : "rounded-full"}
          ${glassBase}
          ${effectiveScrolled || mobileOpen ? glassScrolled : glassIdle}
        `}
      >
        <div className="px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            {/* ── Logo ── */}
            <Link
              to="/"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-2 group flex-shrink-0"
            >
              <img 
                src="/logo.png" 
                alt="Amoures Logo" 
                className="h-8 md:h-10 w-auto object-contain group-hover:scale-105 transition-transform duration-200" 
              />
            </Link>

            {/* ── Desktop nav links ── */}
            <div className="hidden md:flex items-center gap-0.5">
              {NAV_LINKS.map(({ label, href }) => (
                <a
                  key={href}
                  href={href}
                  onClick={(e) => handleAnchorClick(e, href)}
                  className={`
                    relative px-3.5 py-2 rounded-xl text-sm font-medium
                    transition-all duration-200
                    hover:bg-white/20 hover:text-primary
                    ${textColor}
                    after:absolute after:bottom-1 after:left-1/2 after:-translate-x-1/2
                    after:h-0.5 after:w-0 after:bg-primary after:rounded-full
                    after:transition-all after:duration-200
                    hover:after:w-4
                  `}
                >
                  {label}
                </a>
              ))}

              {/* B2B link — slightly accented */}
              <Link
                to="/b2b"
                className={`
                  flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-medium
                  transition-all duration-200 hover:bg-primary/20 hover:text-primary
                  ${textColor}
                `}
              >
                <Building2 className="w-3.5 h-3.5" />
                B2B
              </Link>
            </div>

            {/* ── Desktop right side ── */}
            <div className="hidden md:flex items-center gap-2">
              {user ? (
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setUserMenuOpen((v) => !v)}
                    className={`
                      flex items-center gap-2 pl-1 pr-3 py-1 rounded-xl
                      transition-all duration-200 hover:bg-white/20
                      ${textColor}
                    `}
                  >
                    <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary text-dark font-bold text-sm shadow">
                      {avatarLetter}
                    </span>
                    <span className="text-sm font-semibold max-w-[110px] truncate">
                      {displayName}
                    </span>
                    <ChevronDown
                      className={`w-3.5 h-3.5 transition-transform duration-200 ${userMenuOpen ? "rotate-180" : ""}`}
                    />
                  </button>

                  {/* Dropdown */}
                  {userMenuOpen && (
                    <div className="absolute right-0 mt-3 w-56 bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/60 overflow-hidden">
                      {/* Header */}
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-[11px] text-gray-400 uppercase tracking-wider">
                          Masuk sebagai
                        </p>
                        <p className="text-sm font-bold text-dark truncate mt-0.5">
                          {displayName}
                        </p>
                        <p className="text-xs text-gray-400 truncate">
                          {user.email}
                        </p>
                      </div>

                      {!isAdmin && (
                        <Link
                          to="/dashboard"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-primary/10 hover:text-primary transition-colors"
                        >
                          <LayoutDashboard className="w-4 h-4" />
                          Dashboard Saya
                        </Link>
                      )}

                      {isAdmin && (
                        <Link
                          to="/admin"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-primary/10 hover:text-primary transition-colors"
                        >
                          <Shield className="w-4 h-4" />
                          Admin Panel
                        </Link>
                      )}

                      <div className="border-t border-gray-100">
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-500 hover:bg-red-50 transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          Keluar
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <Link
                    to="/login"
                    className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 hover:bg-white/20 hover:text-primary ${textColor}`}
                  >
                    Masuk
                  </Link>
                  <Link
                    to="/register"
                    className="px-5 py-2 bg-primary hover:bg-[#FFA000] text-dark text-sm font-bold rounded-xl shadow-md hover:shadow-lg transition-all duration-200 active:scale-95"
                  >
                    Daftar
                  </Link>
                </>
              )}
            </div>

            {/* ── Mobile hamburger ── */}
            <button
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Toggle menu"
              className={`
                md:hidden p-2 rounded-xl transition-colors duration-200
                hover:bg-white/20
                ${effectiveScrolled || mobileOpen ? "text-dark" : "text-white"}
              `}
            >
              {mobileOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* ── Mobile menu ── */}
        <div
          className={`
            md:hidden overflow-hidden transition-all duration-300 ease-in-out
            ${mobileOpen ? "max-h-[520px] opacity-100" : "max-h-0 opacity-0"}
          `}
        >
          <div className="px-4 pt-1 pb-5 space-y-1 border-t border-white/20">
            {NAV_LINKS.map(({ label, href }) => (
              <a
                key={href}
                href={href}
                onClick={(e) => handleAnchorClick(e, href)}
                className={`block px-4 py-3 rounded-xl font-medium text-sm hover:bg-white/20 hover:text-primary transition-colors ${effectiveScrolled ? "text-gray-700" : "text-white"}`}
              >
                {label}
              </a>
            ))}
            <Link
              to="/b2b"
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl font-medium text-sm hover:bg-white/20 hover:text-primary transition-colors ${effectiveScrolled ? "text-gray-700" : "text-white"}`}
            >
              <Building2 className="w-4 h-4" />
              Kemitraan B2B
            </Link>

            <div className="pt-3 border-t border-white/20 space-y-2">
              {user ? (
                <>
                  <div
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl ${effectiveScrolled ? "bg-gray-50" : "bg-white/10"}`}
                  >
                    <span className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary text-dark font-bold text-sm flex-shrink-0">
                      {avatarLetter}
                    </span>
                    <div className="min-w-0">
                      <p
                        className={`text-sm font-bold truncate ${effectiveScrolled ? "text-dark" : "text-white"}`}
                      >
                        {displayName}
                      </p>
                      <p
                        className={`text-xs truncate ${effectiveScrolled ? "text-gray-400" : "text-white/60"}`}
                      >
                        {user.email}
                      </p>
                    </div>
                  </div>
                  {!isAdmin && (
                    <Link
                      to="/dashboard"
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm hover:bg-white/20 hover:text-primary transition-colors ${effectiveScrolled ? "text-gray-700" : "text-white"}`}
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      Dashboard
                    </Link>
                  )}
                  {isAdmin && (
                    <Link
                      to="/admin"
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm hover:bg-white/20 hover:text-primary transition-colors ${effectiveScrolled ? "text-gray-700" : "text-white"}`}
                    >
                      <Shield className="w-4 h-4" />
                      Admin Panel
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 font-medium text-sm hover:bg-red-500/10 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Keluar
                  </button>
                </>
              ) : (
                <div className="flex flex-col gap-2">
                  <Link
                    to="/login"
                    onClick={() => setMobileOpen(false)}
                    className={`block text-center px-4 py-3 rounded-xl font-semibold text-sm border-2 transition-colors ${effectiveScrolled ? "border-primary text-dark hover:bg-primary/10" : "border-white/50 text-white hover:bg-white/10"}`}
                  >
                    Masuk
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMobileOpen(false)}
                    className="block text-center px-4 py-3 rounded-xl bg-primary hover:bg-[#FFA000] text-dark font-bold text-sm shadow-md transition-all duration-200 active:scale-95"
                  >
                    Daftar Sekarang
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Spacer — hero section already min-h-screen so no top padding needed */}
    </>
  );
}
