# Content profile: `<project>`

> Copy this file into the project (a docs folder, or the repo root as `CONTENT.md`) and fill it in once.
> The `content-builder` skill reads it before touching anything, and never invents these answers.
> Keep it short — it is a contract, not documentation.

## 1. Where new pages are defined

How does a new page come into existence? Name the files and the minimum entry needed:

- `<file>` — `<what to add, e.g. "a new object in the templates array plus its slug in the published list">`
- `<file>` — `<e.g. "the translation object for locale X">`
- `<file>` — `<e.g. "the page registry / sitemap / nav list">`

Note anything that fails **silently** when forgotten (missing registrations that produce no error are the expensive ones).

## 2. Page-type templates

What a page of each type must contain, so new pages match existing ones:

| Page type | Required structure | Notes |
|---|---|---|
| e.g. template page | intro + 5 sections + 4 FAQ + 5 HowTo steps | section count and FAQ count are conventions, not laws |
| e.g. article | | |

## 3. Where titles, meta and H1 live

- H1: `<field/file>`
- Meta title: `<field/file, incl. any brand suffix appended automatically>`
- Meta description: `<field/file>`
- Length conventions (measured from existing pages of the same type): `<ranges>`
- Is the H1 field reused by navigation/cards? `<yes/no — if yes, keep it short>`

## 4. Language and routing

- Locales: `<list>`
- Per-locale publishing rules: `<e.g. each page declares the locales it is published in; there is no cross-locale fallback>`
- Slug policy: `<e.g. the slug must belong to the page's language>`
- How URLs are localized in links: `<helper or convention>`
- hreflang policy: `<e.g. only pages that genuinely exist in both languages emit alternates>`
- Which language gets written natively vs translated: `<policy — native writing is the default in the skill>`

## 5. Acceptance commands

```bash
<install/typecheck/lint/test/build commands, in the order the project runs them>
```

Anything to check in the built output rather than the source: `<e.g. "verify the rendered HTML for locale X, not the component">`

## 6. Keyword registry

- Path: `<file>` (created on first use)
- Format: `keyword | page URL | locale | status (live/planned/retired) | primary or secondary`
- Who updates it: the skill appends/updates a row **after** a page ships. Existing rows are never rewritten without asking.

## 7. Site policies the skill must respect

Anything the site treats as fixed. Typical entries:

- Change policy for live pages: `<e.g. "no edits to a live page's title/H1/body during a review window">`
- Claims that may never be made: `<e.g. "no ratings, user counts, or competitor price claims">`
- External-link policy: `<e.g. "nofollow for third-party links; body links only when the sentence needs them">`
- Writing conventions: `<spelling variant, date/time format, register, second person>`
- Structured data per page type: `<which schema, and any fields that are forbidden>`
