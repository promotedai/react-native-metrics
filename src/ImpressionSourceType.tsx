/**
 * Source of presented list content. This allows Promoted client integration
 * to provide guidance based on the presence or absence of Promoted's
 * insertion IDs in list content.
 */
export enum ImpressionSourceType {
  UnknownImpressionSourceType = 0,

  /**
   * Content served by Promoted Delivery API. In this case, we require
   * insertion IDs in content, and the *absence* of insertion IDs will
   * trigger warnings.
   */
  Delivery = 1,

  /**
   * Content served by non-Promoted backend. Corresponds to client-served
   * content that is not optimized by Promoted. In this case, we do not
   * expect insertion IDs in content, and the *presence* of insertion IDs
   * will trigger warnings.
   */
  ClientBackend = 2
}
