/** @type {import('tailwindcss').Config} */
import tailwindTypography from '@tailwindcss/typography'
export default {
  // Strictly optional with the Vite plugin, but harmless to include:
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        chat: {
          // Backgrounds
          bg: "#212121", // main background
          sidebar: "#202123", // sidebar
          input: "#40414F", // input area

          // Text
          primary: "#ECECF1", // main text
          secondary: "#9A9B9F", // muted text

          // Accent
          accent: "#10A37F", // button / highlight
          "accent-hover": "#0E8C6F", // hover state
        },
      },
    },
  },
  plugins: [tailwindTypography],
};
