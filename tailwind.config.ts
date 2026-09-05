import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        paper: "#FAFAF6",
        ink: "#181B18",
        court: "var(--color-court)",
        line: "#E4E2D8",
        clay: "#B8543A",
        ball: "#C7D34C",
      },
      fontFamily: {
        display: ["var(--font-sans)"],
        body: ["var(--font-sans)"],
      },
      maxWidth: {
        content: "72rem",
      },
    },
  },
  plugins: [],
};

export default config;
