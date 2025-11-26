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
        'rb-red': {
          DEFAULT: '#FF0000',
          shade: '#CC0000',
          tint: '#FF6666',
        },
        'rb-blue': {
          DEFAULT: '#0000FF',
          shade: '#0000CC',
          tint: '#6666FF',
        },
        'rb-mint': {
          DEFAULT: '00FFD5',
        },
        // Secondary
        'rb-yellow': {
          DEFAULT: '#FFFF00',
        },
        'rb-magenta': {
          DEFAULT: '#F7F0DB',
        },
        'rb-brown': {
          DEFAULT: '#6E160C',
        },
        // Neutrals
        'off-white': '#F5F5F5',
        'gray': '#D9D9D9',  
        'dark': {
          DEFAULT: '1A1A1A',
          'tint-2': '1A1A1A'
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
  plugins: [
    function({ addUtilities, theme }) {
      const spacing = theme('spacing');
      const transitions = theme('transitionDuration');

      // Add custom spacing utilities
      const spacingUtilities = {};
      Object.entries(spacing).forEach(([key, value]) => {
        if (['xs', 'sm', 'md', 'lg', 'xl', '2xl'].includes(key)) {
          spacingUtilities[`.p-${key}`] = { padding: value };
          spacingUtilities[`.px-${key}`] = { 'padding-left': value, 'padding-right': value };
          spacingUtilities[`.py-${key}`] = { 'padding-top': value, 'padding-bottom': value };
          spacingUtilities[`.m-${key}`] = { margin: value };
          spacingUtilities[`.mx-${key}`] = { 'margin-left': value, 'margin-right': value };
          spacingUtilities[`.my-${key}`] = { 'margin-top': value, 'margin-bottom': value };
          spacingUtilities[`.mt-${key}`] = { 'margin-top': value };
          spacingUtilities[`.mb-${key}`] = { 'margin-bottom': value };
          spacingUtilities[`.ml-${key}`] = { 'margin-left': value };
          spacingUtilities[`.mr-${key}`] = { 'margin-right': value };
          spacingUtilities[`.gap-${key}`] = { gap: value };
          spacingUtilities[`.pl-${key}`] = { 'padding-left': value };
        }
      });

      // Add custom transition utilities
      const transitionUtilities = {};
      Object.entries(transitions).forEach(([key, value]) => {
        if (['fast', 'base', 'slow'].includes(key)) {
          transitionUtilities[`.transition-${key}`] = { 'transition-duration': value };
        }
      });

      addUtilities({ ...spacingUtilities, ...transitionUtilities });
    }
  ],
}
