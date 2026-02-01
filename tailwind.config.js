/** @type {import('tailwindcss').Config} */
import typography from "@tailwindcss/typography";
import tailwindcssAnimate from "tailwindcss-animate";

const tailwindConfig = {
  darkMode: ["class"],
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}", "./src/**/*.css"],
  theme: {
    extend: {
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      colors: {
        background: "var(--background)",
        "background-secondary": "var(--background-secondary)",
        foreground: "var(--foreground)",
        muted: "var(--muted)",
        "editor-color": "var(--tt-editor-bg-color)",
        "bg-code": "var(--bg-code)",
        link: "var(--link)",
      },
      maxWidth: {
        body: "960px",
      },
    },
  },
  plugins: [tailwindcssAnimate, typography],
  corePlugins: {
    preflight: true,
  },
};

export default tailwindConfig;
