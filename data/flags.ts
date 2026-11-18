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
  roadworthyAvailable: true,

  /**
   * Warranty page. Stays hidden until the final wording is supplied: `false`
   * takes it out of the menus and sitemap and /warranty shows "page not found".
   */
  warrantyPublished: false,
} as const;
