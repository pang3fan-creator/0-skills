# Gotchas: Next.js → TanStack Start MDX ports

Five traps, each of which has cost a real debug cycle. Every one showed up while
porting real Next.js pages into this project. Read the relevant entry when its
symptom appears — and read #1, #4, #5 *before* wiring loaders and shiki, because
those fail at build/SSR time, not in an obvious place.

---

## 1. Route loader must not return the MDX component (seroval error)

**Symptom**

```
Serialization error: Seroval Error (specific: 1)
  value: [Function: MDXContent]
```

Thrown at SSR time, often surfaced as an `<AwaitInner>` error boundary message.

**Why**

TanStack Start serializes a route `loader`'s return value (seroval) to ship it
from server to client for hydration. An MDX page is a **React component (a
function)** — not serializable. Returning it from the loader blows up.

**Fix**

Keep the component out of the loader. Return only serializable data (strings,
plain objects) for `head`/meta + an existence check, and resolve the MDX
component **in the route component** from the `import.meta.glob` registry (which
is present on both server and client):

```tsx
export const Route = createFileRoute('/changelog')({
  loader: () => {
    const page = getPage('/changelog')
    if (!page) throw notFound()
    return { title: page.title, description: page.description } // serializable only
  },
  component: () => {
    const page = getPage('/changelog')! // Content resolved here, not via loader
    return <Page {...page} />
  },
})
```

---

## 2. Portaled UI escapes a scoped token wrapper

**Symptom**: a modal/overlay rendered via `createPortal(…, document.body)` shows
up transparent / unstyled — background and custom-token colors gone — even
though the same classes work inline on the page.

**Why**: scoped design tokens (e.g. `.docs-root { --sl-color-*: … }`) only apply
to descendants of the wrapper. `createPortal` to `document.body` renders the
content **outside** that wrapper, so `bg-sl-nav`, `--…-overlay`, etc. resolve to
nothing.

**Fix**: wrap the portal content in the scope class itself. Dark-mode still works
because the `.dark` class sits on `<html>`, an ancestor of the portal:

```tsx
createPortal(
  <div className="docs-root fixed inset-0 …" style={{ background: 'var(--…-overlay)' }}>
    …
  </div>,
  document.body,
)
```

(Not needed once tokens are unified to the app's global shadcn tokens, since
those live on `:root`/`.dark` and are always in scope.)

## 3. Full page reload → state flash (e.g. ⌘ ↔ Ctrl)

**Symptom**: a value derived on the client (platform key hint, etc.) briefly
flashes a wrong/default value on every navigation between the ported pages.

**Why**: internal links rendered as raw `<a href>` cause **full document
reloads**, not SPA navigation. Each reload re-runs SSR (which can't detect the
client) → renders the default → the client effect corrects it → visible flash.
A module-level cache does NOT survive a full reload, so caching won't help.

**Fix**: don't render a guessed value pre-hydration. Start state as `null` and
render the value only after client detection, so the wrong value is never shown:

```tsx
const [metaKey, setMetaKey] = useState<string | null>(null)
useEffect(() => { setMetaKey(isMac() ? '⌘' : 'Ctrl') }, [])
// render the hint only when metaKey !== null
```

Deeper fix (optional): convert internal links to `AppLink` so navigation is SPA
and no reload happens at all.

## 4. `styleToJs is not a function` when adding shiki

**Symptom**: after adding `@shikijs/rehype`, `pnpm build` fails:

```
[plugin @mdx-js/rollup] … content/…/*.mdx
Error: Could not parse `style` attribute on `span`
  TypeError: styleToJs is not a function
```

**Why**: shiki emits inline `style="color:…"` on `<span>`s. MDX's HTML→JSX step
(`hast-util-to-estree`) parses those with the `style-to-js` package. A stale
transitive `style-to-js@1.0.0` gets locked in and is incompatible with the
newer `hast-util-to-estree` under rolldown-vite. (The `@mdx-js/mdx` version is a
red herring — both versions use the same `hast-util-to-estree`.)

**Fix**: force `style-to-js` to a current release. On pnpm 11 the override goes
in **`pnpm-workspace.yaml`** — `package.json` `pnpm.overrides` is NOT read:

```yaml
# pnpm-workspace.yaml
overrides:
  style-to-js: ^1.1.16
```

Then `pnpm install`. Verify with `ls node_modules/.pnpm | grep style-to-js`.

Also: `@shikijs/rehype`'s plugin type doesn't match `@mdx-js/rollup`'s
`rehypePlugins` type — cast the tuple `as never` in `vite.config.ts` to satisfy
`tsc` (cosmetic only).

## 5. Shiki code block has no visible container background

**Symptom**: code blocks look like bare text pasted on the page background — the
gray "container" look is gone. In dark mode the tokens may also render with
light-theme colors.

**Why**: with dual themes, `@shikijs/rehype` sets an **inline**
`style="background-color:#fff"` (light theme) on `<pre class="shiki">` — white,
so it's invisible on a white page — and only provides `--shiki-dark*` CSS
variables for dark mode, which nothing activates by default.

**Fix**: force a themed container background (inline style needs `!important`)
and activate the dark token colors. Scope to `.prose .shiki` so it only touches
rendered MDX:

```css
.prose .shiki {
  background-color: var(--muted) !important;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 1rem;
  overflow-x: auto;
}
.dark .prose .shiki,
.dark .prose .shiki span {
  color: var(--shiki-dark) !important;
}
```

Using `--muted`/`--border` keeps the code block consistent with the app palette
in both themes.
