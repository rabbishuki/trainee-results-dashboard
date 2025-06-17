import type { Config } from 'jest';

const config: Config = {
  preset: "jest-preset-angular",
  setupFilesAfterEnv: ["<rootDir>/src/testing/init-zoneless-test-environment.ts"],
};

export default config;
