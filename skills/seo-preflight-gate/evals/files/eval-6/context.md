# Context: eval-6 (noindex-header)

**Target production URL:** https://example.com/backlink-tracker

This is a single-language (English) product page meant to be indexed. hreflang
does not apply.

**Important:** the production response sends the HTTP header:

```
X-Robots-Tag: noindex
```

The `<meta name="robots">` in page.html is `index, follow` (clean), but the
`X-Robots-Tag` HTTP header carries `noindex`. This is the source of the problem —
an HTTP header blocks indexing even when the meta tag is clean.

**Sitemap:** includes the target URL. The homepage links to it via a regular
`<a href>`.
