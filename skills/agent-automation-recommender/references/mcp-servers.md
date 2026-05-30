# MCP Server Recommendations

MCP (Model Context Protocol) servers extend the agent's capabilities by connecting to external tools and services. MCP is an open standard supported by most modern AI coding agents.

**Note**: These are common MCP servers. Use web search to find MCP servers specific to the codebase's services and integrations.

## Setup & Team Sharing

**Configuration methods** (tool-dependent):
- Project-level config file (e.g., `.mcp.json`)
- Tool-specific config (e.g., `opencode.json`, `claude.json`)
- Global user config

**Tip**: Check the config file into git so your whole team gets the same MCP servers.

## Documentation & Knowledge

### context7
**Best for**: Projects using popular libraries/SDKs where you want the agent to code with up-to-date documentation

| Recommend When | Examples |
|----------------|----------|
| Using React, Vue, Angular | Frontend frameworks |
| Using Express, FastAPI, Django | Backend frameworks |
| Using Prisma, Drizzle | ORMs |
| Using Stripe, Twilio, SendGrid | Third-party APIs |
| Using AWS SDK, Google Cloud | Cloud SDKs |
| Using LangChain, OpenAI SDK | AI/ML libraries |

**Value**: The agent fetches live documentation instead of relying on training data, reducing hallucinated APIs and outdated patterns.

---

## Browser & Frontend

### Playwright MCP
**Best for**: Frontend projects needing browser automation, testing, or screenshots

| Recommend When | Examples |
|----------------|----------|
| React/Vue/Angular app | UI component testing |
| E2E tests needed | User flow validation |
| Visual regression testing | Screenshot comparisons |
| Debugging UI issues | See what user sees |
| Form testing | Multi-step workflows |

**Value**: The agent can interact with your running app, take screenshots, fill forms, and verify UI behavior.

### Puppeteer MCP
**Best for**: Headless browser automation, web scraping

| Recommend When | Examples |
|----------------|----------|
| PDF generation from HTML | Report generation |
| Web scraping tasks | Data extraction |
| Headless testing | CI environments |

---

## Databases

### Supabase MCP
**Best for**: Projects using Supabase for backend/database

| Recommend When | Examples |
|----------------|----------|
| Supabase project detected | `@supabase/supabase-js` in deps |
| Auth + database needs | User management apps |
| Real-time features | Live data sync |

**Value**: The agent can query tables, manage auth, and interact with Supabase storage directly.

### Convex MCP
**Best for**: Projects using Convex as the backend

| Recommend When | Examples |
|----------------|----------|
| Convex project detected | `convex` in deps, `convex/` directory present |
| Real-time / reactive UI | `useQuery` / `useMutation` from `convex/react` |
| AI / chat / agent features | `@convex-dev/agent` in deps |

**Value**: The agent can introspect the live deployment (tables, function specs, env vars, logs) and execute queries/mutations against it.

### PostgreSQL MCP
**Best for**: Direct PostgreSQL database access

| Recommend When | Examples |
|----------------|----------|
| Raw PostgreSQL usage | No ORM layer |
| Database migrations | Schema management |
| Data analysis tasks | Complex queries |

### Neon MCP
**Best for**: Neon serverless Postgres users

### Turso MCP
**Best for**: Turso/libSQL edge database users

---

## Version Control & DevOps

### GitHub MCP
**Best for**: GitHub-hosted repositories needing issue/PR integration

| Recommend When | Examples |
|----------------|----------|
| GitHub repository | `.git` with GitHub remote |
| Issue-driven development | Reference issues in commits |
| PR workflows | Review, merge operations |
| GitHub Actions | CI/CD pipeline access |

**Value**: The agent can create issues, review PRs, check workflow runs, and manage releases.

### GitLab MCP
**Best for**: GitLab-hosted repositories

### Linear MCP
**Best for**: Teams using Linear for issue tracking

| Recommend When | Examples |
|----------------|----------|
| Linear workspace | Issue references like `ABC-123` |
| Sprint planning | Backlog management |

---

## Cloud Infrastructure

### AWS MCP
**Best for**: AWS infrastructure management

| Recommend When | Examples |
|----------------|----------|
| AWS SDK in dependencies | `@aws-sdk/*` packages |
| Infrastructure as code | Terraform, CDK, SAM |

### Cloudflare MCP
**Best for**: Cloudflare Workers, Pages, R2, D1

### Vercel MCP
**Best for**: Vercel deployment and configuration

---

## Monitoring & Observability

### Sentry MCP
**Best for**: Error tracking and debugging

| Recommend When | Examples |
|----------------|----------|
| Sentry configured | `@sentry/*` in deps |
| Production debugging | Investigate errors |

**Value**: The agent can investigate Sentry issues, find root causes, and suggest fixes.

### Datadog MCP
**Best for**: APM, logs, and metrics

---

## Communication

### Slack MCP
**Best for**: Slack workspace integration

| Recommend When | Examples |
|----------------|----------|
| Team uses Slack | Send notifications |
| Incident response | Post updates |

### Notion MCP
**Best for**: Notion workspace for documentation

| Recommend When | Examples |
|----------------|----------|
| Notion for docs | Read/update pages |
| Knowledge base | Search documentation |

---

## File & Data

### Filesystem MCP
**Best for**: Enhanced file operations beyond built-in tools

### Memory MCP
**Best for**: Persistent memory across sessions

| Recommend When | Examples |
|----------------|----------|
| Long-running projects | Remember context |
| Learning patterns | Build knowledge |

---

## Containers & DevOps

### Docker MCP
**Best for**: Container management

| Recommend When | Examples |
|----------------|----------|
| Docker Compose file | Container orchestration |
| Dockerfile present | Build images |

### Kubernetes MCP
**Best for**: Kubernetes cluster management

---

## AI & ML

### Exa MCP
**Best for**: Web search and research

---

## Quick Reference: Detection Patterns

| Look For | Suggests MCP Server |
|----------|-------------------|
| Popular npm packages | context7 |
| React/Vue/Next.js | Playwright MCP |
| `@supabase/supabase-js` | Supabase MCP |
| `convex` in deps or `convex/` directory | Convex MCP |
| `pg` or `postgres` | PostgreSQL MCP |
| GitHub remote | GitHub MCP |
| `@aws-sdk/*` | AWS MCP |
| `@sentry/*` | Sentry MCP |
| `docker-compose.yml` | Docker MCP |
