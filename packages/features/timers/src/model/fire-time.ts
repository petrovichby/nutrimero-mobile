/**
 * When a notification may fire for a clock that ends at `endAt` (ms). iOS delivers a scheduled
 * notification on a whole-second boundary at or before the requested time — measured in the
 * T027 simulator run (2026-09-25): an end at …53.879 s fired at …53.002 s. FR-013 / SC-001 say
 * never early, so the request is rounded **up** to the next whole second: at most a second
 * late, never early. The in-app alert still fires at `endAt` itself (it derives from the clock).
 */
export function notBefore(endAt: number): number {
  return Math.ceil(endAt / 1000) * 1000;
}
