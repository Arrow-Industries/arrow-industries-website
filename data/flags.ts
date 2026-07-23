/**
 * Site feature flags. Flip a value and redeploy to toggle behaviour — no other
 * code needs to change.
 */
export const flags = {
  /**
   * Roadworthy / Licensed Vehicle Testing availability.
   *
   * `true`  → the full /licensed-vehicle-testing page (booking form, prices,
   *           schedule, JSON-LD) renders as normal.
   * `false` → the page shows a "temporarily unavailable" notice at the same URL
   *           instead. All the real page code is preserved and untouched — set
   *           this back to `true` to bring roadworthy inspections back online.
   */
  roadworthyAvailable: false,
} as const;
