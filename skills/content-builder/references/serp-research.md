# SERP research

The point of this step is not "who ranks" — it is **what the searcher is trying to do**, which decides what kind of page you write. Get this wrong and no amount of good prose saves the page.

## Capture

Use a real browser skill (see the browsing skills available in the session). Practical notes:

- **Headless browsers get blocked.** Search engines serve captchas or unrelated results to headless automation. If that happens, switch to a browser running the user's real profile instead of fighting it.
- **Record how you captured**: engine, query string, `hl`/`gl` (language/region) parameters, and the date. SERPs are personalized and change; a future reader has to be able to judge how much to trust this.
- **Never cite "about N results" as a difficulty signal.** That number is unreliable and personalized. Keyword difficulty belongs to whatever the project uses as its source of truth (a strategy doc, a keyword tool, or the site owner).
- Ask for a decent page of results (10–20) rather than the default 10 — the interesting competitors are often at positions 8–15.

## What to capture per result

For each organic result that plausibly matches the query:

| Field | Why |
|---|---|
| Site and URL | Who owns the query |
| **Page type** — template gallery, generator/tool, long article, comparison, PDF, app store, video, forum | This is the strongest signal about intent |
| H1 / page promise | What the page thinks it is |
| How it satisfies the intent | Can the user *do* the thing, or only read about it? |
| Structure | Sections, question-style headings, FAQ blocks, galleries |
| Word count (visible copy) | Are winners long or short? Usually shorter than the project expects |
| Structured data | What schema the winners emit (or that they emit none) |
| Freshness | Updated recently, or a zombie |

## SERP features worth noting

AI overview, People Also Ask, image pack, video pack, shopping, local pack, sitelinks, "discussions and forums". Each one tells you something:

- **AI overview** → informational, and an LLM is already answering it. Your page needs something the summary cannot copy (a working tool, exact numbers, first-hand detail).
- **PAA** → the exact questions your page should answer (and the source of FAQ items).
- **Galleries/templates everywhere** → the searcher wants a usable artifact, not theory. Ship the artifact.
- **A PDF or an app ranking on page one** → the competition is weak, and the intent is "give me the file".

## Read the intent, in writing

Finish with an explicit paragraph: *what does someone typing this keyword want to do, and what is the shortest path to letting them do it?* Then state what that implies for the page type.

Examples of the kind of conclusion you are looking for:

- "Front page is all template galleries and one printable PDF → the searcher wants a usable, editable schedule, not a methodology article. Ship a template page whose copy explains the artifact."
- "Front page is four long guides plus a forum thread → the searcher is researching. Ship an article, and make sure it answers the PAA questions."

## Delegating it

SERP capture and competitor reading are context-heavy and mostly mechanical — a good sub-agent task. Hand over this file's method, ask for the evidence table and the intent conclusion, and keep the raw notes out of the main context. Do not let a sub-agent draw the final content decision on its own; bring the evidence back and decide with the user.

## Then check for cannibalization

Before locking the keyword: does another page on this site already claim it? Check the site's keyword registry (see the project profile) and, when in doubt, search the site for the phrase in titles and H1s. Two pages on one keyword compete with each other. If a conflict exists, stop and ask — do not silently re-target, and do not "share" the keyword across two pages.
