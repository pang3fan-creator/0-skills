---
name: session-saver
description: |
  Save session summary to docs/sessions/ directory for context recovery in future sessions.
  Use when: (1) User asks to "save session", "save progress", "保存会话",
  (2) Ending a work session with unfinished work,
  (3) User wants to preserve current conversation context,
  (4) Before /exit when there's valuable state to restore.
---

# Session Saver

## Problem
When a session ends, all conversation context is lost. Next session requires re-explaining the project state, decisions made, and what work remains.

## Context / Trigger Conditions
- User explicitly requests: "save session", "save progress", "保存会话", "记录会话"
- Ending a session with uncommitted work or in-progress tasks
- User wants to hand off context to another session or team member
- Before running `/exit` when there's valuable state to preserve

## Solution

The agent should analyze the conversation and generate a detailed session file using the Write tool.

### 1. Analyze the Conversation

Analyze the conversation to extract:
- **Current State**: What's the project status right now?
- **Completed**: What tasks were finished in this session?
- **In Progress**: What tasks are still ongoing?
- **Blockers**: Any problems or pending issues?
- **Key Decisions**: Important technical/design decisions made
- **Code Changes**: Specific files modified and what was changed
- **Notes for Next Session**: What context should be loaded next time?

### 2. Generate Session File

Save to `docs/sessions/YYYY-MM-DD-topic.tmp` using the Write tool.

**Filename format**: `YYYY-MM-DD-topic.tmp`

### Required Content Structure

```markdown
# Session: [Topic Name]
**Date:** YYYY-MM-DD
**Started:** HH:mm
**Last Updated:** HH:mm

---

## Current State
[Project progress description - what is the current state of the project?]

### Completed
- [x] Task 1: [Description of what was completed]
- [x] Task 2: [Description of what was completed]
...

### In Progress
- [ ] Task: [Description of ongoing work]

### Blockers Encountered
1. **Issue**: [Description of any problems encountered]
2. **Problem**: [Any pending issues]

### Key Decisions Made
- **Decision 1**: [Description with reasoning]
- **Decision 2**: [Description with reasoning]
...

### Code Locations Modified
- `path/to/file.ts` - [Specific changes made: what was fixed/added/removed]
- `path/to/another.js` - [Specific changes made]
...

### Technical Details
- **Framework/Libraries**: [e.g., Next.js, Tailwind CSS, date-fns]
- **Algorithms**: [Any algorithm changes or fixes]
- **UI Changes**: [Visual/design changes made]
- **Bug Fixes**: [Specific bugs fixed]

### Notes for Next Session
- Important context for resuming work
- Files to review first
- Pending items to address
- Any unfinished features or improvements

### Context to Load (Files for next session)
- path/to/file1.ts
- path/to/file2.ts
- directory/

## Session Log
- **HH:mm** - [Event or action description]
- **HH:mm** - [Another event or action]
```
### 3. Save the File
Use the Write tool to save the generated content to:
```
docs/sessions/[filename].tmp
```

## Verification
After saving, verify:
1. File was created in the correct location
2. Content includes specific details about changes made
3. All code modifications are documented with file paths and descriptions
4. Key technical decisions are captured
5. Next session context is clear

## Important Guidelines

### What to Include
- Specific bug fixes (before vs after)
- UI/UX changes with component names
- Algorithm or logic changes
- Translation/i18n updates
- Component creation or removal
- Configuration changes

### What NOT to Include
- Generic statements like "fixed a bug"
- Vague descriptions
- Information already in git commits

### Quality Check
Before saving, ensure:
- [ ] Each modified file has a specific description
- [ ] Technical decisions have reasoning explained
- [ ] Bug fixes describe the root cause and solution
- [ ] Next session knows exactly where to pick up

## Notes
- Sessions are stored locally in `docs/sessions/`
- Filenames use format: `YYYY-MM-DD-topic.tmp`
- Previous sessions can be loaded by reading the `.tmp` files
