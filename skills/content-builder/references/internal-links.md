# Internal links

Links are content, not plumbing. Three rules are non-negotiable; the rest is judgement.

## 1. Same language as the page

A page must link to pages in its **own language**, resolved correctly. On localized sites this is where the classic bug lives: a hardcoded root (`/`) inside a shared header, breadcrumb, footer or call-to-action. On every translated page it quietly sends readers — and the page's accumulated internal link equity — back to the default-language version of the site.

Checklist:

- Header logo, footer logo, breadcrumb "home", navigation items, call-to-action buttons, and **in-body links**.
- Do not just inspect the code: **read the rendered output of a localized page** and look for links pointing at the un-localized root. It is invisible in a source diff of the page you are writing, because the bug lives in a shared component.
- Watch the two failure directions: a link that should be localized but is not, and a path that is already localized and gets prefixed twice.

## 2. The new page must not be an orphan

Find its inlinks **before** publishing and name them in the outline. Two common false assumptions:

- **Navigation menus may not produce crawlable links.** A dropdown rendered only when a menu is open is often absent from the pre-rendered HTML, so it gives crawlers nothing. Verify against the built output, not the component source.
- **A sitemap entry is discovery, not authority.** It gets the URL found; it does not pass internal weight.

The minimum accepted answer is one crawlable inlink from an indexable page. Better: the most relevant hub page (a category, index or parent page) plus the site's own registry/nav surfaces when the site maintains them.

## 3. Outbound links only when the sentence needs them

External links are not decoration and not link-building. If the paragraph works without the link, delete the link. When you do add one:

- Do not trade links, do not add "friendly links" blocks, and do not add badge walls.
- Keep irrelevant external links out of the copy; they dilute the page's topic.
- Follow the site's policy on `nofollow` — most third-party or promotional links should carry it, and the project profile is the source of truth.

## Judgement calls (keep some flexibility)

- Anchor text should be what a reader would search or expect — descriptive beats "click here" — and you should avoid stacking the *exact* same anchor string everywhere. This is a style preference, not a testable rule; use your judgement.
- Prefer links to the closest relatives of the page (the parent hub, the sibling page answering the neighbouring question, the next step in the user's task). Up-and-down links inside the page's own cluster beat random outbound links.
- If two pages are adjacent (easy to confuse), state the boundary in both places and use **different anchor text** for each, so search engines get a clear signal about which page owns which question.

## Reporting

During the third gate, report the link inventory: outbound links with their targets, and the confirmed inlinks. If the page has an inlink only from a listing page, say so plainly — that is a real (if acceptable) weakness, not something to gloss over.
