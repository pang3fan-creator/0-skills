# Context: eval-2 (missing-hreflang-pair)

**Target production URL:** https://example.com/blog/what-is-nofollow

This is a bilingual site. The English article has a Chinese sibling at:
https://example.com/zh/blog/what-is-nofollow

**HTTP status:** HTTP 200, no redirects. No X-Robots-Tag header.

**Sitemap:** the English URL appears in sitemap.xml. A blog listing page links to
the English article via a regular `<a href>`.

**Important:** the page's `<head>` in page.html is missing the required
`x-default` hreflang and does not correctly pair the English and Chinese
versions. Inspect the raw server HTML carefully.
