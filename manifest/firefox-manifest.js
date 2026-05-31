const fs = require("fs");
const path = require("path");

// Define the source and destination paths
const source = path.join(__dirname, "manifest.firefox.json");
const destination = path.join(__dirname, "../public/manifest.json");

// Copy the file
fs.copyFile(source, destination, (err) => {
  if (err) {
    console.error("Error: Failed to copy the file.", err);
  } else {
    console.log("File copied successfully.");
  }
});
