/** @type {import('tailwindcss').Config} */

const grid = {
  gutter: "1rem",
};

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    fontFamily: {
      sans: ["soh", "sans-serif"],
    },
    extend: {
      fontSize: {
        base: ["var(--text-base)", 1.2],
        xs: ["var(--text-xs)", 1.2],
        sm: ["var(--text-sm)", 1.2],
        md: ["var(--text-md)", 1.2],
        lg: ["var(--text-lg)", 1],
        xl: ["var(--text-xl)", 1],
        xxl: ["var(--text-xxl)", 0.9],
      },
      spacing: {
        gx: "var(--gx)",
        gy: "var(--gy)",

        sm: "var(--sm)",
        md: "var(--md)",
        lg: "var(--lg)",
        xl: "var(--xl)",
        xxl: "var(--xxl)",

        navh: "var(--navh)",

        ...grid,
      },
      aspectRatio: {
        "5/7": "5/7",
      },
    },
  },
  plugins: [],
};
