# Hooks Recommendations

Hooks automatically run commands in response to agent tool events. They're ideal for enforcement and automation that should happen consistently.

**Note**: These are common patterns. Use web search to find hooks for tools/frameworks not listed here to recommend the best hooks for the user.

---

## Concept

Hooks let you define automatic actions triggered by events. Common event types:

| Event Type | When It Triggers |
|------------|------------------|
| **PreToolUse** | Before a tool runs (useful for protection/blocking) |
| **PostToolUse** | After a tool runs (useful for formatting, linting, testing) |
| **Notification** | When the agent sends a notification (permission prompts, idle) |

**Common actions**: Run a command, play a sound, send a notification, format a file.

---

## Auto-Formatting Hooks

### Prettier (JavaScript/TypeScript)
| Detection | File Exists |
|-----------|-------------|
| `.prettierrc`, `.prettierrc.json`, `prettier.config.js` | ✓ |

**Recommend**: Auto-format on file edit
**Value**: Code stays formatted without thinking about it

### ESLint (JavaScript/TypeScript)
| Detection | File Exists |
|-----------|-------------|
| `.eslintrc`, `.eslintrc.json`, `eslint.config.js` | ✓ |

**Recommend**: Auto-fix lint errors on edit
**Value**: Lint errors fixed automatically

### Black/isort (Python)
| Detection | File Exists |
|-----------|-------------|
| `pyproject.toml` with black/isort, `.black`, `setup.cfg` | ✓ |

**Recommend**: Auto-format Python files on edit
**Value**: Consistent Python formatting

### Ruff (Python - Modern)
| Detection | File Exists |
|-----------|-------------|
| `ruff.toml`, `pyproject.toml` with `[tool.ruff]` | ✓ |

**Recommend**: Auto lint + format on edit
**Value**: Fast, comprehensive Python linting

### gofmt (Go)
| Detection | File Exists |
|-----------|-------------|
| `go.mod` | ✓ |

**Recommend**: Run gofmt on edit
**Value**: Standard Go formatting

### rustfmt (Rust)
| Detection | File Exists |
|-----------|-------------|
| `Cargo.toml` | ✓ |

**Recommend**: Run rustfmt on edit
**Value**: Standard Rust formatting

---

## Type Checking Hooks

### TypeScript
| Detection | File Exists |
|-----------|-------------|
| `tsconfig.json` | ✓ |

**Recommend**: Run type check on edit
**Value**: Catch type errors immediately

### mypy/pyright (Python)
| Detection | File Exists |
|-----------|-------------|
| `mypy.ini`, `pyrightconfig.json`, pyproject.toml with mypy | ✓ |

**Recommend**: Run type check on edit
**Value**: Catch type errors in Python

---

## Protection Hooks

### Block Sensitive File Edits
| Detection | Presence Of |
|-----------|-------------|
| `.env`, `.env.local`, `.env.production` | Environment files |
| `credentials.json`, `secrets.yaml` | Secret files |
| `.git/` directory | Git internals |

**Recommend**: Block edits to these paths (PreToolUse)
**Value**: Prevent accidental secret exposure or git corruption

### Block Lock File Edits
| Detection | Presence Of |
|-----------|-------------|
| `package-lock.json`, `yarn.lock`, `pnpm-lock.yaml` | JS lock files |
| `Cargo.lock`, `poetry.lock`, `Pipfile.lock` | Other lock files |

**Recommend**: Block direct edits to lock files
**Value**: Lock files should only change via package manager

---

## Test Runner Hooks

### Jest (JavaScript/TypeScript)
| Detection | Presence Of |
|-----------|-------------|
| `jest.config.js`, `jest` in package.json | Jest configured |
| `__tests__/`, `*.test.ts`, `*.spec.ts` | Test files exist |

**Recommend**: Run related tests after edit
**Value**: Immediate test feedback on changes

### pytest (Python)
| Detection | Presence Of |
|-----------|-------------|
| `pytest.ini`, `pyproject.toml` with pytest | pytest configured |
| `tests/`, `test_*.py` | Test files exist |

**Recommend**: Run pytest on changed files after edit
**Value**: Immediate test feedback

---

## Quick Reference: Detection → Recommendation

| If You See | Recommend This Hook |
|------------|-------------------|
| Prettier config | Auto-format on edit |
| ESLint config | Auto-lint on edit |
| Ruff/Black config | Auto-format Python |
| tsconfig.json | Type-check on edit |
| Test directory | Run related tests on edit |
| .env files | Block .env edits |
| Lock files | Block lock file edits |
| Go project | gofmt on edit |
| Rust project | rustfmt on edit |

---

## Notification Hooks

Notification hooks can alert you to agent events like permission requests or idle state.

| Matcher | Triggers When |
|---------|---------------|
| `permission_prompt` | Agent requests permission for a tool |
| `idle_prompt` | Agent waiting for input (60+ seconds) |

**Recommend**: Play sound or show desktop notification
**Value**: Never miss permission prompts when multitasking; know when the agent needs your input
