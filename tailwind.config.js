/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#faf5ff',
          100: '#f3e8ff',
          200: '#e9d5ff',
          300: '#d8b4fe',
          400: '#c084fc',
          500: '#a855f7',
          600: '#9333ea',
          700: '#7e22ce',
          800: '#6b21a8',
          900: '#581c87'
        },
        secondary: {
          50: '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
          700: '#6d28d9',
          800: '#5b21b6',
          900: '#4c1d95'
        }
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(var(--tw-gradient-stops))',
        'gradient-rainbow': 'linear-gradient(45deg, #7e22ce, #6d28d9, #4338ca, #3730a3)',
        'gradient-sunset': 'linear-gradient(45deg, #7e22ce, #9333ea, #6366f1)',
        'gradient-purple': 'linear-gradient(45deg, #7e22ce, #4338ca)',
        'gradient-royal': 'linear-gradient(to right, #6d28d9, #4f46e5)',
        'gradient-lavender': 'linear-gradient(to right, #9333ea, #6366f1)',
        'gradient-cosmic': 'linear-gradient(45deg, rgba(126,34,206,0.9), rgba(99,102,241,0.9))',
        'gradient-hero': 'linear-gradient(135deg, #7e22ce, #6d28d9, #4338ca, #3730a3)',
        'gradient-card': 'linear-gradient(45deg, rgba(126,34,206,0.1), rgba(99,102,241,0.1))'
      }
    }
  },
  plugins: []
};