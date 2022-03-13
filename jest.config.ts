import type { Config } from "@jest/types";

const config: Config.InitialOptions = {
  preset: "ts-jest",
  verbose: true,
  testEnvironment: "node",
  moduleFileExtensions: ["ts", "tsx", "js"],
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest",
  },
  testMatch: ["**/src/**/?(*.)+(spec|test).[jt]s?(x)"],
};

export default config;
