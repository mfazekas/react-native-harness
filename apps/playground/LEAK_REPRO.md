# Repro: per-test-FILE memory leak → runner OOM

Reproduces the unbounded memory growth that OOMs the Harness node runner
(`FATAL ERROR: Reached heap limit Allocation failed - JavaScript heap out of
memory`) on suites with many test **files**.

## Root cause

Each test file is fetched from Metro as its **own bundle entry point**
(`<file>.bundle`). Metro keeps a full dependency graph in memory per distinct
entry (for delta updates) and only frees it when the server shuts down, so the
run retains **one graph (~tens of MB) per test file** — memory climbs ~linearly
with the file count until the runner OOMs.

It is **per-file**, not per-render / per-bridge-traffic: the repro files below
render only `<View/>` + `cleanup()` (no app work, no promises) and still OOM,
while many `it`s in a *single* file stay bounded.

## Run it

```bash
cd apps/playground

# 1. generate N empty harness test files (default 40)
LEAK_FILES=40 node scripts/generate-leak-repro.mjs

# 2. run just those files under a heap cap, on the iOS runner
NODE_OPTIONS="--max-old-space-size=2048" \
  jest -c jest.harness.leak.config.mjs --selectProjects react-native-harness --harnessRunner ios

# (optional) watch the runner's RSS climb in another terminal:
while true; do ps -axo rss,comm | grep -i '[n]ode' | awk '{print $1/1024"MB"}' | sort -rn | head -1; sleep 3; done
```

## Expected

**Unfixed (`main`):** RSS climbs ~30 MB per file and dies partway through:

```
865 → 975 → 1201 → 1325 → 1438 → 1722 → 1933 → 2038 → 2121 → 2195 → OOM   (40 files)
FATAL ERROR: Reached heap limit Allocation failed - JavaScript heap out of memory
```

**Fixed:** RSS stays roughly flat regardless of file count and the run completes.
Lower the cap (e.g. `--max-old-space-size=1024`) to OOM with fewer files.

This branch is intentionally **fix-free** so it reproduces; the fix is in the
companion PR.
