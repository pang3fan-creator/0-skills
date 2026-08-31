---
name: seo-preflight-gate
description: Pre-flight SEO gate that checks whether a page is discoverable, crawlable, and understandable by Google BEFORE it ships. Use whenever a new or updated page is about to go live — landing pages, tool pages, articles, bilingual/multilingual content — and someone wants to confirm it won't launch with a missing H1, broken canonical, accidental noindex, missing hreflang, absence from the sitemap, or zero internal links pointing at it. Triggers on phrases like "before we publish check the SEO", "is this page going to be indexed", "run the release gate", "收录检查", "上线前 SEO 检查", "can Google find this URL", "check the preview server HTML", "why isn't my new page showing up in Search Console". Go noisy whenever a page is about to leave staging.
---

# SEO Pre-flight Gate

Before a page ships, run it through the gate. The goal is narrow and specific:
**confirm Google can discover, crawl, and understand the page.** This is NOT a
ranking audit, not a content quality audit, and not a keyword recommendation.
Do not wander into those. The gate answers one question: "will this page enter
the index cleanly?" If it won't, say so and say why.

A page can build and deploy successfully and still ship with SEO that doesn't
survive first contact with a crawler. Title and H1 rendered only on the client,
a missing hreflang pair, a stray noindex, a URL not in the sitemap, or a page
with no internal links in — each of these silently costs you discovery. The gate
catches them before a human ever opens Search Console.

## Inputs

At minimum you need:

- **Environment** — whether you are inspecting the **Preview** (staging/preview)
  response or the **Production** live response. State this explicitly; preview
  and production can carry different robots directives (preview often sets
  `noindex` deliberately — that does not automatically mean production is wrong).
- **Target production URL** — the canonical URL the page will live at.
- **Page server-side HTML** — the HTML the server returns, not what the browser
  renders. If you only have the browser DOM, flag that as a problem in itself:
  client-rendered-only pages can hide content from Googlebot.

Optionally (to fully verify checks 6 and 7):

- **Sitemap content** (`sitemap.xml`) for the site.
- **Site source** or a set of known internal pages, to confirm internal links.

## Verdicts — read this before running checks

Every check returns one of three verdicts:

- **PASS** — verified, no problem.
- **FAIL** — verified problem that blocks indexing/discovery. Requires evidence
  and a fix.
- **N/A** — the check does not apply **OR** cannot be verified with the inputs
  you have. Whenever you use `N/A`, state **which** of the two it is and why:
  - `N/A (does not apply)` — the check genuinely isn't relevant (e.g. a
    single-language page has no hreflang to check).
  - `N/A (cannot verify)` — the check is relevant but the input needed to judge
    it wasn't provided (e.g. no sitemap file, no internal pages to scan, no HTTP
    response available).

**The non-negotiable rule:** you must not treat a missing input as a FAIL. An
absent sitemap file is NOT proof the URL is missing from the sitemap. Only judge
`FAIL` when you actually observed the problem (the tag, header, or absence is in
front of you, or the context explicitly states the thing is missing/faulty).
When in doubt, `N/A (cannot verify)` with a one-line reason — never invent
evidence. Never fabricate a `curl` result, an HTTP status, or a URL that isn't
in the provided inputs.

**Overall verdict — how it combines:**

- The overall **Verdict** is still binary: `PASS` or `FAIL`.
- **PASS only if** every applicable check is `PASS` AND there is **no**
  `N/A (cannot verify)` anywhere. A clean pass means the shipping response was
  fully verified, nothing was left unobserved.
- If any check is `FAIL`, or any required check is `N/A (cannot verify)`, the
  overall verdict is **`FAIL`** — and the Summary must say
  `evidence incomplete / cannot release` and name which inputs were missing.
- **Never** flip a single item from `N/A (cannot verify)` to `FAIL` just to
  make the overall verdict consistent. Keep each check honest, and separately
  report that the evidence is incomplete so the page is not treated as passed.
  An item you couldn't verify is not a proven SEO defect — it's a verification
  gap that blocks a clean release.

## The gate — check each item

Run all seven checks. For each, return a verdict, evidence, and fix (or "none
needed"). `FAIL` entries are what block shipping.

### 1. HTTP status
- **Check:** the target URL resolves to a 200 (or a redirect chain that lands on
  200). Prefer the status explicitly stated in the provided context. Only run a
  real `curl -sI -L` if you have network access to the actual URL — do not
  simulate one. A 404/410/500 means the page doesn't really exist for a crawler.
- **PASS:** 200 (after following redirects), no unexpected redirect.
- **FAIL:** non-200, or an unintended redirect.
- **N/A (cannot verify):** no status or URL provided to inspect, and no network
  access. Note what was missing.

### 2. Canonical
- **Check:** exactly one `<link rel="canonical">` pointing to the target URL.
  Compare URLs leniently: ignore a trailing slash difference, a `#fragment`,
  and host case. Protocol and host must agree; a different **path or query
  string** is a mismatch.
- **PASS:** one self-referencing canonical that matches under the lenient rules.
- **FAIL:** zero canonicals, more than one, or the href points at a different
  path/query than the target.
- **N/A (cannot verify):** no canonical data or no target URL supplied.

### 3. robots / noindex
- **Check:** the page must not carry an unexpected `noindex`. Inspect the
  `<meta name="robots">` and any `X-Robots-Tag` HTTP header.
- **Environment matters:** if you only have Preview HTML and it sets `noindex`,
  that may be intentional for staging. Report "**blocks publishing — confirm
  the production response**" rather than assert the production page is wrong.
  Only judge FAIL if you have confirmed the response that will actually ship
  carries `noindex`.
- **PASS:** no `noindex` in the shipping response.
- **FAIL:** `noindex` present in the confirmed production/preview response that
  will ship. (`nofollow` alone is not `noindex` — note it but don't fail.)
- **N/A (cannot verify):** no HTML or header available to inspect.

### 4. Server-side content (the big one)
- **Check:** the *raw server HTML* must contain exactly one `<title>`, exactly
  one `<h1>`, and meaningful body text — readable to a crawler without
  executing JavaScript.
- **Meaningful body text** means: non-empty text within the main content region
  that is not only script/style, navigation, or a placeholder. A page whose body
  is a single `<div id="app"></div>` filled by JS has **no** server-side body.
- **PASS:** one title, one H1, and real body text in the raw server HTML.
- **FAIL:** missing title, zero or 2+ `<h1>`s, or the body text is absent from
  the server response (present only after client-side render).
- **N/A (cannot verify):** no server HTML supplied.

### 5. hreflang (only if multilingual)
- **Check:** this page must declare all expected language variants plus
  `x-default`. Two things here, verified separately:
  - (a) **Current-page completeness** (verifiable from this page alone): does the
    `<head>` include every expected language and `x-default`?
  - (b) **Reciprocity** (each sibling also links back): **cannot be verified
    from a single page.** If you only have this page's HTML, state
    `N/A (cannot verify)` for reciprocity — do not claim the pair is correct
    based on one side.
- **PASS:** the page declares its full language set + `x-default`.
- **FAIL:** a multilingual page that explicitly has sibling translations is
  missing an expected language or `x-default`, pointing at the wrong URLs, or
  the context states the sibling relationship is broken.
- **N/A:** single-language site (`does not apply`), or sibling HTML not supplied
  such that reciprocity cannot be judged (`cannot verify`).
- **Policy note:** requiring `x-default` is this project's **release policy** for
  clean language fallback — it is not a hard Google requirement. Google asks
  each language version to point at its siblings; `x-default` is recommended but
  optional. If a team decides not to require it, treat a missing `x-default` as a
  warning rather than a FAIL. This skill keeps it as FAIL by policy.

### 6. Sitemap
- **Check:** the target URL appears in the site's sitemap (or one of its
  sitemap indexes). Verify the exact URL, not a variant.
- **PASS:** exact match found.
- **FAIL:** you inspected a sitemap and the URL is genuinely absent, or the
  context explicitly states it is missing.
- **N/A (cannot verify):** no sitemap content provided. Do not mark FAIL just
  because you had nothing to look at.

### 7. Internal inbound links
- **Check:** at least one other page links to the target via a regular,
  server-rendered `<a href>` (not JS-only navigation). This gives Google a crawl
  path and confirms the page is part of the site.
- **PASS:** a real, server-rendered `<a href>` to the target exists on another
  page of the site.
- **FAIL:** you have the site/page set and confirm nothing links to the target;
  or the only links are **client-side-rendered** (JS-only SPA nav) — note this as
  FAIL (weak) because a crawler may not see it, and say why.
- **N/A (cannot verify):** no internal pages or site source provided.

## Output — this exact structure

Produce a report with ALL seven sections in order 1→7, every section containing
a **Verdict**, **Evidence**, and **Fix** line. Use `N/A (does not apply)` or
`N/A (cannot verify)` — never a bare `N/A`. The overall **Verdict** must be
either `PASS` or `FAIL`, nothing else.

```
## SEO Pre-flight Gate: <target URL>

**Environment:** Preview / Production

**Verdict:** PASS | FAIL   (PASS iff every check is PASS and none is N/A (cannot verify); FAIL if any check FAILS or any required check cannot be verified)

### 1. HTTP status
- **Verdict:** PASS | FAIL | N/A (does not apply | cannot verify)
- **Evidence:** <status observed, or what input was missing>
- **Fix:** <specific fix, or "none needed">

### 2. canonical
- **Verdict:** PASS | FAIL | N/A (...)
- **Evidence:** <the actual <link rel="canonical"> href, or what was missing>
- **Fix:** <specific fix, or "none needed">

### 3. robots / noindex
- **Verdict:** PASS | FAIL | N/A (...)
- **Evidence:** <the meta robots tag and/or X-Robots-Tag, or what was missing>
- **Fix:** <specific fix, or "none needed">

### 4. Server-side content
- **Verdict:** PASS | FAIL | N/A (...)
- **Evidence:** <title / <h1> count / whether body text is in the raw HTML>
- **Fix:** <specific fix, or "none needed">

### 5. hreflang
- **Verdict:** PASS | FAIL | N/A (...)
- **Evidence:** <the hreflang set present, or note reciprocity is unverifiable>
- **Fix:** <specific fix, or "none needed">

### 6. Sitemap
- **Verdict:** PASS | FAIL | N/A (...)
- **Evidence:** <the <loc> matched, or note no sitemap was provided>
- **Fix:** <specific fix, or "none needed">

### 7. Internal inbound links
- **Verdict:** PASS | FAIL | N/A (...)
- **Evidence:** <the exact <a href> or note no internal pages were provided>
- **Fix:** <specific fix, or "none needed">

### Summary
- **Blocking issues:** <every FAIL item — these must be fixed before shipping>
- **Evidence status:** complete | incomplete (cannot release) — <list any N/A (cannot verify) items that block a clean PASS>
- **Recommended follow-up:** <re-run the gate after fixes, and any note>
```

Keep evidence concrete — the actual `<link>`, `<meta>`, `<h1>`, status code, or
URL you inspected. "Title looks fine" is not evidence. Paste the real value, or
name exactly which input was missing to reach an `N/A`.

## Working principles

1. **Evidence over opinion.** Every judgment needs the tag/header/URL you looked
   at. No vague "seems OK".
2. **Never fabricate.** If you can't inspect it, say `N/A (cannot verify)` and
   name the missing input. Do not invent a status code, a redirect, or a URL.
3. **Only pre-flight, no ranking talk.** Do not recommend keywords, assess
   content quality, or score the page against competitors. Out of scope.
4. **Client-rendered content is a red flag.** If content or internal links are
   only in the browser DOM, say clearly that a crawler may not see them — this is
   the most common silent failure.
5. **Report the gate result, then stop.** Fixes are the user's call. List
   blocking issues and offer to re-run after they fix.
6. **If a check genuinely doesn't apply, say N/A with one line** explaining why —
   don't skip it silently.
