# Agent Skills

A collection of agent-agnostic skills, subagents, and commands for AI coding agents (Open Code, CodeX, Claude Code, and compatible tools).

## Skills

| Skill | Description |
|-------|-------------|
| **agent-automation-recommender** | Analyze a codebase and recommend agent automations (subagents, skills, hooks, plugins, MCP servers) |
| **agent-md-improver** | Audit and improve AGENTS.md files across a codebase |
| **content-builder** | Take a keyword from SERP research to an approved outline, human-sounding copy, titles, internal links, and a computed keyword-density report |
| **interface-design** | Design systems and pixel-level UI for dashboards, apps, and internal tools (not marketing sites) |
| **nextjs-tanstack-port** | Port Next.js (App Router) pages or MDX/fumadocs content into a TanStack Start (Vite) project |
| **prompt-lookup** | Discover, retrieve, and improve prompts via the prompts.chat MCP server |
| **revise-agent-md** | Update AGENTS.md with learnings from the current session |
| **seo-preflight-gate** | Pre-publish SEO gate: H1, canonical, noindex, hreflang, sitemap, internal links |
| **session-saver** | Save session summaries to `docs/sessions/` for context recovery |

## Subagents

| Group | Agents |
|-------|--------|
| **Planning** | `dev-planner`, `product-manager` |
| **Design** | `design-ui-designer`, `design-ux-architect`, `specialized-workflow-architect` |
| **Engineering** | `engineering-backend-architect`, `engineering-frontend-developer`, `engineering-software-architect`, `engineering-security-engineer`, `engineering-devops-automator`, `engineering-sre` |
| **Quality** | `code-reviewer`, `bug-analyzer`, `testing-api-tester` |

See [subagents/子代理功能介绍.md](subagents/子代理功能介绍.md) for responsibilities and a typical collaboration chain.

## Commands

Slash commands for the `interface-design` skill:

| Command | Description |
|---------|-------------|
| **init** | Build UI with craft and consistency, starting from intent |
| **extract** | Extract design patterns from existing code into `.interface-design/system.md` |
| **audit** | Check existing code against the design system for spacing, depth, color, and pattern violations |
| **status** | Show current design system state: direction, tokens, and patterns |

## Docs

| Doc | Description |
|-----|-------------|
| [docs/Analytics/analytics-kit.md](docs/Analytics/analytics-kit.md) | Type-safe analytics client for GSC, GA4, Clarity, Bing Webmaster, Ahrefs, and keyword difficulty |

## Layout

```
agents/       Global AGENTS.md guidelines
commands/     Slash commands
docs/         Reference documentation
skills/       Skill packages (SKILL.md + references/, assets/, scripts/, evals/)
subagents/    Subagent definitions
hooks/        Reserved
lsps/         Reserved
mcps/         Reserved
plugins/      Reserved
```
