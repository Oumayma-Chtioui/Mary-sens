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
          deep: "#A9803F",
          DEFAULT: "#C9A24B",
          clair: "#E7CE97",
        },
        ivoire: {
          DEFAULT: "#F8F4EC",
          2: "#F1EADC",
        },
        sauge: "#707C5E",
        argile: "#A9432E",
        border: "rgba(33,29,23,0.12)",
      },
      fontFamily: {
        // Display: mirrors the high-contrast Bodoni-esque serif used in
        // Mary'sens' own packaging headlines (e.g. "ROLL-ON ANTI-ÂGE").
        display: ["var(--font-display)", "serif"],
        // Accent script: mirrors the flowing tagline lettering on packaging
        // ("L'élixir de jeunesse"). Used sparingly, never for body text.
        script: ["var(--font-script)", "cursive"],
        // Body / UI: warm editorial grotesque, not a default AI sans.
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
