#!/usr/bin/env bash
#
# contract-sync.sh — snapshot openapi.json from the sibling nutrimero-api
# checkout's origin/main (via `git show`, never its working tree), record the api
# commit in contract/SOURCE, and regenerate the typed client from it.
#
# Manual, on purpose (mirrors nutrimero-web's ADR-0002): a contract change is a
# deliberate, reviewable diff — review contract/openapi.json, contract/SOURCE and
# packages/core/src/api/generated/schema.d.ts, then commit them together.
# CI never runs this script; its "contract" job re-runs `pnpm contract:generate`
# against the already-committed snapshot and fails on drift (Constitution II).
#
# Usage: pnpm contract:sync [api-ref]   (default: origin/main)
#
set -euo pipefail

ROOT="$(git rev-parse --show-toplevel)"
# The sibling is resolved from the main checkout, not the worktree: a lane worktree's
# toplevel is .worktrees/<lane>, whose ../ is not ~/Projects.
MAIN_ROOT="$(dirname "$(git rev-parse --path-format=absolute --git-common-dir)")"
API="$MAIN_ROOT/../nutrimero-api"
REF="${1:-origin/main}"
DEST="$ROOT/contract/openapi.json"
SOURCE="$ROOT/contract/SOURCE"

[ -d "$API/.git" ] || {
  echo "✗ $API is not a git checkout." >&2
  echo "  contract:sync expects nutrimero-api checked out as a sibling directory:" >&2
  echo "    ~/Projects/nutrimero-api" >&2
  echo "    ~/Projects/nutrimero-mobile   (this repo)" >&2
  exit 1
}

# Snapshot from the api's published ref (default origin/main), never from the sibling's
# working tree — a local checkout can lag or carry uncommitted work.
git -C "$API" fetch --quiet origin
SHA="$(git -C "$API" rev-parse "$REF")"
mkdir -p "$ROOT/contract"
git -C "$API" show "$SHA:openapi.json" > "$DEST"
printf 'nutrimero-api %s (%s)\n' "$SHA" "$REF" > "$SOURCE"
echo "✓ snapshot of nutrimero-api $REF at $SHA"
echo "       -> $DEST (commit recorded in contract/SOURCE)"

echo "→ regenerating the typed client (pnpm contract:generate)"
(cd "$ROOT" && pnpm contract:generate)

echo
echo "Review the diff in contract/openapi.json, contract/SOURCE and packages/core/src/api/generated/schema.d.ts,"
echo "then commit them together — that diff IS the contract change."
