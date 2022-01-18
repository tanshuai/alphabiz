require('dotenv').config()
module.exports = {
  testMatch: ['<rootDir>/**/*.(spec|test).js'],
  setupFilesAfterEnv: ['./jest.setup.js'],
  // testRunner: 'jest-jasmine2'
  testRunner: 'jest-circus/runner',
  testTimeout: 60000,
  preset: 'ts-jest',
  transform: {
    '^.+\\.(ts|tsx)?$': 'ts-jest',
    "^.+\\.(js|jsx)$": "babel-jest",
  }
}
