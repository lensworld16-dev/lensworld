/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#0f766e", // Luxury Deep Emerald / Teal
          hover: "#115e59",
          light: "#ccfbf1",
          dark: "#134e4a",
          foreground: "#ffffff"
        },
        accent: {
          gold: "#d97706",
          amber: "#f59e0b",
          rose: "#e11d48",
          blue: "#2563eb"
        },
        ink: {
          DEFAULT: "#090d16",
          light: "#1e293b",
          dark: "#05070c"
        }
      },
      fontFamily: {
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
        display: ['"Outfit"', '"Inter"', 'sans-serif'],
        heading: ['"Outfit"', 'sans-serif'],
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.08)',
        'glow': '0 0 25px rgba(15, 118, 110, 0.25)',
        'premium': '0 20px 40px -15px rgba(0, 0, 0, 0.07), 0 0 1px 1px rgba(0, 0, 0, 0.05)',
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 4s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        }
      }
    },
  },
  plugins: [],
}
