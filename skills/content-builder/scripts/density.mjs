#!/usr/bin/env node
/**
 * Keyword density for a page, using the long-tail aware formula:
 *
 *   density = (occurrences x keyword_length) / total_words
 *   occurrences = total_words x target_density / keyword_length
 *
 * keyword_length counts real words as 1 and function words
 * (prepositions, articles, conjunctions) as 0.5, so "PDF to Word" is 2.5.
 *
 * Zero dependencies. Usage:
 *
 *   node density.mjs --keyword "PDF to Word" --words 1000
 *   node density.mjs --keyword "horario de clases" --text body=page.html
 *   node density.mjs --keyword "class schedule" --text body=out.html --text faq=faq.txt --json
 *
 * --text accepts a file path, "label=path", or "-" for stdin. Repeatable:
 * each slice is reported on its own line, plus a combined total.
 *
 * Other flags:
 *   --target 0.02            target density (default 2%)
 *   --band 0.01,0.03         acceptable range (default 1%-3%)
 *   --lang en|es             function-word list preset (default en)
 *   --function-words "a,the" override the preset
 *   --words 1000             skip extraction and use this word count
 *   --min-sample 300         below this word count only the raw hit count is
 *                            meaningful, so no verdict is issued
 *   --json                   machine-readable output
 */

import fs from "node:fs";
import path from "node:path";

const FUNCTION_WORDS = {
  en: [
    // articles
    "a", "an", "the",
    // conjunctions
    "and", "or", "but", "nor", "so", "yet", "because", "if", "while",
    // prepositions
    "of", "to", "in", "on", "at", "for", "with", "by", "from", "into",
    "over", "under", "about", "after", "before", "between", "during",
    "without", "against", "through", "per", "as",
  ],
  es: [
    // artículos
    "el", "la", "los", "las", "un", "una", "unos", "unas",
    // conjunciones
    "y", "e", "o", "u", "pero", "sino", "aunque", "porque", "que", "si",
    // preposiciones
    "de", "del", "a", "al", "en", "con", "por", "para", "sin", "sobre",
    "entre", "desde", "hasta", "hacia", "según", "contra", "durante",
  ],
};

const parseArgs = (argv) => {
  const args = { text: [] };
  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    if (!token.startsWith("--")) throw new Error(`Unexpected argument: ${token}`);
    const key = token.slice(2);
    if (key === "json") {
      args.json = true;
      continue;
    }
    const value = argv[i + 1];
    if (value === undefined || value.startsWith("--")) {
      throw new Error(`Missing value for --${key}`);
    }
    i += 1;
    if (key === "text") args.text.push(value);
    else args[key] = value;
  }
  return args;
};

const decodeEntities = (html) =>
  html
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#x27;/gi, "'")
    .replace(/&#x2F;/gi, "/")
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)));

/** Strip markup so we only count text a reader (and a crawler) can see. */
const toVisibleText = (raw) => {
  let text = raw;
  if (/<html|<body|<div|<p\b|<section/i.test(text)) {
    text = text
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<style[\s\S]*?<\/style>/gi, " ")
      .replace(/<noscript[\s\S]*?<\/noscript>/gi, " ")
      .replace(/<!--[\s\S]*?-->/g, " ")
      .replace(/<[^>]+>/g, " ");
  }
  text = text
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`[^`]*`/g, " ")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1");
  return decodeEntities(text).replace(/\s+/g, " ").trim();
};

const countWords = (text) => (text ? text.split(/\s+/).filter(Boolean).length : 0);

const keywordLength = (keyword, functionWords) =>
  keyword
    .trim()
    .split(/\s+/)
    .reduce(
      (total, word) =>
        total + (functionWords.has(word.toLowerCase()) ? 0.5 : 1),
      0,
    );

const countOccurrences = (text, keyword) => {
  const pattern = keyword
    .trim()
    .split(/\s+/)
    .map((word) => word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
    .join("\\s+");
  const regex = new RegExp(`(?<![\\p{L}\\p{N}])${pattern}(?![\\p{L}\\p{N}])`, "giu");
  return (text.match(regex) ?? []).length;
};

const pct = (value) => `${(value * 100).toFixed(2)}%`;

const main = () => {
  const args = parseArgs(process.argv.slice(2));
  if (!args.keyword) throw new Error("--keyword is required");

  const lang = args.lang ?? "en";
  const preset = FUNCTION_WORDS[lang];
  if (!preset) throw new Error(`Unknown --lang "${lang}" (known: ${Object.keys(FUNCTION_WORDS).join(", ")})`);
  const functionWords = new Set(
    args["function-words"]
      ? args["function-words"].split(",").map((w) => w.trim().toLowerCase()).filter(Boolean)
      : preset,
  );

  const target = args.target ? Number(args.target) : 0.02;
  const [bandLow, bandHigh] = args.band
    ? args.band.split(",").map(Number)
    : [0.01, 0.03];
  const minSample = args["min-sample"] ? Number(args["min-sample"]) : 300;
  const length = keywordLength(args.keyword, functionWords);

  const slices = [];
  if (args.text.length === 0) {
    if (!args.words) throw new Error("Pass --words N or at least one --text");
    slices.push({ label: "page", words: Number(args.words), occurrences: null });
  } else {
    for (const entry of args.text) {
      const [label, file] = entry.includes("=")
        ? [entry.slice(0, entry.indexOf("=")), entry.slice(entry.indexOf("=") + 1)]
        : [path.basename(entry), entry];
      const raw = file === "-" ? fs.readFileSync(0, "utf-8") : fs.readFileSync(file, "utf-8");
      const text = toVisibleText(raw);
      slices.push({
        label,
        words: countWords(text),
        occurrences: countOccurrences(text, args.keyword),
      });
    }
  }

  const suggest = (words) => Math.round((words * target) / length);
  const bounds = (words) => {
    const low = Math.max(1, Math.ceil((words * bandLow) / length));
    const high = Math.floor((words * bandHigh) / length);
    return [low, high];
  };

  // Density is meaningless on a short slice: two hits in 26 words is not
  // "19% too high", it is simply a small sample. Below the threshold we report
  // the raw count and withhold the verdict on purpose.
  const isSmallSample = (words) => words < minSample;

  const verdictFor = (words, occurrences) => {
    if (occurrences === null) return "n/a";
    if (isSmallSample(words)) return "small sample";
    const density = (occurrences * length) / words;
    if (density < bandLow) return "TOO LOW";
    if (density > bandHigh) return "TOO HIGH";
    return "ok";
  };

  const totalWords = slices.reduce((sum, slice) => sum + slice.words, 0);
  const hasOccurrences = slices.some((slice) => slice.occurrences !== null);
  const totalOccurrences = hasOccurrences
    ? slices.reduce((sum, slice) => sum + (slice.occurrences ?? 0), 0)
    : null;

  if (args.json) {
    process.stdout.write(
      `${JSON.stringify(
        {
          keyword: args.keyword,
          keywordLength: length,
          target,
          band: [bandLow, bandHigh],
          slices: slices.map((slice) => ({
            ...slice,
            density: slice.occurrences === null ? null : (slice.occurrences * length) / slice.words,
            size: isSmallSample(slice.words) ? "small" : "ok",
            suggestedOccurrences: isSmallSample(slice.words) ? null : suggest(slice.words),
            bounds: isSmallSample(slice.words) ? null : bounds(slice.words),
            verdict: verdictFor(slice.words, slice.occurrences),
          })),
          total: {
            words: totalWords,
            occurrences: totalOccurrences,
            density: totalOccurrences === null ? null : (totalOccurrences * length) / totalWords,
            size: isSmallSample(totalWords) ? "small" : "ok",
            suggestedOccurrences: isSmallSample(totalWords) ? null : suggest(totalWords),
            bounds: isSmallSample(totalWords) ? null : bounds(totalWords),
            verdict: verdictFor(totalWords, totalOccurrences),
          },
        },
        null,
        2,
      )}\n`,
    );
    return;
  }

  const lines = [
    `keyword: "${args.keyword}"`,
    `length: ${length} (${args.keyword.trim().split(/\s+/).length} words, function words at 0.5)`,
    `target: ${pct(target)}   band: ${pct(bandLow)}-${pct(bandHigh)}`,
    "",
    "slice                        words   hits   density   target hits   band",
  ];
  for (const slice of slices) {
    const small = isSmallSample(slice.words);
    const [low, high] = bounds(slice.words);
    lines.push(
      [
        `  ${slice.label}`.padEnd(27),
        String(slice.words).padStart(5),
        String(slice.occurrences ?? "-").padStart(6),
        (slice.occurrences === null ? "-" : pct((slice.occurrences * length) / slice.words)).padStart(9),
        (small ? "small sample" : `${suggest(slice.words)} (${low}-${high})`).padStart(13),
        `  ${verdictFor(slice.words, slice.occurrences)}`,
      ].join(""),
    );
  }
  if (slices.length > 1) {
    const small = isSmallSample(totalWords);
    const [low, high] = bounds(totalWords);
    lines.push(
      [
        "  TOTAL".padEnd(27),
        String(totalWords).padStart(5),
        String(totalOccurrences ?? "-").padStart(6),
        (totalOccurrences === null ? "-" : pct((totalOccurrences * length) / totalWords)).padStart(9),
        (small ? "small sample" : `${suggest(totalWords)} (${low}-${high})`).padStart(13),
        `  ${verdictFor(totalWords, totalOccurrences)}`,
      ].join(""),
    );
  }
  lines.push("", "Aim for the target; treat the band as the guardrail, and let the prose win ties.");
  process.stdout.write(`${lines.join("\n")}\n`);
};

try {
  main();
} catch (error) {
  process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
  process.exit(1);
}
