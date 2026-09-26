# Releasing

Each app is versioned on its own: its own version source, its own build numbers, its own
tags. Nothing here is shared between Home Baker and Pro Baker. There are no OTA updates
for now. Every release is a store build.

## Pro Baker (`apps/pro-baker`)

### Version source

`apps/pro-baker/version.json` is the only source (eas.json `cli.appVersionSource: "local"`):

```json
{ "version": "0.1.0", "build": 1 }
```

- `version` is the semver marketing version (`expo.version`). `package.json` carries the same
  value.
- `build` is one integer. `app.config.ts` writes it to both `ios.buildNumber` (as a string)
  and `android.versionCode`. It starts at 1 and only rises, including across semver bumps. It
  is never reset.
- EAS never changes these numbers: no profile sets `autoIncrement`.
- `apps/pro-baker/src/version.test.ts` checks that `version` is semver, `build` is a positive
  integer, `package.json` agrees with `version.json`, and the evaluated config hands both stores
  the same numbers.

### Bumping

```sh
pnpm --filter pro-baker version:bump            # build only: 0.1.0 (1) → 0.1.0 (2)
pnpm --filter pro-baker version:bump patch      # 0.1.0 (1) → 0.1.1 (2)
pnpm --filter pro-baker version:bump minor      # 0.1.0 (1) → 0.2.0 (2)
pnpm --filter pro-baker version:bump major      # 0.1.0 (1) → 1.0.0 (2)
```

The script always raises `build` by one. It raises semver only when you name a part. It writes
`version.json` and `package.json` and commits just those two files, with the message
`chore(pro-baker): version <version> (build <build>)`. It refuses to run if either file has
uncommitted changes. Every build uploaded to a store needs a new build number, so bump before
each one. The bump lands on a lane branch through a PR, like any other change.

### Build profiles (`apps/pro-baker/eas.json`)

| Profile       | What it builds                                                   |
| ------------- | ---------------------------------------------------------------- |
| `development` | Dev client, internal distribution, Android as an APK             |
| `production`  | Store build (iOS App Store, Google Play AAB)                     |

The `production` profile refuses to evaluate while the entitlement adapter is the stub
(`packages/core/src/entitlements/source.json`). See spec 002 G2-Q1 / FR-023. Pro Baker ships to
the stores only once the api serves entitlements (ask B8).

### Tags

A release is tagged `pro-baker@<version>` (for example `pro-baker@0.1.0`) on the commit on
`main` that the production build was made from. Lanes never push to `main`, so the owner or the
coordinator creates the tag when they merge.
