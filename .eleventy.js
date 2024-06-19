module.exports = function(eleventyConfig) {
    eleventyConfig.addPassthroughCopy("assets");

    return {
        dir: {
            input: "src",
            includes: "_includes",
            output: "_site"
        }
    };
};