/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import { canTransitionOrder } from './orderMachine.ts';

test('order manager can confirm pending order', () => {
  const result = canTransitionOrder('pending_confirmation', 'confirmed', 'order_manager');
  assert.equal(result.allowed, true);
});

test('customer can cancel unconfirmed order', () => {
  const result = canTransitionOrder('pending_confirmation', 'cancelled', 'customer');
  assert.equal(result.allowed, true);
});

test('customer cannot cancel shipped order', () => {
  const result = canTransitionOrder('shipped', 'cancelled', 'customer');
  assert.equal(result.allowed, false);
});

test('cannot skip steps (cannot jump from confirmed directly to delivered)', () => {
  const result = canTransitionOrder('confirmed', 'delivered', 'admin');
  assert.equal(result.allowed, false);
  assert.match(result.reason || '', /Illegal state transition/);
});

test('terminal states have no forward transitions', () => {
  const cancelAttempt = canTransitionOrder('cancelled', 'confirmed', 'owner');
  assert.equal(cancelAttempt.allowed, false);

  const refundAttempt = canTransitionOrder('refunded', 'delivered', 'owner');
  assert.equal(refundAttempt.allowed, false);
});
