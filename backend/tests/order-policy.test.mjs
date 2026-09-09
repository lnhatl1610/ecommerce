import assert from "node:assert/strict";
import test from "node:test";
import { calculateDiscount } from "../dist/lib/pricing.js";
import { ORDER_TRANSITIONS } from "../dist/modules/orders/order.types.js";

test("percentage discounts are capped at 100 percent", () => {
  assert.equal(calculateDiscount(200_000, "PERCENTAGE", 10), 20_000);
  assert.equal(calculateDiscount(200_000, "PERCENTAGE", 120), 200_000);
});

test("fixed discounts never make totals negative", () => {
  assert.equal(calculateDiscount(50_000, "FIXED", 80_000), 50_000);
});

test("completed and cancelled orders are terminal", () => {
  assert.deepEqual(ORDER_TRANSITIONS.COMPLETED, []);
  assert.deepEqual(ORDER_TRANSITIONS.CANCELLED, []);
});
