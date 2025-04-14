/**
 * @param {import("@11ty/eleventy").UserConfig} eleventyConfig
 * @returns {ReturnType<import("@11ty/eleventy").configFunction>}
 */
export default function(eleventyConfig) {
  // Set Nunjucks as the default template engine for HTML and Nunjucks files
  eleventyConfig.setTemplateFormats(["html", "njk", "md"]);
  
  // Configure Nunjucks as the library for both HTML and Nunjucks files
  eleventyConfig.setLibrary("html", eleventyConfig.nunjucksLibrary);
  eleventyConfig.setLibrary("njk", eleventyConfig.nunjucksLibrary);
  
  // Optional: Configure Nunjucks for data files if desired
  // This allows using Nunjucks syntax in your JSON/JS data files
  // Commenting out for now as it's causing issues
  /*
  eleventyConfig.addDataExtension("njk", {
    parser: async (content, path) => {
      const nunjucks = eleventyConfig.nunjucksLibrary;
      return JSON.parse(nunjucks.renderString(content));
    }
  });
  */
  
  // Exclude README.md from processing
  eleventyConfig.ignores.add("README.md");
  
  // Explicitly set the files to process
  eleventyConfig.setServerOptions({
    // Only watch the src directory for changes
    watch: ["src/**/*"]
  });

  return {
    // Directory structure
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      layouts: "_layouts",
      data: "_data"
    },
    
    // Use Nunjucks for HTML templates
    htmlTemplateEngine: "njk",
    
    // Use Nunjucks for Markdown templates
    markdownTemplateEngine: "njk",
    
    // Enable passthrough file copy
    passthroughFileCopy: true
  };
}
