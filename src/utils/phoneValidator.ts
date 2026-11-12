/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Validates and normalizes Pakistani mobile numbers.
 * Valid inputs:
 *  - 03001234567
 *  - 0300-1234567
 *  - +923001234567
 *  - 00923001234567
 *  - 923001234567
 */
export function normalizePakistaniPhone(raw: string): {
  isValid: boolean;
  e164?: string;
  formatted?: string;
  error?: string;
} {
  if (!raw || typeof raw !== 'string') {
    return { isValid: false, error: 'Phone number is required.' };
  }

  // Strip spaces, dashes, parentheses
  const clean = raw.replace(/[\s\-()]/g, '');

  let nationalNumber = '';

  if (clean.startsWith('+923') && clean.length === 13) {
    nationalNumber = clean.slice(3); // 3XXXXXXXXX
  } else if (clean.startsWith('00923') && clean.length === 14) {
    nationalNumber = clean.slice(4);
  } else if (clean.startsWith('923') && clean.length === 12) {
    nationalNumber = clean.slice(2);
  } else if (clean.startsWith('03') && clean.length === 11) {
    nationalNumber = clean.slice(1);
  } else if (clean.startsWith('3') && clean.length === 10) {
    nationalNumber = clean;
  } else {
    return {
      isValid: false,
      error: 'Please enter a valid 11-digit Pakistani mobile number (e.g. 0300-1234567).',
    };
  }

  // Check if national number is exactly 10 digits starting with 3
  if (!/^3\d{9}$/.test(nationalNumber)) {
    return {
      isValid: false,
      error: 'Invalid mobile code. Pakistani mobile numbers begin with 0300-0349.',
    };
  }

  const e164 = `+92${nationalNumber}`;
  const formatted = `0${nationalNumber.slice(0, 3)}-${nationalNumber.slice(3)}`;

  return {
    isValid: true,
    e164,
    formatted,
  };
}
