#!/usr/bin/env bash
#
# contract-sync.sh — pull the latest openapi.json snapshot from the sibling
# nutrimero-api checkout and regenerate the typed client from it.
#
# Manual, on purpose (mirrors nutrimero-web's ADR-0002): a contract change is a
# deliberate, reviewable diff — review contract/openapi.json and
# packages/core/src/api/generated/schema.d.ts, then commit both together.
# CI never runs this script; its "contract" job re-runs `pnpm contract:generate`
# against the already-committed snapshot and fails on drift (Constitution II).
#
# Usage: pnpm contract:sync
#
set -euo pipefail

ROOT="$(git rev-parse --show-toplevel)"
SRC="$ROOT/../nutrimero-api/openapi.json"
DEST="$ROOT/contract/openapi.json"

[ -f "$SRC" ] || {
  echo "✗ $SRC not found." >&2
  echo "  contract:sync expects nutrimero-api checked out as a sibling directory:" >&2
  echo "    ~/Projects/nutrimero-api" >&2
  echo "    ~/Projects/nutrimero-mobile   (this repo)" >&2
  exit 1
}

mkdir -p "$ROOT/contract"
cp "$SRC" "$DEST"
echo "✓ copied $SRC"
echo "       -> $DEST"

echo "→ regenerating the typed client (pnpm contract:generate)"
(cd "$ROOT" && pnpm contract:generate)

echo
echo "Review the diff in contract/openapi.json and packages/core/src/api/generated/schema.d.ts,"
echo "then commit both together — that diff IS the contract change."
