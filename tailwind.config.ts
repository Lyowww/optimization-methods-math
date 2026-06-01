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
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        mesh: "var(--mesh-gradient)",
      },
      boxShadow: {
        glass: "0 8px 32px rgba(0,0,0,0.12)",
      },
    },
  },
  plugins: [],
};

export default config;
