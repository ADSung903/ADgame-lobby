# 釣魚物語 — 海洋篇 / 皇帶魚傳說

Entry remains `games/fishing_rod.html`. The unrelated fishing memory game remains unchanged.

## Playable release

- Home screen selects casual or challenge, with 20 casts each. Both share collection progress; personal scores are separate and deliberately do not mix with the old automatic-fishing leaderboard.
- Four depth bands have exclusive pools. A water click chooses the band and hook position; the depth buttons provide a keyboard-accessible alternative. Bait attracts a fish at the hook. This is a simplified encounter system, not simulated hook collision or a fishing simulator.
- Casual reels automatically. Challenge has three rods, three baits, continuous hold/release tension, species struggle patterns, success, line break, slack escape, and a maximum fight duration. Bait changes encounter weights rather than locking species. Rods trade retrieval speed for tension relief. Switching tabs releases the reel and pauses hidden-page gameplay.
- Eight sourced fish entries, original sprite atlas reused everywhere, discovery locks, first date/count/largest size and exact largest-capture metadata. Original 26-species art remains available but only curated entries populate the fish pool. Marine mammals and turtles are decorative visitors. Carp is excluded from ocean encounters. The lure-bearing `angler` image is named deep-sea anglerfish, not lanternfish.
- Gyotaku workshop: sprite-derived silhouette with luminance texture, free brush strokes, six pigments/custom color, brush width, opacity, full-fish base ink, stroke undo, three paper colors, signature/title, red seal, reveal animation.
- Private gallery: independent works of the same species, wall pinning, species filter, full-size PNG export, deletion with confirmation, JSON backup export/import. Import validates fields and merges IDs without duplicate artworks; capture counts merge by maximum to avoid double-counting repeat backups.

## Data and storage

`fishing_tales_v1` stores versioned records, independent art recipes and best scores. No cloud synchronization, accounts or public sharing. Storage failures are visible and gameplay continues in memory; export remains available. Clearing browser storage removes data unless backed up.

The legacy `fishing_ocean_collection` array is copied into the new schema on first load without modifying the original. Overlapping entries unlock print creation; unsupported legacy IDs remain in the legacy field. Missing legacy counts, dates and sizes are not fabricated. `fishing_rod_best2` is not overwritten. A maximum of 500 art recipes, 160 strokes per work and 2,500 points per stroke bounds storage.

Real biological notes and source links live in `games/assets/data/fishing-story-data.js`. Gameplay weights, body sizes, depth bands, lure preferences and rarity are fictional. Common-name groups are marked at genus/order level; art is not a scientific specimen identification. Sources checked on 2026-10-08: Monterey Bay Aquarium, Florida Museum of Natural History and MBARI; per-entry URLs are embedded. No unverified conservation statuses are presented.

Existing generated raster artwork is unchanged. `story-serif.woff` is a character subset of Noto Serif CJK TC Regular from https://github.com/notofonts/noto-cjk, under the adjacent SIL OFL license. It avoids a Google Fonts runtime dependency. User-entered characters outside the subset fall back to system fonts.

## Verification

`tests/fishing-story.cjs` is a Playwright real-browser regression. Serve the repository on port 4173, then run `CHROMIUM_PATH=/path/to/chromium node tests/fishing-story.cjs`. Set `FISHING_BASE_URL` for another local port. In this environment Playwright was provided by `CODEX_PRIMARY_RUNTIME_NODE_MODULES`, Chromium 153 by `@sparticuz/chromium` in a temporary test installation. No test dependencies are shipped with the game.

Passed at 390×844 and 1440×1000: real casual encounter, selected depth, challenge pointer hold/release and deterministic win/break/slack simulation, 20-cast settlement/no extra cast, actual sprite results, free brush input, multiple prints, PNG download, wall pinning, page reload, backup merging and rejection of bad input, legacy migration and blocked storage. Browser page-error log was empty. Internal state acceleration is limited to lifecycle/balance tests; real pointer and download flows are exercised in the browser. Font and layout screenshots were visually inspected. Physical iOS Safari is not tested.

## Next chapters

Freshwater and estuary are announced as future chapters, not clickable fake content. Expand by adding curated biological entries, habitat-specific scenes and matching art; do not silently identify generic old artwork as a precise species. Future work can add richer fish behavior, extended biodiversity and real tackle education after separate research.
