import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "media",
  theme: {
    extend: {
      screens: {
        xsm: "480px",
      },
      maxWidth: {
        xs: "342px",
        sm: "420px",
        md: "520px",
        lg: "650px",
        article: "760px", // issue/guide reading measure
        band: "1000px", // inner measure of partner strip + subscribe bands
        wide: "1440px", // card grids at page width
      },
      colors: {
        // Base colors
        white: "#FFFFFF",
        black: "#000000",

        // Brand colors
        primary: "#E74B3C", // Buttons
        brand: "#F28116", // Light mode accent
        accent: "#68E3E8", // Dark mode accent

        // Background hierarchy
        background: {
          light: "#FEF4E8", // Page background
          dark: "#14120F", // Warm near-black "wall" — pure black killed the grain
        },

        surface: {
          light: "#FFFFFF", // Cards, inputs
          dark: "#282828", // Cards, standard surfaces
        },

        // Text hierarchy
        text: {
          primary: {
            light: "#000000", // Body text
            dark: "#FFFFFF",
          },
          heading: {
            light: "#000000", // Headings
            dark: "#68E3E8", // Headings get accent treatment
          },
          link: {
            light: "#F28116", // Links use brand color
            dark: "#68E3E8", // Links use accent color
          },
          muted: {
            light: "#6B7280",
            dark: "#9CA3AF",
          },
        },

        // Special elements that don't fit the hierarchy
        countdown: {
          light: "#000000", // Special case: black background in light mode
          dark: "#282828", // Same as surface dark, but semantically different
        },

        // Interactive
        input: {
          background: "#FFFFFF",
          border: "#E5E7EB",
        },

        // Dividers (HR elements, borders)
        border: {
          light: "#E5E7EB", // Subtle light mode divider
          dark: "#374151", // More visible dark mode divider (gray-700)
        },

        // Status
        success: "#10B981",
        error: "#EF4444",

        // Code block
        "code-block": "#22212C",

        // ---------------------------------------------------------------
        // Graffiti redesign (2.0)
        // "Light mode is ink and marker on cream paper.
        //  Dark mode is chalk and spray paint on a dark wall."
        // Values: MIGRATION-PLAN §1.3 where it specifies a token, handoff
        // README's table for the rest. Prototype drift corrected: the accent
        // is the brand `primary` (#E74B3C), not the prototype's #E1503C.
        // ---------------------------------------------------------------

        // Surfaces
        paper: { light: "#FEF4E8", dark: "#14120F" }, // page background
        "paper-band": { light: "#F3E9DC", dark: "#1E1B17" }, // inset/full-bleed bands
        "surface-paper": { light: "#FFFDFA", dark: "#221F1B" }, // cards, tiles
        "input-paper": { light: "#FFFFFF", dark: "#221F1B" }, // text input fill

        // Ink — body text AND every hand-drawn stroke
        ink: { light: "#1C1917", dark: "#F6EEE4" },
        "ink-strong": { light: "#3A342F", dark: "#E4DACE" }, // lead paragraphs
        "ink-muted": { light: "#57504A", dark: "#C9BEB2" }, // secondary body
        "ink-soft": { light: "#6B645D", dark: "#B3A99D" }, // card descriptions
        "ink-faint": { light: "#7A7268", dark: "#9A9088" }, // labels, dates
        "ink-dim": { light: "#A2988B", dark: "#857B71" }, // placeholders, separators

        // Lines
        "border-paper": { light: "#E4D6C3", dark: "#35302A" }, // cards, tiles
        "border-soft": { light: "#EADFD0", dark: "#2A2520" }, // hairlines
        "border-strong": { light: "#DCCDB8", dark: "#3E382F" }, // inputs, pills
        divider: { light: "#F1E5D5", dark: "#241F1A" }, // in-card rules
        "rule-strong": { light: "#1C1917", dark: "#F6EEE4" }, // band rules, inked input

        // Marker — underlines, highlighted words, links, hover borders.
        // Orange in light, cyan in dark: chalk is cyan, spray paint is orange.
        mark: { light: "#E74B3C", dark: "#68E3E8" },
        "mark-hover": { light: "#B93C1C", dark: "#8FEDF1" },

        // Chips need their own foreground: a cyan chip cannot carry white text
        "chip-bg": { light: "#E74B3C", dark: "#68E3E8" },
        "chip-ink": { light: "#FFFFFF", dark: "#0E1516" },

        // CTA hover (the CTA itself is `primary`, orange in both schemes)
        "primary-hover": "#C8402E",

        amber: "#E8A13C", // "Collaborating with" underline
        // Highlighter. Yellow in both schemes — a marker swipe does not
        // invert, and the text on it stays ink either way so it keeps its
        // contrast on the dark wall.
        highlighter: "#FBE85C",

        // Diagonal-stripe image placeholders
        "ph-a": { light: "#F1E6D8", dark: "#221F1A" },
        "ph-b": { light: "#EADFD0", dark: "#2A251F" },

        // Footer — dark in both schemes
        "invert-bg": { light: "#1C1917", dark: "#0A0806" },
        "invert-ink": "#F6EEE4",
        "invert-surface": { light: "#2A2521", dark: "#1A1714" },
        "invert-border": { light: "#453F3A", dark: "#332E29" },
        "invert-soft": "#D9CFC4",
        "invert-muted": "#A99F95",
      },
      borderRadius: {
        lg: "12px",
      },
      fontFamily: {
        "dm-sans": ["var(--font-dm-sans)", "DM Sans", "sans-serif"],
        "permanent-marker": ["var(--font-permanent-marker)", "cursive"],
        "dm-mono": ["var(--font-dm-mono)", "DM Mono", "monospace"],
        "sf-mono": ['"SF Mono"', "monospace"],
        "fira-code": ["var(--font-fira-code)", "Fira Code", "monospace"],
      },
      keyframes: {
        // Slow light sweep across the diamond sponsor tiles
        glimmer: {
          "0%": { transform: "translateX(0)", opacity: "0" },
          "8%": { opacity: "1" },
          "45%": { transform: "translateX(320%)", opacity: "1" },
          "60%, 100%": { transform: "translateX(320%)", opacity: "0" },
        },
        "slide-in": {
          "0%": { transform: "translateY(-100%)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        "slide-out": {
          "0%": { transform: "translateY(0)", opacity: "1" },
          "100%": { transform: "translateY(-100%)", opacity: "0" },
        },
        "float-1": {
          "0%": { transform: "translateY(0) translateX(0) rotate(0deg)" },
          "25%": {
            transform: "translateY(-25px) translateX(15px) rotate(5deg)",
          },
          "50%": {
            transform: "translateY(-40px) translateX(20px) rotate(-3deg)",
          },
          "75%": {
            transform: "translateY(-20px) translateX(10px) rotate(8deg)",
          },
          "100%": { transform: "translateY(0) translateX(0) rotate(0deg)" },
        },
        "float-2": {
          "0%": { transform: "translateY(0) translateX(0) rotate(0deg)" },
          "20%": {
            transform: "translateY(20px) translateX(-15px) rotate(-5deg)",
          },
          "40%": {
            transform: "translateY(35px) translateX(-25px) rotate(3deg)",
          },
          "60%": {
            transform: "translateY(25px) translateX(-10px) rotate(-8deg)",
          },
          "80%": {
            transform: "translateY(10px) translateX(-5px) rotate(4deg)",
          },
          "100%": { transform: "translateY(0) translateX(0) rotate(0deg)" },
        },
        "float-3": {
          "0%": { transform: "translateY(0) translateX(0) rotate(0deg)" },
          "30%": {
            transform: "translateY(-20px) translateX(-25px) rotate(12deg)",
          },
          "50%": {
            transform: "translateY(-30px) translateX(-30px) rotate(15deg)",
          },
          "70%": {
            transform: "translateY(-15px) translateX(-20px) rotate(-10deg)",
          },
          "100%": { transform: "translateY(0) translateX(0) rotate(0deg)" },
        },
        "float-4": {
          "0%": { transform: "translateY(0) translateX(0) rotate(0deg)" },
          "25%": {
            transform: "translateY(30px) translateX(20px) rotate(-12deg)",
          },
          "50%": {
            transform: "translateY(45px) translateX(25px) rotate(20deg)",
          },
          "75%": {
            transform: "translateY(35px) translateX(15px) rotate(-15deg)",
          },
          "100%": { transform: "translateY(0) translateX(0) rotate(0deg)" },
        },
        "float-5": {
          "0%": { transform: "translateY(0) translateX(0) rotate(0deg)" },
          "35%": {
            transform: "translateY(-15px) translateX(-35px) rotate(-12deg)",
          },
          "50%": {
            transform: "translateY(-25px) translateX(-40px) rotate(-15deg)",
          },
          "65%": {
            transform: "translateY(-10px) translateX(-30px) rotate(10deg)",
          },
          "100%": { transform: "translateY(0) translateX(0) rotate(0deg)" },
        },
        "float-6": {
          "0%": { transform: "translateY(0) translateX(0) rotate(0deg)" },
          "20%": {
            transform: "translateY(-15px) translateX(25px) rotate(8deg)",
          },
          "33%": {
            transform: "translateY(-20px) translateX(30px) rotate(-5deg)",
          },
          "50%": {
            transform: "translateY(-10px) translateX(20px) rotate(12deg)",
          },
          "66%": {
            transform: "translateY(15px) translateX(-35px) rotate(-8deg)",
          },
          "80%": {
            transform: "translateY(10px) translateX(-25px) rotate(6deg)",
          },
          "100%": { transform: "translateY(0) translateX(0) rotate(0deg)" },
        },
      },
      animation: {
        glimmer: "glimmer 4.2s ease-in-out infinite",
        "slide-in": "slide-in 0.2s ease-out",
        "slide-out": "slide-out 0.2s ease-in",
        "float-1": "float-1 4s steps(8, end) infinite",
        "float-2": "float-2 5s steps(10, end) infinite",
        "float-3": "float-3 4.5s steps(9, end) infinite",
        "float-4": "float-4 6s steps(12, end) infinite",
        "float-5": "float-5 4.5s steps(9, end) infinite",
        "float-6": "float-6 7s steps(14, end) infinite",
      },
    },
  },
  plugins: [],
};

export default config;
