module.exports = {
  resetMocks: true,
  verbose: true,
  browser: false,
  globals: {
    "ts-jest": {
      "tsConfigFile": "tsconfig.json",
    },
  },
  moduleNameMapper: {
    "osh-code-go": "<rootDir>/packages/osh-code-go/src",
    "osh-code-js": "<rootDir>/packages/osh-code-js/src",
    "osh-code": "<rootDir>/packages/osh-code/src",
    "osh-debug": "<rootDir>/packages/osh-debug/src",
    "osh-text": "<rootDir>/packages/osh-text/src",
    "osh": "<rootDir>/packages/osh/src",
  },
  transform: {
    "\\.ts$": "ts-jest",
  },
  testRegex: "/__tests__/.*\\.spec\\.ts$",
  testPathIgnorePatterns: [
    "/node_modules/",
    "/dist/",
    "\\.snap$",
    "/coverage/",
  ],
  moduleFileExtensions: ["ts", "js", "json"],
  coverageReporters: ["text", "json", "lcov", "html"],
  collectCoverageFrom: [
    "packages/**/src/**/*.ts",
    "!**/node_modules/**",
    "!**/__tests__/**",
  ],
  coveragePathIgnorePatterns: ["/__tests__/", "/node_modules/"],
  cacheDirectory: ".jest/cache",
};
