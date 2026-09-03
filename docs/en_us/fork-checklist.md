# Before you ship a fork

Everything below either ships inside your installers or is fetched at runtime by your users' installed
app from URLs configured in `developer/app.js` and `developer/update.js`. A value left at its default means
your app talks to Alphabiz's infrastructure, carries Alphabiz's identifiers, or shows Alphabiz's
content. Work through the list once before your first release and re-check it whenever you sync with
upstream.

## `developer/app.js`

Identity and installers:

- [ ] `name` — must start with at least 3 characters from `a-z`, `A-Z`, `0-9`, `.`, `-`, `+` (that is what `developer/validateAppConfig.js` checks); `developer/app.js` recommends sticking to letters with no spaces. It also seeds `snapName`, `protocol` and `LIBDB_NAME`
- [ ] `displayName` — the window title and the APPX display name
- [ ] `fileName` — used for installer file names; keep it to 15 characters or fewer for macOS
- [ ] `appId` — mobile application id (`com.zeeis.alphabiz` by default)
- [ ] `appIdentifier` — macOS bundle identifier registered in your Apple developer account (`org.zeeis.alphabiz` by default; note that its prefix differs from `appId`)
- [ ] `snapName` — the binary name of your `.snap` (defaults to the lower-case `name`)
- [ ] `author`, `developer`, `description` — `developer` is the Windows developer name and must not contain characters such as `<>`
- [ ] `appxPackageIdentityName` — the identity name in your APPX manifest; keep it consistent between local builds and any store submission of yours
- [ ] `publisher` — must equal the subject of *your* APPX signing certificate (`CN=…`; default `CN=zeeis`)
- [ ] `publisherDisplayName` — the publisher name shown for your APPX
- [ ] `homepage` — your website (used in the Debian package)
- [ ] `webEditionUrl` — your hosted web edition (`https://web.alpha.biz` by default)
- [ ] `upgradeCode` — generate your own with `npx uuid v4`; Windows treats two apps with the same code as the same product and removes one when installing the other
- [ ] `protocol`, `shortProtocol` — the URL schemes your app registers (`alphabiz://` and `ab://` by default); lower-case, not on the Windows reserved list, checked by `developer/validateAppConfig.js`

Endpoints and content your installed app reads at runtime:

- [ ] `versionsUrl` — raw URL of *your* `versions.json` (the forced-update floor); the default points at `tanshuai/alphabiz` `main`
- [ ] `externalI18n` — raw URL of *your* `i18n/` directory; otherwise your app loads Alphabiz's translations from this repository's `main` branch
- [ ] `communities` — the community links shown next to the version label; defaults to a link back to github.com/tanshuai/alphabiz
- [ ] `library.recommends` — channel ids auto-selected for new users, pre-seeded with Alphabiz channels; replace them with your own or empty the lists
- [ ] `twitterAccount` — the account mentioned by the in-app feedback tweet
- [ ] `microsoftStoreProductId` — the product id the app opens through `ms-windows-store://pdp/?ProductId=`; change it to your own or clear it before shipping
- [ ] `register` — `mode` (`none` / `blacklist` / `whitelist`) and the country `list`
- [ ] `theme` — `color.primary` / `secondary` / `accent` and `cornerLogoStyle`
- [ ] `global.LIBDB_NAME` (bottom of the file) — derived from `name`; append a suffix if two of your builds share a name but must keep separate libraries

## `developer/update.js`

- [ ] `github.username`, `github.repo`, `github.branch` — the repository your app queries for releases (`api.github.com/repos/<username>/<repo>/releases`) and fetches `developer/take-down.json` from
- [ ] `github.internalRepo` — the repository used by the `internal` update channel
- [ ] `bucketUrl`, `s3DownloadUrl` — the S3 bucket and CDN prefix used by the updater's S3 download path; replace them with your own if you use that path (GitHub Releases downloads are driven by `github.*`)

## `developer/take-down.js` and `developer/take-down.json`

- [ ] **Replace the entire `admins` array with your own pubkey(s)** (type `lib.user.is.pub` in the main-process devtools console to print yours). The first shipped entry is the upstream Alphabiz administrator key; in the default `committee` mode it keeps a take-down vote in your app until you remove it. The other two entries are placeholders.
- [ ] `mode` — `admin` (any admin can ban an id) or `committee` (at least half of the admins must agree)
- [ ] Keep `developer/take-down.json` in your public repository: installed apps fetch `https://raw.githubusercontent.com/<username>/<repo>/<branch>/developer/take-down.json` (from `update.js`) without an app update

## `developer/dynamicConfig.js`

- [ ] `remote.url` — the remote config endpoint your app polls (`https://alpha.biz/app/remote_config` by default); the `local` block holds the built-in defaults (OAuth providers, phone-number sign-up, explore tab, update toggle)

## `developer/terms-of-service.md`

- [ ] Replace "Alphabiz", "Alphabiz Team" and "Tan Shuai" with your app name, your team and your rights holder; the file is rendered inside the app as Markdown, so do not add HTML comments

## Assets

- [ ] Replace every file under `developer/assets/` (`icon-256.png`, `logo.png`), `developer/icons/` (favicons from 16 to 128 px) and `developer/platform-assets/` (`android`, `ios`, `linux`, `mac`, `windows`), keeping the same file names and sizes

## `versions.json`

- [ ] `min.stable`, `min.nightly`, `min.internal` — the lowest version each channel may run before the app forces an update; served from the URL in `versionsUrl`

## `package.json` and `release.json`

- [ ] `version` in `package.json` and `newTagName` in `release.json` must be edited together to the same string, and `targetTagName` stays `main`; otherwise `yarn unpackaged` stops at the version contract (`scripts/release/version-contract.js`)

## Signing

- [ ] Windows APPX: your own certificate through `ALPHABIZ_APPX_PFX_PATH`, `ALPHABIZ_APPX_PFX_PASSWORD` and `ALPHABIZ_APPX_CERT_SHA256` (see [windows.md](windows.md#about-appx-target))
- [ ] macOS DMG: set `APPLE_ID` (with `APPLE_ASP`) for a signed DMG; without it `yarn make:dmg` produces an unsigned DMG

## Also check

- [ ] `i18n/` — the locales you want to ship, validated with `node ./check.js` from inside `i18n/`
- [ ] Search the repository for `alpha.biz`, `alphabiz` and `zeeis` to catch anything this list does not cover
