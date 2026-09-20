# Density

## The formula

```
density     = (occurrences x keyword_length) / total_words
occurrences = total_words x target_density / keyword_length
```

- `keyword_length` counts **real words as 1** and **function words as 0.5**.
  `PDF to Word` → 1 + 0.5 + 1 = **2.5**. `horario de clases` → 1 + 0.5 + 1 = **2.5**.
- `target_density` defaults to **2%**; **1%–3%** is a reasonable band.
- Function words = prepositions, articles, conjunctions — the words that carry no topic. `de`, `to`, `a`, `the`, `and`, `y`, `o`. The list is per language and lives in the script (overridable).

Worked examples, 1,000 words:

| Keyword | length | occurrences at 2% |
|---|---|---|
| `schedules` | 1 | 20 |
| `class schedule` | 2 | 10 |
| `PDF to Word` | 2.5 | 8 |
| `horario de clases` | 2.5 | 8 |

Why not the plain "occurrences / words" formula? It punishes long-tail keywords. `PDF to Word` counted as one unit at 2% would demand 20 mentions of the whole phrase in 1,000 words, which reads like spam and is impossible to do naturally. Weighting by length is what makes a multi-word keyword and a single-word keyword comparable.

## The numbers are a target, not a cage

The band exists to catch two failures — a page nobody can tell is about the keyword, and a page that reads like it was written by a metronome. It is not a score to optimize. **The prose wins ties.** If the natural sentence needs the phrase and you are at the top of the band, keep the sentence and cut a weaker mention elsewhere.

## What counts as the page

The denominator is the **visible copy a reader and a crawler actually get**: H1, intro, section headings, paragraphs, bullets, FAQ, HowTo.

- Exclude meta fields (title tag, meta description) — they are not page copy.
- Exclude fields that are rendered only on the client after hydration, if the site pre-renders its pages: whatever is not in the pre-rendered output is not what a first crawl sees. Check the built artifact rather than assuming.
- Exclude navigation, footer and boilerplate **for the page-level number**, but be aware they exist: a whole-document count will differ from a copy-only count. Decide which number you are quoting and keep it consistent across pages.

## Slices: the small-sample trap

Report at least two slices — the body, and the question/answer blocks — plus the whole page. But **a slice under ~300 words cannot support a density verdict**: one hit in 40 words is "6%" and means nothing. For small slices, check the **occurrence count** (is the keyword present at all, is it spread out) and skip the per-1000 math. The script enforces this with `--min-sample`.

## Anti-stuffing checks that the numbers cannot make

- Not every heading needs the keyword. Hit it in the H1 and in a minority of section headings; forcing it into all of them is the most common tell.
- No single section should be saturated. If one section holds half the mentions, redistribute.
- Variants matter. If the exact phrase appears 8 times, related natural phrasing ("el horario", "tu semana", "las clases") should appear at least as often. This one is checked by reading, not by script.
- Read the page aloud. If a sentence exists only to carry the keyword, delete the sentence.

## Running the script

```bash
# budget before writing
node scripts/density.mjs --keyword "PDF to Word" --words 1000
node scripts/density.mjs --keyword "horario de clases" --lang es --words 1000

# acceptance after drafting (slices, HTML or markdown or plain text)
node scripts/density.mjs --keyword "horario de clases" --lang es \
  --text "page=dist/es/templates/example-page.html"
node scripts/density.mjs --keyword "horario de clases" --lang es \
  --text "body=body.txt" --text "faq=faq.txt" --json
```

Output: words, hits, density, suggested hit count with its band, and a verdict. `--min-sample N` (default 300) raises or lowers the small-sample threshold; `--function-words "a,the"` replaces the language preset; `--lang` ships `en` and `es` today (add a list for a new language rather than fighting the preset).

Report the numbers verbatim when asking for approval. "Density looks fine" is not a report; `987 words, 9 hits, 2.29%, band 4–12` is.
