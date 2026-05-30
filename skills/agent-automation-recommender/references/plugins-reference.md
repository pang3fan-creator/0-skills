# Plugin Recommendations

Plugins are installable collections of skills, agents, commands, and other automations packaged together.

**Note**: These are common plugin patterns. Use web search to discover plugins specific to your agent tool and codebase.

---

## Concept

Plugins bundle related automations into a single installable package. They typically contain:

- **Skills** - Packaged workflows and expertise
- **Agents** - Specialized subagent configurations
- **Commands** - Pre-built commands for common tasks
- **Configurations** - Recommended settings and hooks

---

## Installation Methods

Installation varies by tool, but common approaches include:

| Method | Description |
|--------|-------------|
| Package manager | Install via npm, pip, etc. |
| Command | Built-in plugin install command (e.g., `/plugin install`) |
| Directory | Drop a folder into the plugin directory |
| Config | Add to the tool's configuration file |

---

## Common Plugin Categories

### Development & Code Quality

| Plugin Type | Best For |
|-------------|----------|
| Code quality | Automated code review, linting rules |
| Testing | Test generation, coverage reporting |
| Documentation | API docs, README generation |

### Frontend

| Plugin Type | Best For |
|-------------|----------|
| UI components | Creating polished, production-grade interfaces |
| Design systems | Component scaffolding and styling |

### Productivity

| Plugin Type | Best For |
|-------------|----------|
| Git workflows | Commit automation, PR management |
| Session management | Save/restore context across sessions |
| Workflow automation | Repetitive task automation |

---

## Quick Reference: Codebase → Plugin

| Codebase Signal | Plugin Type to Recommend |
|-----------------|------------------------|
| React/Vue/Angular | Frontend / UI plugins |
| Active git workflow | Git workflow plugins |
| Documentation needs | Documentation plugins |
| Code quality focus | Code quality plugins |

---

## When to Recommend Plugins

**Recommend plugin installation when:**
- User needs multiple related capabilities in one package
- Team wants standardized workflows across members
- First-time agent setup - plugins can provide a quick start
- User wants pre-built automations without creating them from scratch
