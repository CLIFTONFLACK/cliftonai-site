import { Fragment } from "react";

/**
 * A headline split into clauses that wrap as whole units.
 *
 * Display-size headlines otherwise break wherever the line happens to run out,
 * which on a phone splits a sentence down the middle and leaves an orphan. At
 * 430px "No more paid subscriptions. Brian builds it." broke as
 * "No more paid / subscriptions. Brian builds / it.".
 *
 * `inline-block` fixes it because a shrink-to-fit box is measured against the
 * width of the containing block, not the space left on the current line: a
 * clause that doesn't fit the remainder moves to the next line entire. That is
 * the behaviour `text-wrap: balance` can't give, because balance evens the line
 * lengths without knowing where the phrases are.
 *
 * Deliberately not `white-space: nowrap` — a clause wider than the screen still
 * wraps inside itself rather than overflowing, which is what keeps this safe
 * down to 320px. `text-balance` is for exactly that fallback: at 320px
 * "so you don't have to" has to break, and balanced it breaks evenly instead of
 * stranding "to" on a line of its own.
 */
export function Clauses({ of }: { of: string[] }) {
  return (
    <>
      {of.map((clause, i) => (
        <Fragment key={clause}>
          {i > 0 && " "}
          <span className="inline-block text-balance">{clause}</span>
        </Fragment>
      ))}
    </>
  );
}
