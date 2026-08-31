# Context: eval-4 (wrong-canonical)

**Target production URL:** https://example.com/tools/keyword-extractor

This is a single-language (English) tool page. hreflang does not apply.

**HTTP status:** HTTP 200, no redirects. No X-Robots-Tag header.

**Important:** the canonical `<link rel="canonical">` in page.html points to a
DIFFERENT URL than the target — it points to
https://example.com/tools/keyword-analyzer (a similar but distinct tool page).
This is a bug that would cause Google to treat the wrong URL as canonical.

**Sitemap:** includes the target URL. The tools listing page links to it via a
regular `<a href>`.
