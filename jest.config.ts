import type { Config } from "@jest/types";

const config: Config.InitialOptions = {
  preset: "ts-jest",
  verbose: true,
  testEnvironment: "node",
  moduleFileExtensions: ["ts", "tsx", "js"],
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest"
  },
  testMatch: ["**/src/**/?(*.)+(spec|test).[jt]s?(x)"],
  moduleNameMapper: {
    "^csv-stringify/sync":
      "<rootDir>/node_modules/csv-stringify/dist/cjs/sync.cjs",
    "^csv-parse/sync": "<rootDir>/node_modules/csv-parse/dist/cjs/sync.cjs"
  }
};

export default config;
