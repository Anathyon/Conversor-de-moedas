/** @type {import('tailwindcss').Config} */
export default {
  content: [
    // Garanta que ele busque em todos os seus arquivos de componente
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}