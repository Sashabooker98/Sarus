/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export const STORE_CONTACT = {
  phone: '0326-3512202',
  whatsapp: '0326-3512202',
  address: 'Sadiqabad Tibbi Wighawar, Near Madni Masjid, Sadiqabad, Punjab, Pakistan',
  city: 'Sadiqabad',
} as const;

/**
 * Strips non-digits; if it starts with "92" returns as is;
 * if it starts with "0", replaces the leading 0 with "92".
 * e.g. "0326-3512202" -> "923263512202".
 */
export function toWhatsAppDigits(raw?: string): string {
  if (!raw) return '923263512202';
  const digits = raw.replace(/\D/g, '');
  if (digits.startsWith('92')) {
    return digits;
  }
  if (digits.startsWith('0')) {
    return '92' + digits.slice(1);
  }
  return digits;
}

/**
 * Returns https://wa.me/<digits> and appends ?text=<encodeURIComponent(message)> when a message is given.
 */
export function buildWhatsAppLink(raw?: string, message?: string): string {
  const digits = toWhatsAppDigits(raw);
  const base = `https://wa.me/${digits}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

/**
 * Returns tel:+92XXXXXXXXXX (leading 0 replaced with +92).
 */
export function buildTelLink(raw?: string): string {
  if (!raw) return 'tel:+923263512202';
  const digits = raw.replace(/\D/g, '');
  if (digits.startsWith('92')) {
    return `tel:+${digits}`;
  }
  if (digits.startsWith('0')) {
    return `tel:+92${digits.slice(1)}`;
  }
  return `tel:+${digits}`;
}
