# AGENTS.md

Agent-agnostic collection of skills, subagents, and commands. This repo is the **source of truth**; installed copies live in `~/.agents/skills/` and in each agent's config directory.

There is no build, test, or lint tooling. Nothing to compile — verification is manual.

## Layout

```
agents/       Global AGENTS.md (see Gotchas — symlinked, do not put repo-specific content here)
commands/     Slash commands for the interface-design skill
docs/         Reference documentation (currently Analytics/analytics-kit.md)
skills/       Skill packages: <name>/SKILL.md + references/ assets/ scripts/ evals/
subagents/    Subagent definitions + 子代理功能介绍.md (roles, when to call, collaboration chain)
hooks/ lsps/ mcps/ plugins/   Empty placeholders
```

## Authoring: skills

`skills/<name>/SKILL.md` with YAML frontmatter:

| Field | Rules |
|---|---|
| `name` | Must equal the directory name; kebab-case |
| `description` | The trigger. Third person, starts with the capability, then "Use when …" with concrete phrasing users would say (include Chinese triggers where relevant, e.g. 收录检查). End with disambiguation: "Do not use for X (that is <other-skill>)." |
| `tools` | Optional CSV allowlist (e.g. `Read, Glob, Grep, Bash, Edit`) |

Body: dense imperative instructions. Keep detail **out** of SKILL.md when it only matters for one step — move it to `references/*.md` and link it relatively (paths resolve against the skill directory, so `references/foo.md`).

Supporting directories:

- `references/` — progressive-disclosure detail, style guides, language variants
- `assets/` — templates to copy (outline, project profile)
- `scripts/` — zero-dependency Node scripts, run directly and fail loudly on bad flags (`node scripts/density.mjs --keyword "PDF to Word" --words 1000`); usage lives in a header comment, there is no `--help`
- `evals/evals.json` — `{ skill_name, evals: [{ id, name?, prompt, expected_output, files[], assertions[] }] }`; fixtures under `evals/files/eval-<id>/`. Validate with `jq . evals/evals.json`.

After adding or renaming a skill, add/update its row in `README.md`.

## Authoring: subagents

`subagents/<kebab-case>.md`. Frontmatter `name` and `description` are required; `description` must say what it does **and** when to use it. Optional display metadata: `model` (`sonnet` | `opus`), `emoji`, `color`, `vibe`. Use `engineering-*`, `design-*`, `testing-*` prefixes for categorized roles. Update `subagents/子代理功能介绍.md` alongside, in Chinese.

## Authoring: commands

`commands/<action>.md`. Frontmatter `name` is namespaced as `<skill>:<action>` and must match the filename (e.g. `interface-design:audit` → `commands/audit.md`). Commands currently all belong to `interface-design`.

## Gotchas

- **`agents/AGENTS.md` is symlinked to `~/.pi/agent/AGENTS.md`.** Editing it changes global agent behavior in every working directory. Keep it generic; repo-specific rules belong in this file.
- Both this file and the symlinked global one load together — do not duplicate their content here.
- Installed skills are **copies**, not symlinks. After editing a skill here, re-sync or the agent keeps running the stale copy: `diff -rq skills/<name> ~/.agents/skills/<name>` (ignore `.DS_Store` noise).
- `hooks/`, `lsps/`, `mcps/`, `plugins/` are empty, so git does not track them — they are absent in a fresh clone.
- `.DS_Store` files are scattered throughout and gitignored; ignore them in diffs and directory listings.
- `*-workspace/` (skill-creator eval runs) is a gitignored process artifact, not a deliverable.
- `README.md` has drifted before — check it after any structural change.
- `docs/Analytics/analytics-kit.md` documents an external npm package; it is not implemented in this repo.

## Workflow

1. Edit skill/subagent/command files in place, matching the existing English style; Chinese is used for role summaries and the Analytics doc.
2. Verify: `jq . <path>/evals.json` parses, the touched script still runs on a real input, and frontmatter matches the tables above.
3. Update `README.md` and `subagents/子代理功能介绍.md` if the inventory changed.
4. Commit and push only with the user's explicit approval.
