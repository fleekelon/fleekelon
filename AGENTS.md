# AGENTS.md

## Cursor Cloud specific instructions

As of this writing, this repository (`fleekelon`) is a bare skeleton: it contains
only `README.md` and this file. There is **no application code, no dependency
manifest, no build system, no tests, and no services** yet.

Practical implications for future agents:

- There is nothing to install, build, lint, run, or test until application code
  and a dependency manifest are added.
- The startup update script is intentionally a no-op. Once a real stack is
  introduced (e.g. a `package.json`, `pyproject.toml`, `go.mod`, etc.), update
  the Cloud Agent update script to install those dependencies (for example
  `npm install`, `uv sync`, `pip install -r requirements.txt`).
- When the first service is added, document here how to run it in development
  mode plus any non-obvious startup caveats.
