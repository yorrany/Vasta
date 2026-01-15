/** @type {import('tailwindcss').Config} */
export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["system-ui", "ui-sans-serif", "sans-serif"]
      },
      colors: {
        vasta: {
          bg: "#050816",
          surface: "#0B1220",
          surfaceSoft: "#111827",
          primary: "#6366F1",
          primarySoft: "#4F46E5",
          accent: "#EC4899",
          accentSoft: "#22D3EE",
          text: "#E5E7EB",
          muted: "#9CA3AF"
        }
      },
      boxShadow: {
        card: "0 24px 60px rgba(15, 23, 42, 0.8)"
      }
    }
  },
  plugins: []
}

