/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Your custom color palette
        'brand': {
          'primary': '#D97706',    // Warm Amber (your orange toned down)
          'secondary': '#F59E0B',  // Golden Orange (your yellow toned down)  
          'accent': '#059669',     // Professional Green (your lime toned down)
          'highlight': '#2563EB', // Professional Blue
        },
        // Extended color variations
        'amber': {
          50: '#FFF7ED',
          100: '#FFEDD5', 
          200: '#FED7AA',
          300: '#FDBA74',
          400: '#FB923C',
          500: '#F97316',
          600: '#D97706', // Your primary
          700: '#B45309',
          800: '#92400E',
          900: '#78350F',
        },
        'emerald': {
          50: '#ECFDF5',
          100: '#D1FAE5',
          200: '#A7F3D0', 
          300: '#6EE7B7',
          400: '#34D399',
          500: '#10B981',
          600: '#059669', // Your accent
          700: '#047857',
          800: '#065F46',
          900: '#064E3B',
        },
        'orange': {
          50: '#FFF7ED',
          100: '#FFEDD5',
          200: '#FED7AA', 
          300: '#FDBA74',
          400: '#FB923C',
          500: '#F97316',
          600: '#EA580C', // Slightly different orange
          700: '#C2410C',
          800: '#9A3412',
          900: '#7C2D12',
        }
      },
      fontFamily: {
        sans: ['var(--font-geist-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'monospace'],
      },
    },
  },
  plugins: [],
}