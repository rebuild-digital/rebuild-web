module.exports = {
  plugins: {
    "@tailwindcss/postcss": {
      base: "./src",
      content: ["./src/**/*.{html,njk,md}", "./src/_includes/**/*.{html,njk}"],
    },
    autoprefixer: {},
  },
};
