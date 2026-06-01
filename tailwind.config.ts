import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        lab: {
          bg: "var(--lab-bg)",
          card: "var(--lab-card)",
          border: "var(--lab-border)",
          accent: "var(--lab-accent)",
          muted: "var(--lab-muted)",
          text: "var(--lab-text)",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        glass: "0 4px 24px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)",
        "glass-lg": "0 12px 40px rgba(0,0,0,0.12)",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        mesh: "var(--mesh-gradient)",
      },
    },
  },
  plugins: [],
};

export default config;
