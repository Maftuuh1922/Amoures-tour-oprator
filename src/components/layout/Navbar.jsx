import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Menu, X, LogOut, ChevronDown, Building2, Shield } from "lucide-react";
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

  const isAdmin = profile?.role === "admin";

  /* scroll → tint */
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  /* close dropdown on outside click */
  useEffect(() => {
    const fn = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target))
        setUserMenuOpen(false);
    };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, []);

  /* close mobile on resize */
  useEffect(() => {
    const fn = () => {
      if (window.innerWidth >= 768) setMobileOpen(false);
    };
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
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

  /* ─── glass tint ─────────────────────────────────────────────── */
  const onHero = location.pathname === "/";
  const isLight = scrolled || mobileOpen || !onHero;
  const glassClass = isLight
    ? "bg-white/85 backdrop-blur-2xl border-white/60 shadow-xl shadow-black/10"
    : "bg-white/8 backdrop-blur-xl border-white/20 shadow-lg shadow-black/10";
  const textCls = isLight ? "text-gray-700" : "text-white";
  const logoCls = isLight ? "text-dark" : "text-white";

  return (
    <>
      <nav
        className={`
        fixed z-50 top-4 left-1/2 -translate-x-1/2
        w-[calc(100%-2rem)] max-w-7xl
        rounded-3xl border
        transition-all duration-500
        ${glassClass}
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
                alt="Amoures Tour Operator"
                className="h-10 w-auto object-contain drop-shadow-sm group-hover:scale-105 transition-transform duration-200"
              />
            </Link>

            {/* ── Desktop nav ── */}
            <div className="hidden md:flex items-center gap-0.5">
              {NAV_LINKS.map(({ label, href }) => (
                <a
                  key={href}
                  href={href}
                  onClick={(e) => handleAnchorClick(e, href)}
                  className={`
                    relative px-3.5 py-2 rounded-xl text-sm font-medium
                    transition-all duration-200 hover:bg-primary/15 hover:text-primary
                    after:absolute after:bottom-1.5 after:left-1/2 after:-translate-x-1/2
                    after:h-0.5 after:w-0 after:bg-primary after:rounded-full
                    after:transition-all after:duration-200 hover:after:w-4
                    ${textCls}
                  `}
                >
                  {label}
                </a>
              ))}
              <Link
                to="/b2b"
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-medium transition-all hover:bg-primary/15 hover:text-primary ${textCls}`}
              >
                <Building2 className="w-3.5 h-3.5" />
                B2B
              </Link>
            </div>

            {/* ── Desktop right ── */}
            <div className="hidden md:flex items-center gap-2">
              {user ? (
                <div className="relative" ref={userMenuRef}>
                  {/* Avatar trigger */}
                  <button
                    onClick={() => setUserMenuOpen((v) => !v)}
                    className={`flex items-center gap-2 pl-1 pr-3 py-1 rounded-2xl transition-all hover:bg-primary/15 ${textCls}`}
                  >
                    <span className="w-8 h-8 rounded-xl bg-primary text-dark font-black text-sm flex items-center justify-center shadow-sm">
                      {avatarLetter}
                    </span>
                    <span className="text-sm font-semibold max-w-[110px] truncate">
                      {displayName}
                    </span>
                    <ChevronDown
                      className={`w-3.5 h-3.5 transition-transform duration-200 ${userMenuOpen ? "rotate-180" : ""}`}
                    />
                  </button>

                  {/* ── Dropdown ── */}
                  {userMenuOpen && (
                    <div className="absolute right-0 mt-3 w-56 bg-white/95 backdrop-blur-2xl rounded-3xl shadow-2xl border border-gray-100/80 overflow-hidden z-50">
                      {/* User info header */}
                      <div className="px-4 py-4 border-b border-gray-100">
                        <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-1">
                          Masuk Sebagai
                        </p>
                        <p className="text-sm font-bold text-dark truncate">
                          {displayName}
                        </p>
                        <p className="text-xs text-gray-400 truncate mt-0.5">
                          {user.email}
                        </p>
                      </div>

                      {/* Admin Panel — only for admins */}
                      {isAdmin && (
                        <Link
                          to="/admin"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-3.5 text-sm text-gray-700 hover:bg-primary/10 hover:text-primary transition-colors font-medium"
                        >
                          <div className="w-7 h-7 rounded-lg bg-primary/15 flex items-center justify-center">
                            <Shield className="w-4 h-4 text-primary" />
                          </div>
                          Admin Panel
                        </Link>
                      )}

                      {/* Keluar */}
                      <div className="border-t border-gray-100">
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-4 py-3.5 text-sm text-red-500 hover:bg-red-50 transition-colors font-medium"
                        >
                          <div className="w-7 h-7 rounded-lg bg-red-50 flex items-center justify-center">
                            <LogOut className="w-4 h-4 text-red-500" />
                          </div>
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
                    className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all hover:bg-primary/15 hover:text-primary ${textCls}`}
                  >
                    Masuk
                  </Link>
                  <Link
                    to="/register"
                    className="px-5 py-2.5 bg-primary hover:bg-[#FFA000] text-dark text-sm font-bold rounded-xl shadow-md hover:shadow-lg transition-all active:scale-95"
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
              className={`md:hidden p-2 rounded-xl transition-colors hover:bg-primary/15 ${isLight ? "text-dark" : "text-white"}`}
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
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${mobileOpen ? "max-h-[520px] opacity-100" : "max-h-0 opacity-0"}`}
        >
          <div className="px-4 pt-1 pb-5 space-y-1 border-t border-white/20">
            {NAV_LINKS.map(({ label, href }) => (
              <a
                key={href}
                href={href}
                onClick={(e) => handleAnchorClick(e, href)}
                className={`block px-4 py-3 rounded-xl font-medium text-sm transition-colors hover:bg-primary/15 hover:text-primary ${textCls}`}
              >
                {label}
              </a>
            ))}
            <Link
              to="/b2b"
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl font-medium text-sm transition-colors hover:bg-primary/15 hover:text-primary ${textCls}`}
            >
              <Building2 className="w-4 h-4" />
              Kemitraan B2B
            </Link>

            <div className="pt-3 border-t border-white/20 space-y-2">
              {user ? (
                <>
                  {/* User info */}
                  <div
                    className={`flex items-center gap-3 px-4 py-3 rounded-2xl ${isLight ? "bg-gray-50" : "bg-white/10"}`}
                  >
                    <span className="w-9 h-9 rounded-xl bg-primary text-dark font-black text-sm flex items-center justify-center flex-shrink-0">
                      {avatarLetter}
                    </span>
                    <div className="min-w-0">
                      <p
                        className={`text-sm font-bold truncate ${isLight ? "text-dark" : "text-white"}`}
                      >
                        {displayName}
                      </p>
                      <p
                        className={`text-xs truncate ${isLight ? "text-gray-400" : "text-white/60"}`}
                      >
                        {user.email}
                      </p>
                    </div>
                  </div>

                  {/* Admin Panel — only for admins */}
                  {isAdmin && (
                    <Link
                      to="/admin"
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-colors hover:bg-primary/15 hover:text-primary ${textCls}`}
                    >
                      <Shield className="w-4 h-4" />
                      Admin Panel
                    </Link>
                  )}

                  {/* Keluar */}
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
                    className={`block text-center px-4 py-3 rounded-xl font-semibold text-sm border-2 transition-colors ${isLight ? "border-primary text-dark hover:bg-primary/10" : "border-white/50 text-white hover:bg-white/10"}`}
                  >
                    Masuk
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMobileOpen(false)}
                    className="block text-center px-4 py-3 rounded-xl bg-primary hover:bg-[#FFA000] text-dark font-bold text-sm shadow-md transition-all active:scale-95"
                  >
                    Daftar Sekarang
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
