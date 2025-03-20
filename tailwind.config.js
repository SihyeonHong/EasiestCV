/** @type {import('tailwindcss').Config} */
import typography from "@tailwindcss/typography";
import tailwindcssAnimate from "tailwindcss-animate";

const tailwindConfig = {
  darkMode: ["class"],
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
      },
    },
  },
  plugins: [tailwindcssAnimate, typography],
  corePlugins: {
    preflight: true,
  },
};

export default tailwindConfig;
