module.exports = {
  branches: ["master"],
  tagFormat: "firefox-v${version}",
  plugins: [
    "@semantic-release/commit-analyzer",
    "@semantic-release/release-notes-generator",
    [
      "@semantic-release/exec",
      {
        prepareCmd:
          "node scripts/set-extension-version.cjs ${nextRelease.version} && INLINE_RUNTIME_CHUNK=false npx craco build && zip -r source.zip src manifest public package.json package-lock.json craco.config.ts tsconfig.json vite.config.ts README.md",
        publishCmd:
          'npx web-ext sign --source-dir build --artifacts-dir web-ext-artifacts --channel listed --upload-source-code source.zip --api-key "$AMO_JWT_ISSUER" --api-secret "$AMO_JWT_SECRET"',
      },
    ],
    [
      "@semantic-release/github",
      {
        successComment: false,
        failComment: false,
        assets: [
          {
            path: "web-ext-artifacts/*.xpi",
            label: "Firefox signed extension",
          },
          {
            path: "source.zip",
            label: "AMO source archive",
          },
        ],
      },
    ],
  ],
};
