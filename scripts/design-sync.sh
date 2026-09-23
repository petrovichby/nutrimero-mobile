#!/usr/bin/env bash
#
# design-sync.sh — snapshot the frontmatter of nutrimero-web's docs/DESIGN.md from the sibling
# checkout's origin/main (via `git show`, never its working tree) into
# docs/design-sources/web-design.frontmatter.yaml, record the web commit in
# docs/design-sources/SOURCE, and regenerate packages/ui tokens.
#
# Why a snapshot: Pro Baker inherits the web colour ramps verbatim (DESIGN.md 0.5.0
# colors-note), and CI cannot read a sibling repository. Like contract:sync, a ramp change is a
# deliberate, reviewable diff; CI only proves the generated tokens match the committed sources.
#
# Usage: pnpm design:sync [web-ref]   (default: origin/main)
#
set -euo pipefail

ROOT="$(git rev-parse --show-toplevel)"
# Resolved from the main checkout so it works from lane worktrees too.
MAIN_ROOT="$(dirname "$(git rev-parse --path-format=absolute --git-common-dir)")"
WEB="$MAIN_ROOT/../nutrimero-web"
REF="${1:-origin/main}"
DEST="$ROOT/docs/design-sources/web-design.frontmatter.yaml"
SOURCE="$ROOT/docs/design-sources/SOURCE"

[ -d "$WEB/.git" ] || {
  echo "✗ $WEB is not a git checkout (expected nutrimero-web as a sibling of nutrimero-mobile)." >&2
  exit 1
}

git -C "$WEB" fetch --quiet origin
SHA="$(git -C "$WEB" rev-parse "$REF")"
mkdir -p "$(dirname "$DEST")"
# The frontmatter only: the lines between the first two `---` fences, verbatim.
git -C "$WEB" show "$SHA:docs/DESIGN.md" | awk '/^---$/{n++; next} n==1' > "$DEST"
printf 'nutrimero-web %s (%s) docs/DESIGN.md frontmatter\n' "$SHA" "$REF" > "$SOURCE"
echo "✓ web DESIGN.md frontmatter at $SHA"

(cd "$ROOT" && pnpm tokens:generate)
echo "Review docs/design-sources/ and packages/ui/src/tokens.generated.ts, then commit them together."
