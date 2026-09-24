/**
 * The Intl polyfills (ADR 0001, amended 2026-09-24). Hermes ships no `Intl.PluralRules` and no
 * `Intl.Locale` on this runtime, and where an engine does ship them its CLDR differs by version —
 * so both are FORCED on device, on both platforms: plural selection comes from one pinned CLDR
 * dataset (@formatjs/intl-pluralrules 6.3.15), not whatever each engine carries.
 *
 * Order matters: `Intl.Locale` first (the plural polyfill resolves locales through it), then
 * `Intl.PluralRules`, then locale data — each data module registers itself onto the installed
 * polyfill. Data for the seven UI languages only (Constitution IX 1.1.0).
 *
 * Imported by `@nutrimero/core/native`, which each app imports FIRST in its entry file, before
 * i18n starts. The dev-launch plural check (app root) then verifies the result.
 */
import "@formatjs/intl-locale/polyfill-force.js";
import "@formatjs/intl-pluralrules/polyfill-force.js";
import "@formatjs/intl-pluralrules/locale-data/en.js";
import "@formatjs/intl-pluralrules/locale-data/de.js";
import "@formatjs/intl-pluralrules/locale-data/hu.js";
import "@formatjs/intl-pluralrules/locale-data/lt.js";
import "@formatjs/intl-pluralrules/locale-data/be.js";
import "@formatjs/intl-pluralrules/locale-data/pl.js";
import "@formatjs/intl-pluralrules/locale-data/uk.js";
