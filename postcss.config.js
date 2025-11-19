module.exports = {
  plugins: [
    require('postcss-modules')({
      generateScopedName: '[name]__[local]___[hash:base64:5]',
      getJSON: function(cssFileName, json, outputFileName) {
        // This function is called when CSS Modules generates the mapping
        // We can optionally save the mapping for server-side rendering
      }
    })
  ]
};
