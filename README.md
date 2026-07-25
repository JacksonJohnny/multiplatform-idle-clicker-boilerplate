# Multiplatform Idle Clicker Boilerplate

Generic English idle/clicker boilerplate: **Phaser 4** + **Vite** + **Decimal.js**, wrapped by **Tauri 2** (desktop) and **Capacitor 8** (Android / iOS).

Player-facing copy and placeholder brand names are **English and generic** — rebrand when you fork.

Repo: [JacksonJohnny/multiplatform-idle-clicker-boilerplate](https://github.com/JacksonJohnny/multiplatform-idle-clicker-boilerplate)

| Target | Resolution | Layout |
| --- | --- | --- |
| Desktop / web landscape | `1280×720` base (RESIZE) | Cookie Clicker–style columns |
| Mobile | `540×960` portrait (FIT) | Bottom tabs |

Force UI: `?ui=mobile` or `?ui=desktop` (set **before** load / hard refresh — `IS_MOBILE_UI` freezes at import).  
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
- Wall-clock idle + offline earnings (default uncapped; `maxOfflineSeconds: null`).
- Achievements, prestige → Ascension Tokens (confirm + 5s countdown).
- Versioned save (`SAVE_VERSION = 10`) with migrations + checksum.
- **Desktop:** left TAP · middle UPGRADE / STATUS / PRESTIGE / settings (default UPGRADE) · right STORE always on; row click to buy; hover tooltips; ←/→ cycles middle tabs.
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
| Store generators | Labels `Generator N` | Ids **`upgrade-N`** — do not rename without a migration; legacy `generator-N` is aliased |
| Meta-upgrades | `META_UPGRADES`, `meta*` | Save field **`boosts`** — do not rename without a migration |
| Ascension Tokens | `ascensionTokens` | `ascensionTokens` — use `asNonNegInt` in [`prestige.js`](src/lib/prestige.js); **never** `| 0` (signed int32 wraps past ~2.1B) |
| Efficiency ★ on STORE | UI `efficiencyPips` | Derived from efficiency entries in `boosts` (not prestige currency) |

Rename UI freely; keep `boosts` and `upgrade-N` ids stable.

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
Desktop id/window: `src-tauri/tauri.conf.json` (Phaser base `1280×720`; Tauri default window `1600×900`, scales via RESIZE). Mobile `appId`: `capacitor.config.json`.  
Fonts (Bungee / Nunito) load from Google CSS in `style.css` — self-host if you need offline Steam/Tauri branding.

Lock native mobile apps to **portrait**. Desktop / Steam stay landscape. Tighten Tauri `csp` before a real ship (`null` is fine for the boilerplate).

## Save

Autosave every 10s + flush on hide / `pagehide` / `beforeunload`. Reset: `?resetSave=1`.  
Offline: `hydrate` from `savedAt` on load (uncapped when `maxOfflineSeconds` is `null`); resume from background shows the welcome-back modal if away ≥ 1s.  
Migrations: [`src/services/saveMigrations.js`](src/services/saveMigrations.js) — greenfield forks can leave the v1→10 chain alone and bump from 10.

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
