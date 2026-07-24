# Multiplatform Idle Clicker Boilerplate

Generic English cross-platform idle/clicker boilerplate with **Phaser 4**, **Vite**, **Decimal.js**, **Tauri 2** (Windows / macOS / Linux), and **Capacitor 8** (Android / iOS).

All player-facing copy, docs, and placeholder brand names are **English and generic** — replace them when you rebrand.

Repo: [JacksonJohnny/multiplatform-idle-clicker-boilerplate](https://github.com/JacksonJohnny/multiplatform-idle-clicker-boilerplate)

Base resolution: desktop `1280×720` landscape (resizes to the window); mobile `540×960` portrait. Detection is automatic (`?ui=mobile|desktop` to force).
Placeholder ids: Tauri `com.example.idleclicker.desktop` · Capacitor `com.example.idleclicker`.

Short fork/rebrand guide: [`BOILERPLATE.md`](BOILERPLATE.md).

## Stack

| Layer | Tech |
| --- | --- |
| Game runtime | Phaser `^4.2.1` |
| Bundler | Vite `^8.1.4` |
| Big numbers | decimal.js `^10.6.0` |
| Desktop | Tauri `2` (OS WebView — light for background idle / Steam) |
| Mobile | Capacitor `^8.4.2` (Android / iOS) |
| Tests | Vitest `^4.1.10` |

The game in `src/` is plain web. The shells only wrap `dist/`.

## Features

- Decimal.js economy with exponential costs and Cookie Clicker–style formatting.
- Manual click + 20 chained idle generators + Auto Tap (orbiting cursors).
- **UPGRADE** tab: generic meta-upgrades; list sorted by **ascending price**.
- **STORE** tab: buy **×1 / ×10 / ×25 / MAX**; progressive catalog with `???`.
- Idle via **wall clock** + offline earnings (optional cap; default **uncapped**).
- Achievements with permanent idle % bonuses.
- Prestige → **Ascension Tokens** with **red** confirm and **5s** countdown.
- Tabs: UPGRADE → STORE → TAP → STATUS → PRESTIGE (+ settings); ←/→ keys (desktop) and swipe.
- Versioned save (`SAVE_VERSION = 10`) with migrations and checksum.
- Web + desktop (Tauri) + mobile (Capacitor) builds.

## Naming glossary (important for forks)

| Concept | Code / UI | Persistence |
| --- | --- | --- |
| Meta-upgrades (UPGRADE tab) | Catalog `META_UPGRADES`, UI `meta*` | Legacy field **`boosts`** — do not rename without a migration |
| Ascension Tokens | `ascensionTokens`, purple badge | `ascensionTokens` (ex-`stars` in v8) |
| Yellow ★ on STORE | Efficiency pips | Derived from efficiency purchases in `boosts` |

**Rule:** rename UI/scene freely; keep the save field `boosts` stable.

## Requirements

- Node.js 20+
- **Desktop:** [Rust](https://rustup.rs/) + (Windows) MSVC Build Tools / WebView2; (macOS) Xcode CLT; (Linux) [Tauri deps](https://v2.tauri.app/start/prerequisites/)
- **Android:** Android Studio
- **iOS:** macOS + Xcode

## Development

```bash
npm install
npm run dev          # browser (Vite)
npm run tauri:dev    # desktop Tauri
```

Validation:

```bash
npm test
npm run build
```

| Script | Purpose |
| --- | --- |
| `npm run dev` | Vite server |
| `npm run build` / `preview` | Web build and preview |
| `npm run tauri:dev` / `tauri:build` | Desktop (dev / installers) |
| `npm run android` / `ios` | Build + Capacitor sync + open IDE |
| `npm run cap:doctor` | Capacitor environment check |
| `npm test` / `lint` / `format` | Tests and style |

## Structure

```text
src/                   Phaser game (economy, UI, save) — shared
src-tauri/             Tauri 2 shell (desktop)
capacitor.config.json  Capacitor (mobile; android/ios folders after cap add)
```

## Configuration

```js
// src/config/gameConfig.js
GAME_CONFIG = desktop 1280×720 (RESIZE) · mobile 540×960 (FIT) — picked via isMobileUi()
LOOP_CONFIG = {
  autoSaveDelayMs: 10000,
  maxOfflineSeconds: null, // null = no offline earnings cap
}
SAVE_KEY = 'clicker-phaser-save-v1' // NEVER rename — use SAVE_VERSION + migrations
SAVE_VERSION = 10
```

Optional env (`.env.example`): `VITE_SAVE_KEY`.  
Desktop identifier: `src-tauri/tauri.conf.json`. Mobile `appId`: `capacitor.config.json`.

Lock native Android/iOS apps to **portrait** (matches `540×960`). Desktop / Steam stay landscape.

## Save and migrations

**Status: shippable.** Old saves migrate up to `SAVE_VERSION = 10`. Pipeline and history live in [`saveMigrations.js`](src/services/saveMigrations.js).

Autosave every 10s + flush on blur / `pagehide` / `beforeunload`. Reset: `?resetSave=1`.

## Customization

1. Look — `src/config/theme.js`
2. Copy (English placeholders) — `src/config/uiText.js`
3. Resolution / loops / save — `src/config/gameConfig.js`
4. Catalogs — `src/data/`
5. Desktop — `src-tauri/tauri.conf.json`
6. Mobile — `capacitor.config.json` (+ Android Studio / Xcode)

Then: `npm test` && `npm run build`.

## Desktop / Steam

```bash
npm run tauri:dev
npm run tauri:build   # artifacts under src-tauri/target/release/bundle/
```

Steam Partner checklist (no Steamworks SDK in this base): create an App + Win/Mac/Linux depots, upload via SteamPipe. Steamworks (achievements / cloud) = phase 2.

## Android / iOS

Capacitor packages (`@capacitor/core`, platform) are installed when you add a platform — they are not pre-bundled.

```bash
# first time
npm run build && npm run cap:add:android
npm run android

# iOS (macOS)
npm run build && npm run cap:add:ios
npm run ios
```

`npm run cap:doctor` checks the native environment.

## Web deploy

```bash
npm run build
npm run preview
```

## License

ISC. See [LICENSE](LICENSE).
