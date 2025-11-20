/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,njk,md}",
    "./src/_includes/**/*.{html,njk}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary colors
        red: {
          DEFAULT: '#FF0000',
          shade: '#CC0000',
          tint: '#FF6666',
        },
        blue: {
          DEFAULT: '#0000FF',
          shade: '#0000CC',
          tint: '#6666FF',
        },
        yellow: {
          DEFAULT: '#FFFF00',
          shade: '#CCCC00',
          tint: '#FFFF66',
        },
        // Neutrals
        'off-white': '#F5F5F5',
        dark: {
          DEFAULT: '#1A1A1A',
          tint: {
            1: '#333333',
            2: '#4D4D4D',
            3: '#666666',
          },
        },
      },
      fontFamily: {
        custom: [
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          'sans-serif',
        ],
      },
      spacing: {
        'xs': '0.5rem',
        'sm': '1rem',
        'md': '1.5rem',
        'lg': '2rem',
        'xl': '3rem',
        '2xl': '4rem',
      },
      borderRadius: {
        'sm': '4px',
        'md': '8px',
        'lg': '12px',
      },
      transitionDuration: {
        'fast': '150ms',
        'base': '250ms',
        'slow': '350ms',
      },
    },
  },
  plugins: [],
}
