# Context: eval-1 (client-only-heading)

**Target production URL:** https://example.com/tools/backlink-analyzer

This is a single-language (English) tool page. The site is English only, so
hreflang does not apply. The site uses client-side rendering for its headings.

**HTTP status:** HTTP 200, no redirects. No X-Robots-Tag header.

**Sitemap:** the URL appears in sitemap.xml. A tools listing page links to it via
a regular `<a href>`.

**Important:** the page is a client-rendered SPA. The raw server HTML (page.html)
contains the `<head>` with title but the `<h1>` and body text are rendered
client-side by JavaScript after hydration — they are NOT present in the server
response you are given.
