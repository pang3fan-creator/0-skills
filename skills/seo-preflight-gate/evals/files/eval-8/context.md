# Context: eval-8 (client-only-internal-link)

**Target production URL:** https://example.com/tools/outreach-helper

This is a single-language (English) tool page. hreflang does not apply.

**HTTP status:** HTTP 200, no redirects. No X-Robots-Tag header.

**Important:** the site is an SPA. The internal listing page (index.html) renders
its navigation and tool links entirely with client-side JavaScript — there is NO
server-rendered `<a href>` pointing to `/tools/outreach-helper` in the raw HTML.
The only link to the target exists inside a JS string that runs after hydration.

**Sitemap:** includes the target URL.

Per the skill's check 7 rule, a page that only has a client-side-rendered link
in is FAIL (weak), because a crawler that does not execute JavaScript may not
see that link as a crawl path.
