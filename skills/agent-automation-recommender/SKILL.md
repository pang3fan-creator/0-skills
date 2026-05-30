---
name: agent-automation-recommender
description: Analyze a codebase and recommend agent automations (subagents, skills, hooks, plugins, MCP servers). Use when the user asks for automation recommendations, wants to optimize their agent setup, mentions improving workflows, asks how to set up agent automations, or wants to know what features they should use.
tools: Read, Glob, Grep, Bash
---

# Agent Automation Recommender

Analyze codebase patterns to recommend tailored agent automations across all extensibility options.

**This skill is read-only.** It analyzes the codebase and outputs recommendations. It does NOT create or modify any files. Users implement the recommendations themselves or ask the agent separately to help build them.

## Output Guidelines

- **Recommend 1-2 of each type**: Don't overwhelm - surface the top 1-2 most valuable automations per category
- **If user asks for a specific type**: Focus only on that type and provide more options (3-5 recommendations)
- **Go beyond the reference lists**: The reference files contain common patterns, but use web search to find recommendations specific to the codebase's tools, frameworks, and libraries
- **Tell users they can ask for more**: End by noting they can request more recommendations for any specific category

## Automation Types Overview

| Type | Best For |
|------|----------|
| **Hooks** | Automatic actions on tool events (format on save, lint, block edits) |
| **Subagents** | Specialized reviewers/analyzers that run in parallel |
| **Skills** | Packaged expertise, workflows, and repeatable tasks |
| **Plugins** | Collections of automations that can be installed |
| **MCP Servers** | External tool integrations (databases, APIs, browsers, docs) |

## Workflow

### Phase 1: Codebase Analysis

Gather project context:

```bash
# Detect project type and tools
ls -la package.json pyproject.toml Cargo.toml go.mod pom.xml 2>/dev/null
cat package.json 2>/dev/null | head -50

# Check dependencies for MCP server recommendations (MCP is an open standard)
cat package.json 2>/dev/null | grep -E '"(react|vue|angular|next|express|fastapi|django|prisma|supabase|convex|stripe)"'

# Check for existing agent configuration files
ls -la .opencode/ .claude/ .cursor/ .github/ .agents/ AGENTS.md CLAUDE.md 2>/dev/null

# Analyze project structure
ls -la src/ app/ lib/ tests/ components/ pages/ api/ 2>/dev/null
```

**Key Indicators to Capture:**

| Category | What to Look For | Informs Recommendations For |
|----------|------------------|----------------------------|
| Language/Framework | package.json, pyproject.toml, import patterns | Hooks, MCP servers |
| Frontend stack | React, Vue, Angular, Next.js | Playwright MCP, frontend skills |
| Backend stack | Express, FastAPI, Django | API documentation tools |
| Database | Prisma, Supabase, Convex, raw SQL | Database / backend MCP servers |
| External APIs | Stripe, OpenAI, AWS SDKs | context7 MCP for docs |
| Testing | Jest, pytest, Playwright configs | Testing hooks, subagents |
| CI/CD | GitHub Actions, CircleCI | GitHub MCP server |
| Issue tracking | Linear, Jira references | Issue tracker MCP |
| Docs patterns | OpenAPI, JSDoc, docstrings | Documentation skills |

### Phase 2: Generate Recommendations

Based on analysis, generate recommendations across all categories:

#### A. MCP Server Recommendations

See [references/mcp-servers.md](references/mcp-servers.md) for detailed patterns.

| Codebase Signal | Recommended MCP Server |
|-----------------|------------------------|
| Uses popular libraries (React, Express, etc.) | **context7** - Live documentation lookup |
| Frontend with UI testing needs | **Playwright** - Browser automation/testing |
| Uses Supabase | **Supabase MCP** - Direct database operations |
| Uses Convex | **Convex MCP** - Live deployment introspection |
| PostgreSQL/MySQL database | **Database MCP** - Query and schema tools |
| GitHub repository | **GitHub MCP** - Issues, PRs, actions |
| Uses Linear for issues | **Linear MCP** - Issue management |
| AWS infrastructure | **AWS MCP** - Cloud resource management |
| Slack workspace | **Slack MCP** - Team notifications |
| Memory/context persistence | **Memory MCP** - Cross-session memory |
| Sentry error tracking | **Sentry MCP** - Error investigation |
| Docker containers | **Docker MCP** - Container management |

#### B. Skills Recommendations

See [references/skills-reference.md](references/skills-reference.md) for details.

| Codebase Signal | Skill to Create |
|-----------------|-----------------|
| API routes | **api-doc** (with OpenAPI template) |
| Database project | **create-migration** (with validation script) |
| Test suite | **gen-test** (with example tests) |
| Component library | **new-component** (with templates) |
| PR workflow | **pr-check** (with checklist) |
| Releases | **release-notes** (with git context) |
| Code style | **project-conventions** |
| Onboarding | **setup-dev** (with prereq script) |

#### C. Hooks Recommendations

See [references/hooks-patterns.md](references/hooks-patterns.md) for configurations.

| Codebase Signal | Recommended Hook |
|-----------------|------------------|
| Prettier configured | Auto-format on edit |
| ESLint/Ruff configured | Auto-lint on edit |
| TypeScript project | Type-check on edit |
| Tests directory exists | Run related tests |
| `.env` files present | Block `.env` edits |
| Lock files present | Block lock file edits |

#### D. Subagent Recommendations

See [references/subagent-templates.md](references/subagent-templates.md) for templates.

| Codebase Signal | Recommended Subagent |
|-----------------|---------------------|
| Large codebase (>500 files) | **code-reviewer** - Parallel code review |
| Auth/payments code | **security-reviewer** - Security audits |
| API project | **api-documenter** - OpenAPI generation |
| Performance critical | **performance-analyzer** - Bottleneck detection |
| Frontend heavy | **ui-reviewer** - Accessibility review |
| Needs more tests | **test-writer** - Test generation |

#### E. Plugin Recommendations

See [references/plugins-reference.md](references/plugins-reference.md) for available plugins.

| Codebase Signal | Recommended Plugin |
|-----------------|-------------------|
| General productivity | Core automation bundle |
| Document workflows | Document generation plugins |
| Frontend development | UI development plugins |
| Building tools | Plugin development tools |

### Phase 3: Output Recommendations Report

Format recommendations clearly. **Only include 1-2 recommendations per category** - the most valuable ones for this specific codebase. Skip categories that aren't relevant.

```markdown
## Agent Automation Recommendations

I've analyzed your codebase and identified the top automations for each category. Here are my top 1-2 recommendations per type:

### Codebase Profile
- **Type**: [detected language/runtime]
- **Framework**: [detected framework]
- **Key Libraries**: [relevant libraries detected]

---

### 🔌 MCP Servers

#### [server name]
**Why**: [specific reason based on detected libraries]
**Note**: MCP is an open standard - supported by most modern AI coding tools

---

### 🎯 Skills

#### [skill name]
**Why**: [specific reason]
**Create**: A skill file (SKILL.md) with instructions for the task

---

### ⚡ Hooks

#### [hook name]
**Why**: [specific reason based on detected config]
**Description**: [what the hook should do, e.g., "auto-format on edit"]

---

### 🤖 Subagents

#### [agent name]
**Why**: [specific reason based on codebase patterns]
**Description**: [what the subagent should review or generate]

---

**Want more?** Ask for additional recommendations for any specific category (e.g., "show me more MCP server options" or "what other hooks would help?").

**Want help implementing any of these?** Just ask and I can help you set up any of the recommendations above.
```

## Decision Framework

### When to Recommend MCP Servers
- External service integration needed (databases, APIs)
- Documentation lookup for libraries/SDKs
- Browser automation or testing
- Team tool integration (GitHub, Linear, Slack)
- Cloud infrastructure management

### When to Recommend Skills
- Document generation (docx, xlsx, pptx, pdf)
- Frequently repeated prompts or workflows
- Project-specific tasks with arguments
- Applying templates or scripts to tasks (skills can bundle supporting files)
- Quick actions invoked via skill name
- Workflows that benefit from isolated execution

### When to Recommend Hooks
- Repetitive post-edit actions (formatting, linting)
- Protection rules (block sensitive file edits)
- Validation checks (tests, type checks)

### When to Recommend Subagents
- Specialized expertise needed (security, performance)
- Parallel review workflows
- Background quality checks

### When to Recommend Plugins
- Need multiple related automations
- Want pre-packaged bundles
- Team-wide standardization

---

## Configuration Tips

### MCP Server Setup

MCP (Model Context Protocol) is an open standard. Most modern AI coding agents can use MCP servers.

**Team sharing**: Share an `.mcp.json` file or tool-specific config so the entire team gets the same MCP servers.

**Prerequisites to recommend:**
- GitHub CLI (`gh`) - enables native GitHub operations
- Puppeteer/Playwright CLI - for browser MCP servers

### Headless Mode (for CI/Automation)

Many agents support running in non-interactive mode for automated pipelines:

```bash
# Pre-commit hook example
agent run "fix lint errors in src/"

# CI pipeline
agent run "<prompt>"
```

### Permissions Configuration

Most agents support restricting tool access for safety. Configure permissions based on the specific agent's documentation.
