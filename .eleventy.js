module.exports = function(eleventyConfig) {
    // Passthrough copy for 404.html
    eleventyConfig.addPassthroughCopy("404.html");
  
    // Add other configuration options if needed
  
    return {
      dir: {
        input: "src",       // Source directory
        includes: "_includes",
        data: "_data",
        output: "docs"      // Output directory
      },
      passthroughFileCopy: true
    };
  };
  