/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // ── Brand colors (amber/kuning hangat) ──────────────────────
        primary: {
          DEFAULT: "#F59E0B",  // amber-500 – warna utama brand
          hover:   "#D97706",  // amber-600 – hover state
          light:   "#FEF3C7",  // amber-100 – latar terang / badge bg
          dark:    "#92400E",  // amber-800 – teks kontras di atas light
        },
        accent: {
          DEFAULT: "#B45309",  // amber-700 – aksen / highlight teks
          light:   "#FDE68A",  // amber-200
        },
        dark:  "#1A1A1A",       // warna gelap utama (teks, bg dark)
        muted: "#6B7280",       // gray-500 – teks sekunder
      },
      fontFamily: {
        sans: [
          "Inter",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
        ],
      },
      animation: {
        "fade-in":  "fadeIn 0.6s ease-in-out",
        "slide-up": "slideUp 0.6s ease-out",
        "float":    "floatUpDown 4s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%":   { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%":   { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        floatUpDown: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%":      { transform: "translateY(-8px)" },
        },
      },
    },
  },
  plugins: [],
};
