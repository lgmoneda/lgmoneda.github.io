# Em busca das referências perdidas

An illustrated reading notebook for Marcel Proust's *Em busca do tempo perdido*.

## Preview and editing

From the repository root:

```sh
python3 -m http.server 8765 --bind 127.0.0.1
```

Open `http://127.0.0.1:8765/em-busca-do-tempo-perdido/`.

- `test.html` is the editable HTML content fragment, retaining the original fragment/export workflow.
- Run `python3 em-busca-do-tempo-perdido/sync-content.py` after editing it to update the standalone `index.html`. The standalone page includes all content without requiring JavaScript or a fetch.
- `experiment.html` previews the fragment through a fetch. Use the local HTTP server for this page; on loading failure it links to the complete standalone page.
- `proust.css` and `proust.js` are shared by both versions. The index navigation in both HTML shells should be updated when adding a chapter.
- Original PNGs are retained in `../images/em-busca-do-tempo-perdido/`. The page serves smaller WebP derivatives, and the painting links to its original.

## Review of the original prototype — 2026-09-26

### Resolved

- The main page omitted the lantern reference from the experiment; both now include it, its painting, the excerpt, a footnote and source notes.
- The fixed header was overridden by `position: relative`, then hidden by JavaScript. Replaced with a sticky header and a native disclosure index that works with touch, keyboard and without JavaScript. Escape returns focus to the index control.
- The experiment's navigation pointed at missing content and queried sections before its fetch completed. Its content now initializes after loading, including incoming fragment links; HTTP failures have a visible fallback.
- The introduction had overlapping fixed portrait art, excessive top space and repeated titles. The portrait now belongs to the introduction, with responsive typography and a visible reading route.
- Forced scroll snapping, hover-only header recovery and large minimum heights impeded reading. Scrolling is native; chapter imagery and text have independent, content-appropriate heights.
- Fixed-width images, narrow percentage text columns, justified text and viewport-based ornaments were unsuitable for small screens. Text, painting and navigation now reflow at narrow widths; decorations stay behind the margins.
- Decoration creation was not invoked on the main page and could duplicate on the experiment. Replaced the generated animated decoration trees with lightweight CSS artwork.
- Repeated scroll timers, debug logging and individual ornament selectors were removed. Theme updates use a single animation-frame callback and actual chapter positions, including on resize.
- Night colors previously left captions/notes with hard-coded dark foregrounds. Foreground, background, links, borders and notes now use a coherent palette; color changes occur together. Reduced motion disables smooth scrolling.
- Headings, language declarations, image descriptions, skip navigation and visible keyboard focus are now explicit. Navigation is in Portuguese; retained English draft text is marked `lang="en"`.
- Test captions, fake footnotes and empty sections were replaced with meaningful source notes. Unverified draft passages are explicitly labeled.
- Large images now have WebP display versions and lazy loading below the introduction. The painting required color-preserving conversion via a JPEG intermediate; direct PNG-to-WebP conversion produced incorrect colors and was rejected during visual review.
- The existing remote landscape photos now have local copies, avoiding blank chapter images when the external host fails. No external font request is required.

### Editorial work still needed

This is a visual and functional revision of the existing prototype, not a completed reference catalogue. The English passages remain draft material from the original page; their wording and attribution have not been authenticated. The selected Portuguese excerpt is preserved from the original fragment, but its page and translation credit still need confirmation against the stated Globo 2012 edition. The painting's title, artist and source were absent from the original files and remain unidentified. The three stock landscapes illustrate the prototype; they are not documentation of Proust's locations.

The branch's initial commit preserves all original project files and PNGs before this review.

### Verification

- Viewed the original desktop page and the revised desktop introduction, lantern entry, landscape chapter and source notes in a browser.
- Checked the revised layout at 390px and 320px using browser iframe viewports, including the narrow menu and lantern entry.
- Exercised chapter navigation, menu closing after selection, Escape dismissal, and the experiment's direct `#lanterna` link.
- Inspected the final dark palette and corrected the painting's color conversion by comparison with the original.
- Validated HTML tag nesting, duplicate IDs, internal anchors, local file/image references, fragment parity and JavaScript syntax. Ran `git diff --check` for the scoped changes.
- These checks do not constitute validation on physical mobile devices or a literary source audit.

## Existing landscape sources

These URLs came from the original prototype. The local WebP copies retain the same photos:

| Local file | Original source |
| --- | --- |
| `meseglise-landscape.webp` | https://images.unsplash.com/photo-1506744038136-46273834b3fb |
| `swann-landscape.webp` | https://images.unsplash.com/photo-1500534623283-312aade485b7 |
| `time-landscape.webp` | https://images.unsplash.com/photo-1503264116251-35a269479413 |
