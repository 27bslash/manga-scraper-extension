const path = require("path");
const zip = require("cross-zip");
const fs = require("fs");

var inPath = path.join(__dirname, "../build").replace(/\\/g, "/");
var outPath = path.join(__dirname, "../build.zip").replace(/\\/g, "/");

console.log("Resolved Input Path:", path.resolve(inPath));
console.log("Resolved Output Path:", path.resolve(outPath));

// Ensure the build directory exists
if (!fs.existsSync(path.resolve(inPath))) {
  console.error("The build directory does not exist at:", path.resolve(inPath));
  process.exit(1);
}

// Check if build.zip already exists as a file, and delete it if it does
if (fs.existsSync(outPath)) {
  console.log("build.zip already exists. Removing it...");

  // Remove the zip file using unlinkSync for files
  try {
    fs.unlinkSync(outPath);
    console.log("Previous build.zip removed successfully.");
  } catch (err) {
    console.error("Error removing existing build.zip:", err);
    process.exit(1);
  }
}

// Double-check if the output path is now clear
if (fs.existsSync(outPath)) {
  console.error("build.zip still exists after deletion, aborting...");
  process.exit(1);
}

// Try zipping the build directory
try {
  console.log("Starting to zip...");
  zip.zipSync(inPath, outPath);
  console.log("Zipping completed successfully!");
} catch (error) {
  console.error("Error during zipping:", error);
}
