/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,njk,md}",
    "./src/_includes/**/*.{html,njk}",
    "./src/scripts/**/*.js",
  ],
  safelist: [
    // Grid columns for all breakpoints
    'grid-cols-1',
    'grid-cols-2',
    'grid-cols-3',
    'md:grid-cols-1',
    'md:grid-cols-2',
    'md:grid-cols-3',
    'lg:grid-cols-1',
    'lg:grid-cols-2',
    'lg:grid-cols-3',
    // Tag color classes (dynamically applied in JS)
    'bg-rb-yellow',
    'bg-rb-mint',
    'bg-rb-blue-tint',
    'bg-rb-red-tint',
    'bg-rb-magenta',
    'bg-off-white',
    'border-rb-blue',
    'text-rb-blue',
    'text-dark',
    'border-dark',
    // Gap utilities
    'gap-xl',
  ],
};
