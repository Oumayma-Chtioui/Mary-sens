import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#211D17",
        noir: "#141210",
        "noir-2": "#1c1915",
        or: {
          deep: "#8f6f30",
          DEFAULT: "#B08A3E",
          clair: "#E4C98A",
        },
        ivoire: {
          DEFAULT: "#F8F4EC",
          2: "#F1EADC",
        },
        sauge: "#707C5E",
        argile: "#A9432E",
        border: "rgba(33,29,23,0.12)",
        // Public-site palette, matched exactly to the provided design screens.
        panel: "#0b0b0a",
        "panel-2": "#11110f",
        card: "#171717",
        "card-border": "rgba(255,255,255,0.1)",
      },
      fontFamily: {
        // Matches the provided design screens: Source Serif 4 for headings.
        display: ["var(--font-display)", "serif"],
        // Body / UI, matches the provided screens (Inter).
        sans: ["var(--font-sans)", "sans-serif"],
      },
      letterSpacing: {
        widest2: "0.22em",
      },
      maxWidth: {
        wrap: "1280px",
      },
    },
  },
  plugins: [],
};
export default config;
