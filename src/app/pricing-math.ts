/**
 * How Brian charges, as arithmetic: a one-off build fee, then half of whatever
 * the client was already paying for the software being replaced, until the
 * handover. From the handover on the fee is nothing, which is why the saving
 * is measured over a horizon longer than the fee runs for.
 */
export const BUILD_FEE = 2500;
export const ONGOING_SHARE = 0.5;
export const HANDOVER_YEARS = 3;
export const HORIZON_YEARS = 6;

export function sixYearSums(monthlySpend: number) {
  const rented = monthlySpend * 12 * HORIZON_YEARS;
  const ongoingMonthly = monthlySpend * ONGOING_SHARE;
  const ongoingTotal = ongoingMonthly * 12 * HANDOVER_YEARS;
  return {
    /** What the old subscriptions would have cost over the horizon. */
    rented,
    ongoingMonthly,
    /** Brian's ongoing fee, summed over the years before the handover. */
    ongoingTotal,
    saved: rented - BUILD_FEE - ongoingTotal,
  };
}
