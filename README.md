# Multiplatform Idle Clicker Boilerplate

Generic English idle/clicker boilerplate: **Phaser 4** + **Vite** + **Decimal.js**, wrapped by **Tauri 2** (desktop) and **Capacitor 8** (Android / iOS).

Player-facing copy and placeholder brand names are **English and generic** — rebrand when you fork.

Repo: [JacksonJohnny/multiplatform-idle-clicker-boilerplate](https://github.com/JacksonJohnny/multiplatform-idle-clicker-boilerplate)

| Target | Resolution | Layout |
| --- | --- | --- |
| Desktop / web landscape | `1280×720` base (RESIZE) | Cookie Clicker–style columns |
| Mobile | `540×960` portrait (FIT) | Bottom tabs |

Force UI: `?ui=mobile` or `?ui=desktop`.  
Placeholder ids: Tauri `com.example.idleclicker.desktop` · Capacitor `com.example.idleclicker`.

Fork guide: [`BOILERPLATE.md`](BOILERPLATE.md).

## Stack

| Layer | Tech |
| --- | --- |
| Game | Phaser `^4.2.1` |
| Bundler | Vite `^8.1.4` |
| Numbers | decimal.js `^10.6.0` |
| Desktop | Tauri `2` |
| Mobile | Capacitor `^8.4.2` (add platforms when needed) |
| Tests | Vitest `^4.1.10` |

`src/` is plain web. Shells only wrap `dist/`.

## Features

- Decimal.js economy, exponential costs, Cookie Clicker–style formatting.
- Tap + 20 chained generators + Auto Tap (orbiting cursors).
- Meta-upgrades (UPGRADE), store buy amounts ×1 / ×10 / ×25 / MAX, progressive `???` unlocks.
- Wall-clock idle + offline earnings (default uncapped).
- Achievements, prestige → Ascension Tokens (confirm + 5s countdown).
- Versioned save (`SAVE_VERSION = 10`) with migrations + checksum.
- **Desktop:** left TAP · middle UPGRADE / STATUS / PRESTIGE (default UPGRADE) · right STORE always on; row click to buy; hover tooltips.
- **Mobile:** bottom tabs (UPGRADE → STORE → TAP → STATUS → PRESTIGE) + settings gear; swipe / ← →.

## Folder map

```text
src/
  config/       theme, UI text, platform (mobile/desktop), gameConfig, buy amounts
  data/         generators, upgrades, meta-upgrades, achievements
  lib/          math, session controller, prestige, save shape, auto-tap
  services/     save I/O + migrations, settings, feedback, storage adapter
  ui/           Phaser views (store, meta, status, prestige, settings, tooltip…)
  scenes/       ClickerScene + clicker/* helpers (pages, nav, overlays, scroll cams)
  controllers/  ListScrollController
  assets/       hand-cursor.png
src-tauri/      Tauri 2 desktop shell
capacitor.config.json
```

## Naming glossary

| Concept | Code / UI | Persistence |
| --- | --- | --- |
| Meta-upgrades | `META_UPGRADES`, `meta*` | Save field **`boosts`** — do not rename without a migration |
| Ascension Tokens | `ascensionTokens` | `ascensionTokens` |
| Yellow ★ on STORE | Efficiency pips | Derived from efficiency entries in `boosts` |

Rename UI freely; keep `boosts` stable.

## Requirements

- Node.js 20+
- **Desktop:** [Rust](https://rustup.rs/) + platform WebView / build tools ([Tauri prereqs](https://v2.tauri.app/start/prerequisites/))
- **Android:** Android Studio · **iOS:** macOS + Xcode

## Commands

```bash
npm install
npm run dev           # browser
npm run tauri:dev     # desktop
npm test && npm run build
```

| Script | Purpose |
| --- | --- |
| `dev` / `build` / `preview` | Vite |
| `tauri:dev` / `tauri:build` | Desktop |
| `android` / `ios` | Build + Capacitor sync + open IDE |
| `cap:add:android` / `cap:add:ios` | First-time native projects |
| `test` / `lint` / `format` | Quality |

## Configuration

```js
// src/config/gameConfig.js
GAME_CONFIG   // desktop 1280×720 RESIZE · mobile 540×960 FIT (via isMobileUi())
LOOP_CONFIG   // autoSaveDelayMs: 10000, maxOfflineSeconds: null
SAVE_KEY      // 'clicker-phaser-save-v1' — NEVER rename; bump SAVE_VERSION + migrate
SAVE_VERSION  // 10
```

Optional `.env`: `VITE_SAVE_KEY` (see `.env.example`).  
Desktop id/window: `src-tauri/tauri.conf.json`. Mobile `appId`: `capacitor.config.json`.

Lock native mobile apps to **portrait**. Desktop / Steam stay landscape.

## Save

Autosave every 10s + flush on blur / `pagehide` / `beforeunload`. Reset: `?resetSave=1`.  
Migrations: [`src/services/saveMigrations.js`](src/services/saveMigrations.js).

## Customize

1. Look — `src/config/theme.js`
2. Copy — `src/config/uiText.js`
3. Loops / save / resolution — `gameConfig.js`, `platform.js`
4. Catalogs — `src/data/`
5. Desktop — `src-tauri/tauri.conf.json`
6. Mobile — `capacitor.config.json`

Then: `npm test && npm run build`.

## Desktop / Steam

```bash
npm run tauri:build   # src-tauri/target/release/bundle/
```

Steam Partner: App + depots via SteamPipe. Steamworks SDK is out of scope for this base.

## Android / iOS

`@capacitor/core` / platforms install when you `cap add` — not pre-bundled.

```bash
npm run build && npm run cap:add:android && npm run android
# iOS (macOS): cap:add:ios && npm run ios
```

## License

ISC. See [LICENSE](LICENSE).
