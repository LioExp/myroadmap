import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
      colors: {
        brand: {
          purple: "#9333EA",
          "purple-dark": "#7E22CE",
          "purple-light": "#C084FC",
          green: "#22C55E",
          "green-dark": "#16A34A",
          "green-light": "#4ADE80",
        },
        page: "rgb(var(--c-page) / <alpha-value>)",
        surface: "rgb(var(--c-surface) / <alpha-value>)",
        "surface-2": "rgb(var(--c-surface-2) / <alpha-value>)",
        main: "rgb(var(--c-main) / <alpha-value>)",
        strong: "rgb(var(--c-strong) / <alpha-value>)",
        muted: "rgb(var(--c-muted) / <alpha-value>)",
        faint: "rgb(var(--c-faint) / <alpha-value>)",
        ghost: "rgb(var(--c-ghost) / <alpha-value>)",
        line: "rgb(var(--c-line) / <alpha-value>)",
        "line-strong": "rgb(var(--c-line-strong) / <alpha-value>)",
      },
      animation: {
        pulse: "pulse 2s infinite",
        float: "float 3s ease-in-out infinite",
        "fade-in": "fadeIn 0.3s ease-out",
        shake: "shake 0.5s ease-in-out infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(-4px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shake: {
          "0%, 100%": { transform: "rotate(0deg)" },
          "25%": { transform: "rotate(-8deg)" },
          "50%": { transform: "rotate(0deg)" },
          "75%": { transform: "rotate(8deg)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
