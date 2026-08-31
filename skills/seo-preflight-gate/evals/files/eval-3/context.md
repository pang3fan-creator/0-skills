# Context: eval-3 (unexpected-noindex)

**Target production URL:** https://example.com/pricing

This is a single-language (English) pricing page that is meant to be indexed.
The site is English only, so hreflang does not apply.

**HTTP status:** HTTP 200, no redirects.

**Important observation:** in the staging environment the page shows correctly
in a browser, but the raw server HTML (page.html) carries a `<meta name="robots"
content="noindex, nofollow">`. This is unintentional for a production pricing
page. The sitemap does NOT contain the pricing URL, and no internal page links
to it.

**Sitemap:** does not include the pricing URL (this is one of the observed
issues).
