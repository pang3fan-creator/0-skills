# Skills Recommendations

Skills are packaged expertise with workflows, reference materials, and best practices. They let the agent discover and load reusable instructions on demand.

**Note**: These are common patterns. Use web search to find skill ideas specific to the codebase's tools and frameworks.

---

## Concept

Skills typically work the same way across tools:
1. Create a directory or file with a skill name
2. Write instructions for the agent to follow when the skill is loaded
3. The agent loads the skill automatically when relevant, or when invoked by the user

---

## Typical Skill Structure

```
skills/
└── my-skill/
    ├── main-instruction-file   # Instructions (required)
    ├── template.yaml           # Templates to apply
    ├── scripts/                # Helper scripts
    └── examples/               # Reference examples
```

---

## Common Skill Patterns

### API Documentation with OpenAPI Template

```
skills/api-doc/
├── skill-instruction-file
└── openapi-template.yaml
```

**Instructions:**
```
Generate OpenAPI documentation for the endpoint at $ARGUMENTS.

Use the template in [openapi-template.yaml](openapi-template.yaml) as the structure.

1. Read the endpoint code
2. Extract path, method, parameters, request/response schemas
3. Fill in the template with actual values
4. Output the completed YAML
```

**openapi-template.yaml:**
```yaml
paths:
  /{path}:
    {method}:
      summary: ""
      description: ""
      parameters: []
      requestBody:
        content:
          application/json:
            schema: {}
      responses:
        "200":
          description: ""
          content:
            application/json:
              schema: {}
```

---

### Database Migration Generator with Script

```
skills/create-migration/
├── skill-instruction-file
└── scripts/
    └── validate-migration.sh
```

**Instructions:**
```
Create a migration for: $ARGUMENTS

1. Generate migration file in `migrations/` with timestamp prefix
2. Include up and down functions
3. Run validation: `bash scripts/validate-migration.sh`
4. Report any issues found
```

**scripts/validate-migration.sh:**
```bash
#!/bin/bash
npx prisma validate 2>&1 || echo "Validation failed"
```

---

### Test Generator with Examples

```
skills/gen-test/
├── skill-instruction-file
└── examples/
    ├── unit-test.ts
    └── integration-test.ts
```

**Instructions:**
```
Generate tests for: $ARGUMENTS

Reference these examples for the expected patterns:
- Unit tests: [examples/unit-test.ts](examples/unit-test.ts)
- Integration tests: [examples/integration-test.ts](examples/integration-test.ts)

1. Analyze the source file
2. Identify functions/methods to test
3. Generate tests matching project conventions
4. Place in appropriate test directory
```

---

### Component Generator with Template

```
skills/new-component/
├── skill-instruction-file
└── templates/
    ├── component.tsx.template
    ├── component.test.tsx.template
    └── component.stories.tsx.template
```

**Instructions:**
```
Create component: $ARGUMENTS

Use templates in [templates/](templates/) directory:
1. Generate component from component.tsx.template
2. Generate tests from component.test.tsx.template
3. Generate Storybook story from component.stories.tsx.template

Replace {{ComponentName}} with the PascalCase name.
Replace {{component-name}} with the kebab-case name.
```

---

### PR Review with Checklist

```
skills/pr-check/
├── skill-instruction-file
└── checklist.md
```

**Instructions:**
```
## PR Context
- Diff: review current PR diff
- Description: review PR description

Review against [checklist.md](checklist.md).

For each item, mark ✅ or ❌ with explanation.
```

**checklist.md:**
```markdown
## PR Checklist

- [ ] Tests added for new functionality
- [ ] No console.log statements
- [ ] Error handling includes user-facing messages
- [ ] API changes are backwards compatible
- [ ] Database migrations are reversible
```

---

### Release Notes Generator

**Instructions:**
```
Generate release notes from git history:

1. Group commits by type (feat, fix, docs, etc.)
2. Write user-friendly descriptions
3. Highlight breaking changes
4. Format as markdown
```

---

### Project Conventions

Background knowledge the agent applies automatically:

**Instructions:**
```
## Naming Conventions
- React components: PascalCase
- Utilities: camelCase
- Constants: UPPER_SNAKE_CASE
- Files: kebab-case

## Patterns
- Use Result<T, E> for fallible operations, not exceptions
- Prefer composition over inheritance
- All API responses use { data, error, meta } shape

## Forbidden
- No `any` types
- No `console.log` in production code
- No synchronous file I/O
```

---

### Environment Setup

```
skills/setup-dev/
├── skill-instruction-file
└── scripts/
    └── check-prerequisites.sh
```

**Instructions:**
```
Set up development environment:

1. Check prerequisites: `bash scripts/check-prerequisites.sh`
2. Install dependencies: `npm install`
3. Copy environment template: `cp .env.example .env`
4. Set up database: `npm run db:setup`
5. Verify setup: `npm test`

Report any issues encountered.
```

---

## Argument Patterns

| Pattern | Meaning | Example |
|---------|---------|---------|
| `$ARGUMENTS` | All args as string | `/deploy staging` → "staging" |

If the skill uses `$ARGUMENTS` in its content, arguments are substituted directly. Otherwise, they are appended as additional context.

---

## Organizational Tips

- **Team sharing**: Check skill files into the repository so the whole team benefits
- **Project vs global**: Keep project-specific skills in the repo, personal preferences in a user-level config
- **Keep concise**: Focus on genuinely useful info - commands, gotchas, architecture
- **Naming**: Use descriptive names that help the agent decide when to load the skill
