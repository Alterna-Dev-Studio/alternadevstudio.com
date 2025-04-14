import { execSync } from "child_process";
import directoryOutput from "@11ty/eleventy-plugin-directory-output";

/**
 * @param {import("@11ty/eleventy").UserConfig} eleventyConfig
 * @returns {ReturnType<import("@11ty/eleventy").configFunction>}
 */
export default function(eleventyConfig) {
  // Add the directory output plugin
  eleventyConfig.addPlugin(directoryOutput);
  
  // Process CSS with PostCSS
  eleventyConfig.on("eleventy.before", async () => {
    console.log("Processing CSS with PostCSS...");
    execSync("npx postcss src/_assets/css/main.css -o _site/css/main.css");
  });
  // Set Nunjucks as the default template engine for HTML and Nunjucks files
  eleventyConfig.setTemplateFormats(["html", "njk", "md"]);
  
  // Configure Nunjucks as the library for both HTML and Nunjucks files
  eleventyConfig.setLibrary("html", eleventyConfig.nunjucksLibrary);
  eleventyConfig.setLibrary("njk", eleventyConfig.nunjucksLibrary);
  
  // Add date filter
  eleventyConfig.addFilter("date", function(date, format) {
    // Return empty string if date is not provided
    if (!date) return "";
    
    // Convert to Date object if it's not already
    const dateObj = new Date(date);
    
    // Format the date based on the format string
    if (format === "YYYY-MM-DD") {
      return dateObj.toISOString().slice(0, 10);
    } else if (format === "MMMM D, YYYY") {
      return dateObj.toLocaleDateString("en-US", { 
        year: "numeric", 
        month: "long", 
        day: "numeric" 
      });
    }
    
    // Default format
    return dateObj.toLocaleDateString("en-US");
  });
  
  // Add markdown filter
  eleventyConfig.addFilter("markdown", function(content) {
    // Return empty string if content is not provided
    if (!content) return "";
    
    // For now, just return the content as-is
    // In a real implementation, you would use a markdown parser here
    return content;
  });
  
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
    // Watch the src directory and CSS files for changes
    watch: ["src/**/*", "src/_assets/css/**/*.css"]
  });
  
  // Add passthrough copy for assets
  eleventyConfig.addPassthroughCopy("src/_assets");

  return {
    // Directory structure
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      layouts: "_includes",
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
