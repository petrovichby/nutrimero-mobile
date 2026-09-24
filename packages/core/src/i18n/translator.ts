import { createTranslator as createIntlTranslator } from "use-intl/core";
import { type Locale, messages } from "./messages";

/**
 * Dev builds only: React Native defines `__DEV__` false in release. Anywhere it is not defined
 * (Node, tests) the check runs.
 */
function isDevBuild(): boolean {
  return Reflect.get(globalThis, "__DEV__") !== false;
}

/**
 * The whole-number plural rule (ruling 2026-09-24): every plural argument is a `count`, and a count
 * is an integer — fractions are formatted as numbers, never pluralised (the forced polyfill
 * diverges from CLDR on fractions in hu, lt and be). catalogs.test.ts checks the naming; this
 * checks the values at runtime, in dev builds.
 */
export function assertWholeCount(values: unknown): void {
  const count =
    typeof values === "object" && values !== null ? Reflect.get(values, "count") : undefined;
  if (count !== undefined && !Number.isInteger(count)) {
    throw new Error(`Plural count must be a whole number, got ${String(count)}`);
  }
}

/**
 * A translator over one locale's catalog. Keys and ICU arguments are typed from the English
 * catalog, which every other catalog matches key for key (catalogs.test.ts). In dev builds every
 * call's `count` is checked to be a whole number.
 */
export function createTranslator(locale: Locale) {
  const translate = createIntlTranslator({ locale, messages: messages[locale] });
  if (!isDevBuild()) return translate;
  return new Proxy(translate, {
    apply(target, thisArg, args) {
      assertWholeCount(args[1]);
      return Reflect.apply(target, thisArg, args);
    },
  });
}

export type Translator = ReturnType<typeof createTranslator>;
