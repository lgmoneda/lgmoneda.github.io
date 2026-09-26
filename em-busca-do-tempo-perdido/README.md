# Em busca das referências perdidas

The **Org note is the source of truth** for this illustrated Proust notebook:

- Org-roam ID: `5B137E92-A79C-46BF-9A35-05FAD1D52545`
- Source: `/Users/luis.moneda/Library/CloudStorage/Dropbox/Agenda/roam/20250726200917-em_busca_do_tempo_perdido_referencias.org`
- Existing Emacs command: `M-x lgm/org-roam-export-proust-page`

Edit prose, headings, image links, captions, citations and footnotes in that note. Keep private notes and unpublished chapters tagged `:noexport:`. The note currently exports its introduction and **A lanterna mágica**; the four later draft chapters and the private lantern research are excluded.

## Export and preview

Run the existing command from the Org buffer. Its entry point in `dot-emacs/settings/publishing-settings.el` loads this repository's `export-proust.el`, then calls `lmoneda/export-proust-site`.

The exporter writes all three generated files together:

- `test.html`: the Org content fragment, retaining the original export destination.
- `index.html`: the full standalone page, including content without a JavaScript fetch.
- `experiment.html`: the fragment preview, with a loading state and fallback link.

Navigation is generated from the exported headings. Re-exporting updates both page variants and their menus; there is no separate HTML synchronization command. The exporter uses the current buffer, including unsaved edits, without saving or modifying the Org source. It does not execute Babel, commit or push.

For a local preview, run from the repository root:

```sh
python3 -m http.server 8765 --bind 127.0.0.1
```

Open `http://127.0.0.1:8765/em-busca-do-tempo-perdido/`. The Org note's existing port-4000 link also works when the site is served there through Jekyll.

## Presentation and assets

- `page-template.html` contains the page shell; `proust.css` and `proust.js` provide the shared presentation. Edit these files for layout changes.
- `export-proust.el` derives from Org's HTML exporter. Org handles `:noexport:`, nested content, citations, captions and global footnotes. Citation processors and bibliography settings come from normal Org configuration/source keywords.
- Top-level `ID` or `CUSTOM_ID` supplies the section anchor. `TITLE`, `IMG` and `ALT` remain supported. An `intro` section gets the opening layout. Entries with a figure use the painting layout; image-led entries without a figure use the landscape layout.
- Inline image files are copied from paths relative to the Org file. Existing WebP derivatives are used only when newer than their originals; changed source images fall back to the original until re-optimized.
- Original PNGs and the initial prototype remain preserved in Git. The earlier stock landscape copies remain available for future use, but are not published while their chapters are `:noexport:`.

## Review — 2026-09-26

The first visual pass mistakenly treated the generated fragment as editable content and included chapters excluded by the Org source. This has been corrected: the actual Org note has been exported through the existing Emacs command, and generated content now follows the source.

The retained visual improvements cover responsive typography and image sizing, a sticky keyboard/touch index, normal scrolling, readable palettes, reduced-motion support, lighter image assets, and a working fragment preview. Navigation and lighting now follow the exported sections. The unused animated ornament machinery and repeated scroll timers were removed.

The source still contains a test caption and footnote, and the painting's attribution is not specified. Those source-authored placeholders are preserved; complete them in Org. Page/translation verification and a full reference catalogue remain editorial work.

## Verification

Run the exporter regression tests with an Emacs executable:

```sh
emacs --batch -Q -l em-busca-do-tempo-perdido/tests/export-proust-test.el -f ert-run-tests-batch-and-exit
```

The four tests cover excluded parents/children, generated navigation, global footnotes across sections, local image copying/captions, and duplicate IDs without overwriting the existing page. The renderer was byte-compiled and the live Emacs command was exercised on the real note. The rendered Org output was inspected in the browser.

The preceding visual pass was also checked at desktop, 390px and 320px viewport widths. These are browser viewport checks, not physical mobile device tests or a literary source audit.

## Original prototype landscape sources

| Local file | Original source |
| --- | --- |
| `meseglise-landscape.webp` | https://images.unsplash.com/photo-1506744038136-46273834b3fb |
| `swann-landscape.webp` | https://images.unsplash.com/photo-1500534623283-312aade485b7 |
| `time-landscape.webp` | https://images.unsplash.com/photo-1503264116251-35a269479413 |

## Lantern video

The Org note embeds the lantern study in “A lanterna mágica” through an HTML export block. `proust.js` enhances the native video with the Safari-compatible canvas player; playback starts on request. Without JavaScript, native video controls remain available. Media files live in `media/lanterna-magica-v1/`. Keep the embed and its caption in Org when editing or re-exporting.
