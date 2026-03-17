module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupFiles: ['./tests/setup.ts'],
  testTimeout: 30000,
};