// Runs only the generated empty leak-repro files (see scripts/generate-leak-repro.mjs).
// Use with a low heap cap to surface the per-file Metro-graph OOM quickly, e.g.:
//   NODE_OPTIONS="--max-old-space-size=2048" \
//     jest -c jest.harness.leak.config.mjs --selectProjects react-native-harness --runInBand
export default {
  preset: 'react-native-harness',
  testMatch: ['<rootDir>/**/__tests__/leak-repro/**/*.harness.[jt]s?(x)'],
  setupFiles: ['./src/setupFile.ts'],
  setupFilesAfterEnv: ['./src/setupFileAfterEnv.ts'],
  transformIgnorePatterns: ['/packages/', '/node_modules/'],
};
