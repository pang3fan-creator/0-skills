# Low AI flavor

The requirement is "a human would have written this". How you get there depends on the piece, the language and the reader — so treat everything below as **patterns to reach for, not a checklist to satisfy**. A page that mechanically avoids every phrase on a banned list while keeping machine-shaped paragraphs still reads like a machine.

## What makes text read as machine-written

- **Symmetric paragraphs.** Every paragraph opens with a thesis, gives an example, closes with a summary. Real writing is uneven.
- **Tricolons everywhere.** Three-item lists, three-clause sentences, repeated across the page. Once is fine; as a rhythm it is a tell.
- **Scaffolding phrases**: "In conclusion", "It's important to note", "In today's world", "When it comes to", "not only … but also", "delve into", "unlock the power of", "seamlessly", "robust", "elevate". In Spanish: "En resumen", "Es importante destacar", "Cabe mencionar", "En el mundo actual", "sumérgete", "descubre el poder de". Every language has its own set — see `languages/`.
- **Em-dash chains** and identical sentence lengths.
- **Abstraction with no scene.** "Managing schedules can be challenging" vs "changing an elective in October means redoing half the week by hand".
- **Hedged, safe, unopinionated** statements that could apply to anything.
- **Perfect completeness.** Real pages leave some things unsaid because the writer knew the reader would fill them in.

## What pushes text toward human

- **Concrete scenes and real nouns.** One specific situation beats three generalizations.
- **Varied sentence length**, including short sentences. A three-word sentence after two long ones reads like a person.
- **Uneven paragraphs.** Some long, some one line.
- **Second person**, and the site's established register (do not mix formal and informal address in one language — pick the register the site already uses).
- **Admitting limits**: what the product does not do, what costs money, when the tool is the wrong choice. This is the single most effective anti-machine move, and it also builds trust.
- **Opinion with a reason.** "Excel is the wrong tool here, and the reason is merged cells" beats a balanced comparison nobody believes.
- **Verifiable specifics.** Real numbers, real names, real constraints. Numbers you cannot verify are worse than no numbers.
- **A little friction**: a caveat, a "but", a preference. Marketing-polished prose is smooth; human prose has opinions.

## Working method

1. Draft the structure first (the outline already is one), then write each section as if explaining it to one specific person you have in mind.
2. Then read it back and delete the sentences that exist only to connect other sentences.
3. Then check the language file for that language's particular tells.
4. Then, if you can, read it aloud. Anything you would never say out loud gets rewritten.

## What "low AI flavor" does not mean

- It does not mean injecting typos, slang or fake anecdotes.
- It does not mean dumbing down the structure — clear headings and short paragraphs help humans too.
- It does not override accuracy. A natural-sounding unverifiable claim is still a defect.

Language-specific tell lists and register notes: `languages/<locale>.md`. If you write in a language that has no file yet, write one afterwards, from what you actually saw while drafting.
