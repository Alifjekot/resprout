/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          50: "#f2f8f4",
          100: "#e1efe5",
          200: "#c4decb",
          300: "#99c4a6",
          400: "#69a37c",
          500: "#46865c",
          600: "#346b47",
          700: "#2a5439",
          800: "#24432f",
          900: "#1f3828",
        },
        earth: {
          50: "#faf8f5",
          100: "#f3ede3",
          200: "#e6d8c3",
          300: "#d5bc9b",
          400: "#c29f74",
          500: "#a98254",
          600: "#8c6643",
          700: "#704e38",
          800: "#5d4132",
          900: "#4f372c",
        },
        sdg: {
          orange: "#F36E25",
          blue: "#1F425B"
        }
      },
      fontFamily: {
        sans: ["system-ui", "-apple-system", "BlinkMacSystemFont", "'Segoe UI'", "Roboto", "sans-serif"],
      },
    },
  },
  plugins: [],
};
