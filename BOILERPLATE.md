# Multiplatform Idle Clicker Boilerplate

Reusable Phaser idle clicker: **Tauri 2** for desktop (Win/macOS/Linux), **Capacitor 8** for Android/iOS. One web game in `src/`, two thin native shells.

**Conventions:** all docs, UI strings, and placeholder brand names are **English** and **generic** (`Idle Clicker`, `Generator N`, `com.example.idleclicker`). Rebrand via the steps below — do not leave Portuguese or product-specific lore in the shared boilerplate.

Repo: [JacksonJohnny/multiplatform-idle-clicker-boilerplate](https://github.com/JacksonJohnny/multiplatform-idle-clicker-boilerplate)

## Structure

- `src/config` — resolution (`1280×720` landscape), theme, UI text, buy amounts, `SAVE_KEY` / `SAVE_VERSION`
- `src/controllers` — `ListScrollController` (drag + mouse wheel)
- `src/data` — generators, click upgrades, `metaUpgrades.js`, `achievements.js`
- `src/lib` — formulas + session + Auto Tap + prestige + save shape
- `src/services` — save I/O + migrations, settings, feedback, storage (localStorage)
- `src/ui` / `src/scenes` — Phaser UI
- `src-tauri` — Tauri 2 desktop shell
- `capacitor.config.json` — Capacitor mobile (`appId`); run `cap add android|ios` once

## Naming glossary

| Concept | Code / UI | Persist / save |
| --- | --- | --- |
| Meta-upgrades (UPGRADE tab) | Catalog `META_UPGRADES`, UI `meta*` | Field **`boosts`** |
| Ascension Tokens | `ascensionTokens`, purple badge | `ascensionTokens` |
| Efficiency pips on STORE | Yellow ★ | Derived from efficiency meta in `boosts` |

## Rebrand in 15 minutes

1. Theme + title: `theme.js`, `uiText.js` (keep English unless you intentionally localize)
2. Generators / upgrades / meta / prestige / achievements: `src/data/`, `src/lib/`
3. Resolution / loops: `gameConfig.js` (keep landscape if you share one layout)
4. Desktop id/window: `src-tauri/tauri.conf.json` (replace `com.example.idleclicker.desktop`)
5. Mobile `appId`: `capacitor.config.json` (replace `com.example.idleclicker`)
6. `npm test` && `npm run build`

### Changing save format without wiping players

1. Do **not** rename `SAVE_KEY` (or list it in `LEGACY_SAVE_KEYS`).
2. Bump `SAVE_VERSION` in `gameConfig.js`.
3. Add a migration in `saveMigrations.js`.
4. Id renames → `UPGRADE_ID_ALIASES` / `BOOST_ID_ALIASES` in `saveState.js`.

## Targets

| Target | Command |
| --- | --- |
| Browser | `npm run dev` |
| Desktop | `npm run tauri:dev` / `tauri:build` |
| Android | `npm run android` (after `cap:add:android`) |
| iOS | `npm run ios` (macOS; after `cap:add:ios`) |

Lock native apps to **landscape** so they match `1280×720`.

Steam: package with Tauri, upload depots. Steamworks later if needed.

See [README.md](README.md) for full notes.
