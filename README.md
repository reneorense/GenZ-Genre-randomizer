# GEN Z Discovery — 2.0

A complete, responsive music-discovery site with layered vinyl artwork, animated shuffle, genre search, artist discovery links, saved records, recent history, and shareable genre URLs.

## Quick start

1. Extract this ZIP.
2. Install Node.js 20 or newer if it is not already installed.
3. Open a terminal in the `genz-discovery` folder.
4. Run `npm run dev`.
5. Open `http://localhost:5173`.

There are **no third-party dependencies** and no `npm install` step. Use an HTTP server, not a double-clicked `file://` URL: browser JavaScript modules require HTTP.

## Build and publish

- `npm test` runs the logic regression tests.
- `npm run build` regenerates `dist/` from source.
- `npm run preview` serves the built `dist/` folder at port 5173.
- Upload the **contents** of `dist/` to any static website host. Relative asset URLs support subdirectory hosting, including GitHub Pages.
- A ready-to-host `dist/` is already included.
- The local preview server is a development utility, not a production hosting server.

## Project organization

- `index.html`: semantic page shell and accessible native dialogs.
- `src/main.js`: interface coordination and event bindings.
- `src/data/`: original genre catalog, category labels, and visual palettes.
- `src/components/`: procedural SVG artwork and reusable genre cards.
- `src/styles/`: tokens, responsive layout, components, and motion.
- `src/motion/`: shuffle timing, reveal, pointer tilt, and swipe navigation.
- `src/services/`: optional synthesized effects, resilient local storage, sharing.
- `src/state/`: filtering, nonrepeating selection, history, and state validation.
- `public/`: favicon and optional future assets.
- `scripts/`: dependency-free Node development server and static build.
- `tests/`: executable regression tests.

## Features and behavior

- The original archive contains **10 genres**, not 100. Counts derive from real data.
- All 10 original genre records and their 10 artists each are preserved. Descriptions and historical/artist associations are inherited content, not newly fact-checked editorial claims.
- Empty categories are disabled; searches with no matches disable shuffling safely.
- Category and search both constrain shuffle. With multiple matches, the current genre will not immediately repeat.
- Horizontal stage swipes/desktop drags move through matching genres. Vertical touch scrolling remains available. Search and browse buttons provide alternatives to gesture controls.
- Sound is optional and off by default. These are UI tones, not music previews.
- Quick reveal skips the shuffle. The operating system's reduced-motion setting also skips animated shuffle and tilt.
- Save/remove records with the heart. My crate offers saved records and recent discoveries.
- Sharing uses native sharing when supported, otherwise copies a text-and-link fallback. Native sharing and clipboard behavior depend on browser permissions and secure hosting.
- Genre deep links use `#genre=ID`.
- Spotify and YouTube buttons open searches; the site does not stream songs or require music-service credentials.

## Saved-data compatibility

The original keys `genz_favs_v2` and `genz_hist_v2` remain supported. Existing data transfers automatically **only when served from the same browser origin**. A new domain or port has separate browser storage. Corrupt values and removed IDs are sanitized; denied storage leaves the app usable in memory.

## Add genres

Add an object to `src/data/genres.js` following the existing records. Give each genre a unique numeric ID and a category from `categories.js`. Keep artist names as plain strings. Counts update automatically. Run `npm test` and `npm run build` after edits. The Aesthetic filter becomes available when an AESTHETIC entry is added.

## Design and dependencies

The project uses native ES modules, CSS perspective, inline SVG, the Web Audio API, and native dialogs. Vite and external animation libraries were unnecessary for this static application; a small portable build script provides the required build workflow without network installation. No trackers, remote fonts, downloaded repositories, or API keys are included.

See `TESTING.md` for verification and remaining browser-specific limits.
