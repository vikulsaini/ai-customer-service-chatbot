export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: { sans: ["Inter", "ui-sans-serif", "system-ui"] },
      colors: {
        ink: "#0f172a",
        ocean: "#0f766e",
        coral: "#f97316",
        violet: "#7c3aed"
      },
      boxShadow: {
        glass: "0 24px 80px rgba(15,23,42,0.16)"
      }
    }
  },
  plugins: []
};
