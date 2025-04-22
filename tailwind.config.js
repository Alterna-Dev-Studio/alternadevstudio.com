/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,js,njk,md}"],
  theme: {
    extend: {
      colors: {
        primary: "#064672",    // Headers, nav, footer, buttons
        secondary: "#1C89D8",  // Icons, links, backgrounds, hover
        accent: "#D8701C",     // CTA buttons, highlights, links
        highlight: "#A67C00",  // Labels, badges, subtle callouts
      },
    },
  },
  plugins: [],
}
