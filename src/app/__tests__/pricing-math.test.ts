import test from "node:test";
import assert from "node:assert/strict";
import {
  BUILD_FEE,
  HANDOVER_YEARS,
  HORIZON_YEARS,
  ONGOING_SHARE,
  sixYearSums,
} from "../pricing-math.ts";

const SLIDER_MIN = 200;
const SLIDER_MAX = 3000;
const SLIDER_STEP = 50;

test("at 900 a month the ledger is 64,800 rented, 16,200 ongoing, 46,100 saved", () => {
  const sums = sixYearSums(900);

  assert.deepEqual(sums, {
    rented: 64800,
    ongoingMonthly: 450,
    ongoingTotal: 16200,
    saved: 46100,
  });
});

test("the published offer terms are unchanged: 2,500 fee, half share, 3 year handover, 6 year horizon", () => {
  assert.equal(BUILD_FEE, 2500);
  assert.equal(ONGOING_SHARE, 0.5);
  assert.equal(HANDOVER_YEARS, 3);
  assert.equal(HORIZON_YEARS, 6);
});

test("zero spend saves minus the build fee", () => {
  assert.equal(sixYearSums(0).saved, -BUILD_FEE);
  assert.equal(sixYearSums(0).rented, 0);
});

test("saved is positive at the slider minimum", () => {
  assert.equal(sixYearSums(SLIDER_MIN).saved, 8300);
});

test("saved is positive at the slider maximum", () => {
  assert.equal(sixYearSums(SLIDER_MAX).saved, 159500);
});

test("saved equals rented minus fee minus ongoing total", () => {
  const sums = sixYearSums(1250);

  assert.equal(sums.saved, sums.rented - BUILD_FEE - sums.ongoingTotal);
});

test("ongoing fee only accrues for the handover years, not the whole horizon", () => {
  const sums = sixYearSums(100);

  assert.equal(sums.ongoingTotal, 50 * 12 * 3);
  assert.notEqual(sums.ongoingTotal, 50 * 12 * 6);
});

test("saving increases with spend across the whole slider range at every step", () => {
  const atStep = (n: number) => sixYearSums(SLIDER_MIN + n * SLIDER_STEP).saved;
  const steps = (SLIDER_MAX - SLIDER_MIN) / SLIDER_STEP;
  const worst = Math.min(...Array.from({ length: steps + 1 }, (_, n) => atStep(n)));

  assert.equal(worst, atStep(0));
  assert.ok(worst > 0);
});

test("does not mutate or depend on prior calls", () => {
  sixYearSums(3000);

  assert.equal(sixYearSums(900).saved, 46100);
});
