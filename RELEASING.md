# Releasing

These steps publish a new version to GitHub and to npm. The official [Joplin plugin repository](https://github.com/joplin/plugins) picks up new npm versions automatically, usually within a few hours.

## One-time setup

- Install [Node.js](https://nodejs.org/) (it includes `npm`).
- Create an account at [npmjs.com](https://www.npmjs.com/) and run `npm login`.
- Make sure `git push` to GitHub works (SSH key or HTTPS token).

## Each release

1. Set the new version in **both** `src/manifest.json` and `package.json`. `build.sh` refuses to build if they differ.
2. Add an entry to `CHANGELOG.md`.
3. Commit, then tag the release and push it:
   ```sh
   git commit -am "Release 1.0.1"
   git tag -a v1.0.1 -m "v1.0.1"
   git push origin main --tags
   ```
4. Build from the tagged commit:
   ```sh
   sh build.sh
   ```
   The build writes `publish/plugin.tnoahc.pdf-header-footer.jpl` and `publish/plugin.tnoahc.pdf-header-footer.json`.
5. Test the `.jpl` with **Tools → Options → Plugins → ⚙ → Install from file**.
6. On GitHub, open **Releases → Draft a new release** and pick the tag. Paste the changelog entry and attach the `.jpl`.
7. Publish to npm:
   ```sh
   npm publish
   ```
   `prepublishOnly` rebuilds `publish/` automatically. Only `publish/`, `package.json`, `README.md`, `LICENSE` and `CHANGELOG.md` are uploaded.

The plugin ID (`plugin.tnoahc.pdf-header-footer`) must never change after the first npm release, or Joplin will treat the plugin as a different one.
