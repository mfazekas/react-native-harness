// Runs only the generated leak-repro files under a heap cap. See LEAK_REPRO.md.
export default {
  preset: 'react-native-harness',
  testMatch: ['<rootDir>/**/__tests__/leak-repro/**/*.harness.[jt]s?(x)'],
  setupFiles: ['./src/setupFile.ts'],
  setupFilesAfterEnv: ['./src/setupFileAfterEnv.ts'],
  transformIgnorePatterns: ['/packages/', '/node_modules/'],
};
