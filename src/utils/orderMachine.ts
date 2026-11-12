/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { OrderStatus, Role } from '../types/index.ts';

export interface TransitionRule {
  allowedRoles: (Role | 'customer')[];
  description: string;
  stockEffect: 'none' | 'reserve' | 'release' | 'fulfil' | 'restock';
}

export const ORDER_TRANSITIONS: Record<OrderStatus, Partial<Record<OrderStatus, TransitionRule>>> = {
  pending_confirmation: {
    confirmed: {
      allowedRoles: ['order_manager', 'admin', 'owner'],
      description: 'Confirm order for processing',
      stockEffect: 'none',
    },
    cancelled: {
      allowedRoles: ['customer', 'order_manager', 'admin', 'owner', 'support'],
      description: 'Cancel unconfirmed order and release stock',
      stockEffect: 'release',
    },
  },
  confirmed: {
    processing: {
      allowedRoles: ['order_manager', 'admin', 'owner'],
      description: 'Start picking and packing order',
      stockEffect: 'none',
    },
    cancelled: {
      allowedRoles: ['order_manager', 'admin', 'owner'],
      description: 'Cancel order before packing',
      stockEffect: 'release',
    },
  },
  processing: {
    packed: {
      allowedRoles: ['order_manager', 'admin', 'owner'],
      description: 'Order packed and ready for courier handover',
      stockEffect: 'none',
    },
    cancelled: {
      allowedRoles: ['order_manager', 'admin', 'owner'],
      description: 'Cancel order before shipment',
      stockEffect: 'release',
    },
  },
  packed: {
    shipped: {
      allowedRoles: ['order_manager', 'admin', 'owner'],
      description: 'Dispatched with courier; stock fulfilled from warehouse',
      stockEffect: 'fulfil',
    },
    cancelled: {
      allowedRoles: ['admin', 'owner'],
      description: 'Emergency cancellation after packing',
      stockEffect: 'release',
    },
  },
  shipped: {
    delivered: {
      allowedRoles: ['order_manager', 'admin', 'owner'],
      description: 'Delivered to customer and COD collected',
      stockEffect: 'none',
    },
    returned: {
      allowedRoles: ['order_manager', 'admin', 'owner'],
      description: 'Customer refused or parcel undeliverable (RTO)',
      stockEffect: 'restock',
    },
  },
  delivered: {
    return_requested: {
      allowedRoles: ['customer', 'support', 'order_manager', 'admin', 'owner'],
      description: 'Return/exchange request submitted within window',
      stockEffect: 'none',
    },
  },
  return_requested: {
    delivered: {
      allowedRoles: ['order_manager', 'admin', 'owner'],
      description: 'Return request rejected',
      stockEffect: 'none',
    },
    returned: {
      allowedRoles: ['order_manager', 'admin', 'owner'],
      description: 'Returned items received at warehouse and inspected',
      stockEffect: 'restock',
    },
  },
  returned: {
    refunded: {
      allowedRoles: ['admin', 'owner'],
      description: 'Refund processed and completed',
      stockEffect: 'none',
    },
  },
  cancelled: {},
  refunded: {},
};

export function canTransitionOrder(
  from: OrderStatus,
  to: OrderStatus,
  role: Role | 'customer'
): { allowed: boolean; reason?: string } {
  const sourceTransitions = ORDER_TRANSITIONS[from];
  if (!sourceTransitions) {
    return { allowed: false, reason: `Unknown origin status: ${from}` };
  }

  const rule = sourceTransitions[to];
  if (!rule) {
    return {
      allowed: false,
      reason: `Illegal state transition from ${from} to ${to}`,
    };
  }

  if (!rule.allowedRoles.includes(role)) {
    return {
      allowed: false,
      reason: `Role '${role}' is not authorized to transition order from ${from} to ${to}`,
    };
  }

  return { allowed: true };
}
