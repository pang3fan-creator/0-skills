# Subagent Recommendations

Subagents are specialized agent instances that can run in parallel, each with their own context and tool access. They're ideal for focused reviews, analysis, or generation tasks that benefit from dedicated attention.

**Note**: These are common patterns. Design custom subagents based on the codebase's specific review and analysis needs.

---

## Concept

Subagents allow the primary agent to delegate work to specialized helpers. Common characteristics:

- **Parallel execution** - Can run alongside the main conversation
- **Focused scope** - Each subagent has a specific purpose
- **Custom tool access** - Can be restricted to read-only or given full access
- **Different model** - Can use a different (cheaper/faster/smarter) model

---

## Subagent Types

### Code Review Agents

#### code-reviewer
**Best for**: Automated code quality checks on large codebases

| Recommend When | Detection |
|----------------|-----------|
| Large codebase (>500 files) | File count |
| Frequent code changes | Active development |
| Team wants consistent review | Quality focus |

**Suggested instructions:**
```
You are a code reviewer. Focus on:
- Code quality and best practices
- Potential bugs and edge cases
- Performance implications
- Security considerations

Provide constructive feedback without making direct changes.
```

**Tool access**: Read-only (review only, no edits)

---

#### security-reviewer
**Best for**: Security-focused code review

| Recommend When | Detection |
|----------------|-----------|
| Auth code present | `auth/`, `login`, `session` patterns |
| Payment processing | `stripe`, `payment`, `billing` patterns |
| User data handling | `user`, `profile`, `pii` patterns |
| API keys in code | Environment variable patterns |

**Suggested instructions:**
```
You are a security expert. Focus on identifying potential security issues.
Look for:
- Input validation vulnerabilities
- Authentication and authorization flaws
- Data exposure risks
- Dependency vulnerabilities
- Configuration security issues
```

**Tool access**: Read-only

---

#### test-writer
**Best for**: Generating comprehensive test coverage

| Recommend When | Detection |
|----------------|-----------|
| Low test coverage | Few test files vs source files |
| Test suite exists | `tests/`, `__tests__/` present |
| Testing framework configured | jest, pytest, vitest in deps |

**Suggested instructions:**
```
You are a test writer. Generate tests that match the project's conventions.
Focus on:
- Unit tests for individual functions and components
- Integration tests for API endpoints and data flow
- Edge cases and error conditions
- Meaningful assertions and test descriptions
```

**Tool access**: Read + Write (to create test files)

---

### Specialized Agents

#### api-documenter
**Best for**: API documentation generation

| Recommend When | Detection |
|----------------|-----------|
| REST endpoints | Express routes, FastAPI paths |
| GraphQL schema | `.graphql` files |
| OpenAPI exists | `openapi.yaml`, `swagger.json` |
| Undocumented APIs | Routes without docs |

**Suggested instructions:**
```
You are an API documentation specialist. Generate comprehensive OpenAPI specs.
Focus on:
- Accurate endpoint descriptions
- Complete request/response schemas
- Authentication requirements
- Error response documentation
```

**Tool access**: Read + Write

---

#### performance-analyzer
**Best for**: Finding performance bottlenecks

| Recommend When | Detection |
|----------------|-----------|
| Database queries | ORM usage, raw SQL |
| High-traffic code | API endpoints, hot paths |
| Complex algorithms | Nested loops, recursion |

**Suggested instructions:**
```
You are a performance analyst. Find bottlenecks and suggest optimizations.
Look for:
- N+1 queries and inefficient database access
- O(n²) algorithms and unnecessary complexity
- Memory leaks and resource management issues
- Caching opportunities and lazy loading
```

**Tool access**: Read-only

---

#### ui-reviewer
**Best for**: Frontend accessibility and UX review

| Recommend When | Detection |
|----------------|-----------|
| React/Vue/Angular | Frontend framework detected |
| Component library | `components/` directory |
| User-facing UI | Not just API project |

**Suggested instructions:**
```
You are a UI/UX reviewer. Evaluate the frontend for:
- Accessibility (WCAG compliance, ARIA labels, keyboard navigation)
- Responsive design and mobile compatibility
- Visual consistency and design system adherence
- UX patterns and user flow clarity
```

**Tool access**: Read-only

---

## Quick Reference: Detection → Recommendation

| If You See | Recommend Subagent |
|------------|-------------------|
| Large codebase | code-reviewer |
| Auth/payment code | security-reviewer |
| Few tests | test-writer |
| API routes | api-documenter |
| Database heavy | performance-analyzer |
| Frontend components | ui-reviewer |

---

## Model Selection Guide

When recommending subagents, suggest model tiers based on the task complexity:

| Tier | Best For | Trade-off |
|------|----------|-----------|
| **Fast** | Simple, repetitive checks | Quick, cost-effective, less thorough |
| **Balanced** | Most review/analysis tasks | Good quality/speed trade-off (default) |
| **Powerful** | Complex migrations, architecture | Most thorough, slower, more expensive |

---

## Tool Access Guide

| Access Level | Use Case |
|--------------|----------|
| Read-only | Reviews, analysis, audits |
| Read + Write | Code generation, docs, tests |
| Full access | Migrations, refactoring, testing |
