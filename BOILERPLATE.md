# Multiplatform Idle Clicker Boilerplate

Reusable Phaser idle clicker: **Tauri 2** (Win/macOS/Linux) + **Capacitor 8** (Android/iOS). One web game in `src/`, two thin native shells.

**Conventions:** docs, UI strings, and placeholder brands are **English** and **generic** (`Idle Clicker`, `Generator N`, `com.example.idleclicker`).

Repo: [JacksonJohnny/multiplatform-idle-clicker-boilerplate](https://github.com/JacksonJohnny/multiplatform-idle-clicker-boilerplate)

## Structure

| Path | Role |
| --- | --- |
| `src/config` | Dual layout (`platform.js`), theme, UI text, buy amounts, `SAVE_KEY` / `SAVE_VERSION` |
| `src/data` | Generators, click upgrades, meta-upgrades, achievements |
| `src/lib` | Math, session, Auto Tap, prestige, save shape |
| `src/services` | Save I/O + migrations, settings, feedback, storage |
| `src/ui` | Phaser views |
| `src/scenes` | `ClickerScene` + `clicker/*` helpers |
| `src/controllers` | List scroll |
| `src-tauri` | Desktop shell |
| `capacitor.config.json` | Mobile `appId` (`cap add` once per platform) |

### Desktop vs mobile UI

- **Desktop:** left TAP · middle panel (UPGRADE / STATUS / PRESTIGE / settings, default UPGRADE) · right STORE always visible.
- **Mobile:** bottom tab bar; pages swap full-screen. Do not change mobile unless asked.

Override: `?ui=mobile` / `?ui=desktop` (**before** first load / hard refresh — layout freezes at import).

## Naming glossary (required reading)

| Concept | Code / UI | Persist |
| --- | --- | --- |
| Store generators | Labels `Generator N` | Ids **`upgrade-N`** (stable). Do not rename without a migration. Legacy `generator-N` → aliases. |
| Meta-upgrades | `META_UPGRADES`, UI `meta*` | Field **`boosts`** — never rename without a migration |
| Ascension Tokens | `ascensionTokens` | `ascensionTokens` — `asNonNegInt` / **never** `| 0` |
| Efficiency ★ on STORE | UI `efficiencyPips` | Derived from efficiency meta in `boosts` (not prestige) |
| Legacy save `stars` | — | Old prestige currency → migrated to `ascensionTokens` |

## Rebrand in 15 minutes

1. Theme + title: `theme.js`, `uiText.js` (fonts load from Google CSS — self-host for offline Steam/Tauri if needed)
2. Catalogs / prestige / achievements: `src/data/`, `src/lib/`
3. Resolution / loops: `gameConfig.js` + `platform.js` (`maxOfflineSeconds: null` = uncapped offline)
4. Desktop id/window: `src-tauri/tauri.conf.json` (Phaser base `1280×720`; default Tauri window `1600×900`, RESIZE)
5. Mobile `appId` / name: `capacitor.config.json`
6. `npm test` && `npm run build`

### Changing save format without wiping players

1. Do **not** rename `SAVE_KEY` (use `LEGACY_SAVE_KEYS` if needed).
2. Bump `SAVE_VERSION` in `gameConfig.js`.
3. Add a migration in `saveMigrations.js`.
4. Id renames → `UPGRADE_ID_ALIASES` / `BOOST_ID_ALIASES` / `ACHIEVEMENT_ID_ALIASES` in `saveState.js`.

Greenfield forks: leave the v1→10 migration chain alone; start new shape changes from `SAVE_VERSION = 10`.

## Targets

| Target | Command |
| --- | --- |
| Browser | `npm run dev` |
| Desktop | `npm run tauri:dev` / `tauri:build` |
| Android | `npm run android` (after `cap:add:android`) |
| iOS | `npm run ios` (macOS; after `cap:add:ios`) |

Lock native apps to **portrait** (`540×960`). Desktop / Steam stay landscape.  
Tighten Tauri `csp` before shipping a real product (`csp: null` is boilerplate-open).

See [README.md](README.md) for full notes.
