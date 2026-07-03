// Generates N empty Harness test files to reproduce the per-test-FILE memory
// leak in the Harness node runner: each test file is fetched from Metro as its
// own bundle entry point, and Metro retains one dependency graph per entry for
// the whole run, so RSS climbs ~one graph per file until the runner OOMs.
//
// The files render only <View/> + cleanup() — no app traffic, no promises — to
// show the leak scales with the number of FILES, not with runtime activity.
//
// Usage: LEAK_FILES=40 node scripts/generate-leak-repro.mjs
import { mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const count = Number(process.env.LEAK_FILES ?? 40);
const dir = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
  'src',
  '__tests__',
  'leak-repro',
);

rmSync(dir, { recursive: true, force: true });
mkdirSync(dir, { recursive: true });

for (let i = 0; i < count; i++) {
  const id = String(i).padStart(3, '0');
  writeFileSync(
    path.join(dir, `leak-${id}.harness.tsx`),
    `import { describe, it, expect, render, cleanup } from 'react-native-harness';
import { View } from 'react-native';

describe('empty leak file ${id}', () => {
  it('renders an empty view #${id}', async () => {
    await render(<View style={{ width: 10, height: 10 }} />);
    expect(true).toBe(true);
    cleanup();
  });
});
`,
  );
}

console.log(`Generated ${count} empty Harness test files in ${dir}`);
