# Context: eval-0 (sr-fully-compliant)

**Target production URL:** https://example.com/blog/building-a-backlink-checker

This is an English article page. The site is single-language (English only), so
hreflang does not apply — there are no sibling translations.

**HTTP status:** the production URL returns HTTP 200 from a single request
(no redirects). No X-Robots-Tag header is sent.

**Sitemap:** the site has one sitemap, `sitemap.xml`, which includes this exact
URL. An internal blog listing page links to this article via a regular `<a href>`.

The page is fully server-side rendered. The `<title>`, `<h1>`, and body text are
all present in the raw server HTML that you are given (page.html).
