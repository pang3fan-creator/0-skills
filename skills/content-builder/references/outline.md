# The outline

The outline is the deliverable the user approves before any body copy exists. It has to be readable on its own: evidence, plan, budget, acceptance, open questions.

Start from `assets/outline-template.md`.

## Sections that must be there

1. **Header** — target keyword (with its computed length), page type, URL/slug, language, reader, what "done" looks like.
2. **SERP evidence** — captured from `references/serp-research.md`: how and when, the top results and their types, features present, the intent conclusion.
   Keep the evidence **in the same file** as the plan. Reviewers need to check the plan against the evidence without jumping between documents.
3. **Competitive gap** — specifically, what this page offers that the ranking pages do not. If there is no gap, the page should not exist; say so.
4. **Structure table** — one row per section: id, heading (written out **in the target language**, not summarized), what it covers, word budget, keyword hits. The budgets must add up to the target word count, and the hits must add up to the keyword budget.
5. **Title family** — H1, meta title, meta description, each with its length and a note on which one carries the keyword.
6. **Keyword plan** — the total hit count from the formula, and where each hit lands (H1, which headings, body, FAQ, HowTo). State the slices you will measure.
7. **Links** — outbound links with their anchor text and target, plus where the page's own inlinks will come from.
8. **FAQ / HowTo** — when the page type calls for them; write the questions out.
9. **Structured data** — what the page will emit.
10. **Acceptance criteria** — split into **machine-checkable** (numbers, containment checks, link targets, build/test commands) and **human judgement** (does it read naturally, is the claim verifiable). Do not blur the two.
11. **Implementation checklist** — every file to touch and every registry to update, read from the project profile.
12. **Open questions** — each one phrased so it can be answered with a decision.

## Rules that keep outlines honest

- **Write headings in the page's language.** A Chinese or English placeholder that will be "translated later" is how translation-flavored content is born.
- **Every section earns its place.** If you cannot say what a section does for this reader, cut it. Filler sections are the most common reason a page reads like it was written to hit a length.
- **Budget the keyword before writing**, not after. If the plan says 9 hits across 1,000 words, the draft has a target instead of a guess.
- **Do not resolve open questions silently.** An unanswered question becomes a defect that is expensive to fix after the copy exists.
- **Say what you would need to change** in the plan if an assumption breaks (e.g. "if the site's existing pages run 900–1,100 words, this budget is at the bottom of that range").
- **Reuse the site's own formats.** If existing pages use a fixed section shape, mirror it: consistency helps readers and makes the acceptance checks reusable.

## Handling a conflict with existing pages

If the keyword is already claimed, or the new page would overlap a neighbouring page (two pages on adjacent topics), write the boundary explicitly in the outline: *this page owns X, that page owns Y, and the internal links between them use different anchor text*. Adjacent pages that describe the same thing confuse search engines and readers; a stated boundary is how you avoid it.
