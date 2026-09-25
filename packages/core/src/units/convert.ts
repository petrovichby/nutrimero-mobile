/** Unit arithmetic shared by every screen that converts (Constitution IX: never inline). */

const GRAMS_PER_OUNCE = 28.349523125;

export const celsiusFromFahrenheit = (fahrenheit: number) => ((fahrenheit - 32) * 5) / 9;
export const fahrenheitFromCelsius = (celsius: number) => (celsius * 9) / 5 + 32;
export const gramsFromOunces = (ounces: number) => ounces * GRAMS_PER_OUNCE;
export const ouncesFromGrams = (grams: number) => grams / GRAMS_PER_OUNCE;

/** Rounds to the nearest multiple of `step`, e.g. oven temperatures to 5 degrees. */
export const roundToStep = (value: number, step: number) => Math.round(value / step) * step;

/**
 * Converts between two units of one dimension by their factors to a common base (millilitres or
 * grams). The factors come from the api's unit definitions (004 FR-010): no unit constant lives
 * in the app.
 */
export function convertByFactor(value: number, fromFactor: number, toFactor: number): number {
  if (!(fromFactor > 0) || !(toFactor > 0)) {
    throw new RangeError("Unit factors must be positive");
  }
  return (value * fromFactor) / toFactor;
}
