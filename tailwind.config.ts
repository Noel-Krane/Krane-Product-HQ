import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary-yellow': '#F59E0B',
        'primary-yellow-light': '#FCD34D',
        'primary-yellow-dark': '#D97706',
        'accent-yellow': '#FEF3C7',
        'background-yellow': '#FFFBEB',
        'charcoal': '#374151',
        'charcoal-light': '#6B7280',
        'charcoal-dark': '#1F2937',
      },
      boxShadow: {
        'yellow': '0 4px 6px -1px rgba(245, 158, 11, 0.25), 0 2px 4px -1px rgba(245, 158, 11, 0.25)',
        'yellow-lg': '0 10px 15px -3px rgba(245, 158, 11, 0.25), 0 4px 6px -2px rgba(245, 158, 11, 0.25)',
        'yellow-xl': '0 20px 25px -5px rgba(245, 158, 11, 0.25), 0 10px 10px -5px rgba(245, 158, 11, 0.25)',
        'yellow-strong': '0 4px 6px -1px rgba(245, 158, 11, 0.4), 0 2px 4px -1px rgba(245, 158, 11, 0.4)',
      }
    },
  },
  plugins: [],
} satisfies Config;
