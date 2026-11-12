/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface SharedShippingZone {
  id: string;
  name: string;
  cities: string[];
  fee: number;
  freeThreshold: number;
  etaMinDays: number;
  etaMaxDays: number;
}

export const SHIPPING_ZONES: SharedShippingZone[] = [
  {
    id: 'zone-1',
    name: 'Major Metros (Fast-Track)',
    cities: ['Karachi', 'Lahore', 'Islamabad', 'Rawalpindi'],
    fee: 190,
    freeThreshold: 3500,
    etaMinDays: 1,
    etaMaxDays: 2,
  },
  {
    id: 'zone-2',
    name: 'Urban Commercial Hubs',
    cities: [
      'Faisalabad',
      'Multan',
      'Peshawar',
      'Sialkot',
      'Gujranwala',
      'Hyderabad',
      'Quetta',
      'Abbottabad',
      'Sadiqabad',
      'Rahim Yar Khan',
      'Bahawalpur',
      'Sargodha',
      'Sukkur',
      'Gujrat',
      'Sheikhupura',
      'Mardan',
    ],
    fee: 250,
    freeThreshold: 3500,
    etaMinDays: 2,
    etaMaxDays: 4,
  },
  {
    id: 'zone-3',
    name: 'Nationwide Rest of Pakistan',
    cities: ['Gilgit', 'Skardu', 'Gwadar', 'Mirpur', 'Muzaffarabad', 'Other Cities'],
    fee: 300,
    freeThreshold: 3500,
    etaMinDays: 3,
    etaMaxDays: 5,
  },
];

export function getShippingZoneForCity(cityName?: string): SharedShippingZone {
  if (!cityName || typeof cityName !== 'string') {
    return SHIPPING_ZONES[2];
  }
  const clean = cityName.trim().toLowerCase();
  const match = SHIPPING_ZONES.find((z) =>
    z.cities.some((c) => c.toLowerCase() === clean)
  );
  return match || SHIPPING_ZONES[2];
}

export function calculateServerShippingFee(cityName: string, merchandiseSubtotal: number): number {
  const zone = getShippingZoneForCity(cityName);
  if (merchandiseSubtotal >= zone.freeThreshold) {
    return 0;
  }
  return zone.fee;
}
