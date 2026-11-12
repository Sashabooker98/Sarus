/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizePakistaniPhone } from './phoneValidator.ts';

test('validates standard 0300 format', () => {
  const result = normalizePakistaniPhone('03001234567');
  assert.equal(result.isValid, true);
  assert.equal(result.e164, '+923001234567');
  assert.equal(result.formatted, '0300-1234567');
});

test('validates hyphenated format', () => {
  const result = normalizePakistaniPhone('0321-9876543');
  assert.equal(result.isValid, true);
  assert.equal(result.e164, '+923219876543');
  assert.equal(result.formatted, '0321-9876543');
});

test('validates +92 prefix format', () => {
  const result = normalizePakistaniPhone('+923335551234');
  assert.equal(result.isValid, true);
  assert.equal(result.e164, '+923335551234');
});

test('rejects incomplete numbers', () => {
  const result = normalizePakistaniPhone('0300123');
  assert.equal(result.isValid, false);
});

test('rejects non-Pakistani or non-mobile prefixes', () => {
  const result = normalizePakistaniPhone('04235870000'); // Lahore landline 042
  assert.equal(result.isValid, false);
});
