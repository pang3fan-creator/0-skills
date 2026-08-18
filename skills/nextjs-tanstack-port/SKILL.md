---
name: nextjs-tanstack-port
description: Migrate a Next.js (App Router) page, template, or MDX/fumadocs content site into this TanStack Start (Vite) project. Use whenever the user wants to port or 迁移 a Next.js page/template into the project, adapt Next.js APIs (next/image, next/link, Metadata, layout.tsx, fumadocs, @next/mdx) to TanStack Start, or stand up MDX content pages with file-based routing. Covers MDX via @mdx-js/rollup + import.meta.glob, root content/ directories, token scoping vs shadcn unification, and the serialization / portal / full-reload / style-to-js / shiki pitfalls that bite every time.
---

# Next.js → TanStack Start page port

Port a Next.js page/template into this TanStack Start (Vite + React 19) project
without dragging Next-only infrastructure along. The goal is usually **100%
visual fidelity first**, then adapt to project conventions.

This project's stack and conventions are the target. Read them before touching
anything, then follow the workflow. The non-obvious traps that cost real time
live in `references/gotchas.md` — read that file **before** wiring MDX, portals,
loaders, or code highlighting, because every one of them has already burned us.

## When this applies

The user drops a Next.js folder (often under `0-Develop_Doc/…`) and says "look
at this / migrate this page". Treat it as a port even if they only say "add this
page". The source is usually a single page or a small content site (docs, blog,
changelog).

## Step 1 — Analyze the source (read-only first)

Before proposing anything, understand what you're dealing with:

- **Framework shape**: App Router (`app/page.tsx`, `layout.tsx`)? Server vs
  client components?
- **MDX engine**: `fumadocs-mdx`, `@next/mdx`, or raw? This decides how much
  gets replaced. **fumadocs is Next-only — it does not run on Vite.** Replace it
  with the project's `@mdx-js/rollup` pipeline.
- **Content shape**: YAML `---` frontmatter vs `export const` named exports.
  This changes which remark plugins you need (see Step 3).
- **Styling**: what design tokens does it use? Its own palette (e.g. Starlight
  `--sl-*`) or shadcn-ish oklch tokens (often nearly identical to this project)?
- **Incomplete copies**: hand-copied folders routinely miss files. Grep for
  referenced-but-absent files (e.g. `mdx-components.tsx`, a `Video` component,
  `providerImportSource` targets). Note build artifacts to discard (`.source/`).
- **Next-only pieces to replace** — map each up front:

  | Next.js | This project |
  |---|---|
  | `next/image` | `@/components/app-image` (`AppImage`) |
  | `next/link` | `@/components/app-link` (`AppLink`) |
  | `Metadata` / `metadata.ts` | route `head: () => ({ meta: [...] })` |
  | `app/layout.tsx` | the project root route (don't port it) |
  | `fumadocs-*`, `@next/mdx` | `@mdx-js/rollup` + `import.meta.glob` |
  | `.source/` (fumadocs output) | discard |
  | `opengraph-image.tsx` | static asset + `head` meta if needed |
  | `next-themes` | `@/hooks/use-theme` + `@/components/mode-toggle` |

Report findings plainly, including partial-copy gaps.

## Step 2 — Confirm decisions (don't assume)

Migrations have real forks. Ask before building:

1. **Scope** — one page / whole site / proof-of-concept?
2. **Fidelity** — 100% visual clone first (keep source styling), or unify to
   project style immediately? (When the source already uses shadcn oklch tokens,
   unifying is nearly free; when it uses a foreign palette, clone-then-unify.)
3. **Content** — confirm the project MDX framework (below) is the target and
   content lives at the repo root `content/<feature>/`.
4. **Code highlighting / fonts / prose** — see Step 3; flag added deps.

## Step 3 — Project MDX + content conventions (the target)

This is fixed project infrastructure. Match it exactly.

- **MDX plugin** in `vite.config.ts`: `@mdx-js/rollup` with `enforce: 'pre'`,
  placed **before `viteReact()`** (MDX emits JSX that React's plugin then
  transpiles). Shared across all MDX features.
  - `rehypePlugins: [rehypeSlug, …]` — `rehype-slug` gives headings ids so TOC
    anchors work.
  - **Only if the source MDX uses YAML `---` frontmatter**, add
    `remarkPlugins: [remarkFrontmatter, remarkMdxFrontmatter]` so frontmatter
    becomes an importable `frontmatter` export. MDX authored with
    `export const title = …` needs neither and works out of the box.
  - **Code highlighting**: `@shikijs/rehype` (dual `themes: { light, dark }`).
    Adding it triggers the `style-to-js` and shiki-background traps — read
    `references/gotchas.md` first.
- **Content location**: repo root `content/<feature>/**/*.mdx` (NOT under
  `src/`). Nested folders map to nested routes.
- **Data layer**: `import.meta.glob('/content/<feature>/**/*.mdx', { eager: true })`.
  The registry exists on both server and client, so components can resolve the
  MDX component synchronously — this is what lets you keep it out of the loader
  (see the serialization gotcha).
- **Type declaration**: `src/types/mdx.d.ts` declares `*.mdx` exports (`default`
  component, `frontmatter`, and/or named exports). `tsconfig` only includes
  `src/**`, so the declaration must live under `src/`.
- **prose**: `@tailwindcss/typography` is installed; register it once in
  `src/styles.css` with `@plugin "@tailwindcss/typography";`, then use
  `prose dark:prose-invert` for rendered markdown bodies.

## Step 4 — Feature module layout

Mirror the existing features (`src/features/guides`, `src/features/changelog`):

```
src/features/<name>/
├── <name>-page.tsx          # page component; receives resolved data as props
├── components/              # ported sub-components (flat, no deep nesting)
│   └── mdx-components.tsx    # map custom MDX tags (Video, Accordion, …)
└── data/<name>-data.ts       # import.meta.glob registry + helpers
```

- Reuse project primitives: `cn` from `@/lib/utils`, shadcn components from
  `@/components/ui/*` (accordion, button, …) — don't copy the template's copies.
- Custom MDX tags are passed at render time: `<MDX components={mdxComponents} />`.

## Step 5 — Routing

File-based under `src/routes/`:

- Single page → `src/routes/<name>.tsx`.
- Content collection → `src/routes/<feature>/index.tsx` (list/root) plus a splat
  `src/routes/<feature>/$.tsx` for nested slugs (read `Route.useParams()._splat`,
  build the lookup key, `throw notFound()` when missing).
- After adding/renaming any route file, run `pnpm generate-routes`
  (`routeTree.gen.ts` is auto-generated — never hand-edit).
- **Loaders return serializable data only** — never the MDX component. Resolve
  the component in the route component via the glob registry. (Gotcha #1.)

## Step 6 — Styling: scope or unify

Decide based on the source palette:

- **Foreign palette (100% clone)**: scope every foreign token under a wrapper
  class (e.g. `.docs-root`) in a feature CSS file, so it never pollutes the app.
  Register the utility *names* in `styles.css` `@theme inline` (Tailwind v4 needs
  the token names to generate `bg-x`/`text-x` utilities), but keep the token
  *values* scoped. See `src/features/guides/guides.css` for the pattern.
- **Unify to project**: remap the source's tokens to the project shadcn tokens
  (`--background`, `--primary`, `--border`, `--muted`, `--sidebar*`, …). Because
  the app tokens already flip for light/dark and respond to the theme
  customizer, the ported page inherits all of that for free — and you can delete
  the source's own dark-mode block.
- Portaled UI (modals/overlays via `createPortal`) escapes the scope wrapper —
  wrap the portal content in the scope class too. (Gotcha #2.)

## Step 7 — Verify

- `npx tsc --noEmit` → 0 errors (scope to the feature; note pre-existing errors
  elsewhere are not yours).
- `pnpm build` → must pass (build-time is where MDX/shiki/serialization blow up).
- Dev smoke without a browser: start `pnpm dev`, `curl -sL` each route, assert
  HTTP 200 and grep for expected content (h1/h2, badges, code, video). Scan the
  dev log for `seroval`, `serialization error`, `hydrat`, `error`.
- Then do the visual pass (browser tool, or hand to the user — they may prefer
  to eyeball it themselves).

## Working style

- The user often iterates fast and does visual QA themselves. Keep changes
  surgical, one concern at a time, and verify build/types after each.
- `rm` may be blocked by permissions — move files aside with `mv` to a temp dir
  instead of deleting.
- When you delete a component, clean up what *your* change orphaned (imports,
  now-unused data/types, exclusive sub-components) — but leave shared project
  components (`ModeToggle`, shadcn ui) alone.

## Gotchas — read before wiring MDX/portals/loaders/shiki

`references/gotchas.md` documents the five traps that have each cost a debug
cycle, with the exact symptom and fix: loader serialization (seroval), portal
token scope, full-reload state flash, the `style-to-js` build error, and shiki's
invisible code-block background. Skim it up front; revisit the specific entry
when a symptom appears.
