---
name: content-builder
description: Take a keyword and drive it all the way to a published page — SERP research for real intent, an outline the user approves, copy that reads like a human wrote it, then titles, internal links and a computed keyword-density report. Make sure to use this skill whenever the user wants to create new content or a new page, mentions targeting a keyword, asks "what should this page be about", plans a content calendar, asks for a content outline, or just hands over a keyword and says "write something" — including template pages, landing pages, blog posts, comparison pages and legal pages. Do not use it to diagnose or fix existing pages (that is seo-audit), for structured-data-only work (that is schema), or to optimize content for AI answer engines specifically (that is ai-seo).
---

# Content Builder

One keyword in, one published page out. The pipeline is always the same:

**research the SERP → outline → user approves → write → verify → ship → observe.**

What makes it work is not any single step; it is refusing to skip the boring ones. Every rule below exists because skipping it produced a worse page.

## Non-goals

- **Diagnosing existing pages** → `seo-audit`.
- **Structured-data specifics** → `schema`.
- **Getting cited by AI answer engines** → `ai-seo`.
- **Carrying site rules.** This skill is deliberately generic. Everything site-specific (file layout, registration steps, acceptance commands, freeze policies, claims you may not make) comes from the **project profile** — never invent it, always read it.

## The nine essentials

1. **One keyword per page.** Before proposing anything, check what already claims that keyword. Two pages on one keyword fight each other and both lose.
2. **Intent first.** The SERP decides the content type — template gallery, tool, article, comparison, PDF — not what you feel like writing. If the top results are all printable templates, a long methodology essay is the wrong page.
3. **Outline before prose, approved by the user.** Body copy is not written until the outline is approved, and every open question in the outline is answered. This gate is not a formality: it is where the expensive mistakes get caught.
4. **Density is computed, not felt.** A page has a word budget for the keyword, derived from a formula, distributed on purpose, and reported as numbers when the draft is done.
5. **Low AI flavor is a requirement, not a preference** — but *how* you get there depends on the piece. Do not apply a checklist mechanically; adapt to the page, the language and the reader.
6. **Title, meta description and H1 have three different jobs.** They are not three copies of the same sentence, and each has a length the site already lives by.
7. **Internal links are part of the content.** Same language as the page, the new page must not be an orphan, and external links only when the sentence does not work without them.
8. **After publishing, observe.** Indexed → impressions → ranking. **No conclusions about performance before there is data**, and no redesign based on a few days of noise.
9. **Knowledge flows back.** A new convention discovered while doing the work goes into the project profile or the site's content docs, so the next page starts smarter than this one did.

## Phase 0 — find the project profile

Everything site-specific comes from one document. Find it before doing anything else:

1. Look for a content profile / content strategy file in the repo (`CONTENT.md`, `content-profile.md`, `docs/**content*`, `docs/**strategy*`, or whatever the repo's docs folder uses).
2. Read only the sections you need now.
3. If no profile exists, ask the six questions below, then offer to write the profile file so the next run does not have to.

The six fields — nothing more is required:

| Field | Why it matters |
|---|---|
| Where new pages are defined | Files/paths to touch; single source of truth matters more than elegance |
| Page-type template | What a page of this type must contain (sections, FAQ, HowTo, schema) |
| Where titles/meta/H1 live | Often a different file from the body copy |
| Language and routing rules | Which locales exist, how URLs are localized, which slugs belong to which language |
| Acceptance commands | What the project runs to prove nothing broke |
| Registry location | Where the keyword registry lives (see Phase 1) |

If the profile conflicts with this skill, **the profile wins.**

## Phase 1 — research

Dispatch a sub-agent for the SERP capture and competitor reading: it is context-heavy and mostly mechanical. Read `references/serp-research.md` first and hand the sub-agent its method.

Deliverable: the **SERP evidence section** — how it was captured, the top organic results and their types, the SERP features present, and the intent conclusion. Keep raw evidence; later readers (including future you) will want to re-check it.

**Gate 1 — keyword and positioning.** Confirm the target keyword and what kind of page this will be, and check the keyword registry for a conflict. If another page already claims it, stop and ask; never silently re-target.

## Phase 2 — outline (Gate 2)

Read `references/outline.md` and copy `assets/outline-template.md`. Compute the keyword budget with `references/density.md`, then distribute it across sections **before** writing any copy.

Write the outline to a file — a document the user can read, review and quote back at you. Embed the SERP evidence in it rather than keeping them in separate files: reviewing is much easier with the evidence next to the plan.

**Gate 2 — approval.** Ask for it explicitly, and answer every open question in the outline before writing body copy. An unanswered question in the outline becomes a defect in the draft.

## Phase 3 — write

Read, as needed:

- `references/low-ai-flavor.md` — the general patterns.
- `references/languages/<locale>.md` — language-specific traps (load it when writing in that language; if it does not exist, write it afterwards as one of the Knowledge-flows-back items).
- `references/titles.md` — H1 / meta title / description.
- `references/internal-links.md` — links in and out.

Rules that apply to every draft:

- Write in the language of the page, **natively** — never draft in one language and translate. Translation taste is the fastest way to look like every other site.
- Stay inside the outline's word budget and keyword plan. If reality disagrees with the plan, say so and adjust the outline rather than silently drifting.
- Verify claims. If a number, price, limit or capability cannot be checked against the site's own facts, do not state it.

**Before asking for the third gate**, run the acceptance checks and report real numbers (see `references/density.md` for the command): word count, keyword occurrences, density, where the keyword landed, link inventory.

## Phase 4 — verify and ship

- Run the project's acceptance commands from the profile.
- **Verify in the artifact, not in the source.** Read the built/rendered output: text that was never rendered, links that point at the wrong locale, and markdown that leaked as literal text are invisible in a source diff and obvious in the output.
- Verify the links resolve to the right language, the titles are within the site's length convention, and the page is reachable from at least one indexable page.
- Update the keyword registry.

**Gate 3 — publish.** Committing, pushing, deploying and requesting indexing are the user's call. Always ask; never do it because the page "looks done".

## Phase 5 — observe (do not skip, do not rush)

Ask the site owner to request indexing for the new URL, then track the three signals: indexed → impressions → ranking. Judge the page only against pages of its own age and type, and only once the data exists. If it never gets indexed, fix the page; if it gets impressions but no clicks, fix the title and description; if it ranks and gets clicks, leave it alone and write the next page.

## Density, in one line

`occurrences = total_words × target_density ÷ keyword_length`

where `keyword_length` counts real words as 1 and function words (prepositions, articles, conjunctions) as 0.5 — `PDF to Word` is 2.5 — and the default target density is 2% (a 1–3% range is reasonable).

Full method, worked examples, slice rules and the script: `references/density.md`.

## References

| File | Read it when |
|---|---|
| `references/serp-research.md` | Before capturing a SERP, or when delegating it to a sub-agent |
| `references/outline.md` | Phase 2 |
| `references/density.md` | Budgeting the keyword, and before the third gate |
| `references/titles.md` | Writing the title family |
| `references/internal-links.md` | Planning links in and out |
| `references/low-ai-flavor.md` | Before drafting |
| `references/languages/en.md`, `es.md` | Before drafting in that language |
| `scripts/density.mjs` | Acceptance numbers |
| `assets/outline-template.md` | Phase 2 |
| `assets/project-profile-template.md` | When the project has no profile yet |
