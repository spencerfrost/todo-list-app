/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border) / <alpha-value>)",
        input: "hsl(var(--input) / <alpha-value>)",
        ring: "hsl(var(--ring) / <alpha-value>)",
        background: "hsl(var(--background) / <alpha-value>)",
        foreground: "hsl(var(--foreground) / <alpha-value>)",
        primary: {
          DEFAULT: "hsl(var(--primary-500) / <alpha-value>)",
          50: "hsl(var(--primary-50) / <alpha-value>)",
          100: "hsl(var(--primary-100) / <alpha-value>)",
          200: "hsl(var(--primary-200) / <alpha-value>)",
          300: "hsl(var(--primary-300) / <alpha-value>)",
          400: "hsl(var(--primary-400) / <alpha-value>)",
          500: "hsl(var(--primary-500) / <alpha-value>)",
          600: "hsl(var(--primary-600) / <alpha-value>)",
          700: "hsl(var(--primary-700) / <alpha-value>)",
          800: "hsl(var(--primary-800) / <alpha-value>)",
          900: "hsl(var(--primary-900) / <alpha-value>)",
          950: "hsl(var(--primary-950) / <alpha-value>)",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary-600) / <alpha-value>)",
          50: "hsl(var(--secondary-50) / <alpha-value>)",
          100: "hsl(var(--secondary-100) / <alpha-value>)",
          200: "hsl(var(--secondary-200) / <alpha-value>)",
          300: "hsl(var(--secondary-300) / <alpha-value>)",
          400: "hsl(var(--secondary-400) / <alpha-value>)",
          500: "hsl(var(--secondary-500) / <alpha-value>)",
          600: "hsl(var(--secondary-600) / <alpha-value>)",
          700: "hsl(var(--secondary-700) / <alpha-value>)",
          800: "hsl(var(--secondary-800) / <alpha-value>)",
          900: "hsl(var(--secondary-900) / <alpha-value>)",
          950: "hsl(var(--secondary-950) / <alpha-value>)",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive-900) / <alpha-value>)",
          50: "hsl(var(--destructive-50) / <alpha-value>)",
          100: "hsl(var(--destructive-100) / <alpha-value>)",
          200: "hsl(var(--destructive-200) / <alpha-value>)",
          300: "hsl(var(--destructive-300) / <alpha-value>)",
          400: "hsl(var(--destructive-400) / <alpha-value>)",
          500: "hsl(var(--destructive-500) / <alpha-value>)",
          600: "hsl(var(--destructive-600) / <alpha-value>)",
          700: "hsl(var(--destructive-700) / <alpha-value>)",
          800: "hsl(var(--destructive-800) / <alpha-value>)",
          900: "hsl(var(--destructive-900) / <alpha-value>)",
          950: "hsl(var(--destructive-950) / <alpha-value>)",
        },
        muted: {
          DEFAULT: "hsl(var(--muted) / <alpha-value>)",
          foreground: "hsl(var(--muted-foreground) / <alpha-value>)",
        },
        accent: {
          DEFAULT: "hsl(var(--accent) / <alpha-value>)",
          foreground: "hsl(var(--accent-foreground) / <alpha-value>)",
        },
        popover: {
          DEFAULT: "hsl(var(--popover) / <alpha-value>)",
          foreground: "hsl(var(--popover-foreground) / <alpha-value>)",
        },
        card: {
          DEFAULT: "hsl(var(--card) / <alpha-value>)",
          foreground: "hsl(var(--card-foreground) / <alpha-value>)",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        round: "50%",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}