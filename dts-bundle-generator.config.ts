const config = {
  compilationOptions: {
    preferredConfigPath: './tsconfig.json',
  },
  entries: [
    {
      filePath: "./src/browser.ts",
      outFile: "./dist/browser.d.ts",
      noCheck: false,
    },
    {
      filePath: "./src/server.ts",
      outFile: "./dist/server.d.ts",
      noCheck: false,
    }
  ],
};

module.exports = config;
