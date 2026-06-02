const fs = require("fs");

const version = process.argv[2];

if (!version) {
  throw new Error("Usage: node scripts/set-extension-version.cjs <version>");
}

const manifestPath = "public/manifest.json";
const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));

manifest.version = version;

fs.writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
