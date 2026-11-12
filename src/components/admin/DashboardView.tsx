/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo } from 'react';
import {
  TrendingUp,
  Package,
  Boxes,
  RotateCcw,
  Clock,
  Layers,
  Users,
  MessageSquare,
  AlertCircle,
  FolderTree,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext.tsx';

export const DashboardView: React.FC = () => {
  const { orders, products, categoryItems, returns, customers, reviews } = useStore();

  // Compute real metrics from authoritative data
  const metrics = useMemo(() => {
    const validOrders = orders.filter((o) => o.status !== 'cancelled');

    const grossMerchandise = orders.reduce((sum, o) => sum + (o.totals?.merchandiseGross || 0), 0);
    const netSales = validOrders.reduce((sum, o) => sum + (o.totals?.total || 0), 0);

    const pendingOrdersCount = orders.filter(
      (o) => o.status === 'pending_confirmation' || (o.status as string) === 'pending'
    ).length;
    const deliveredCount = orders.filter((o) => o.status === 'delivered').length;
    const cancelledCount = orders.filter((o) => o.status === 'cancelled').length;

    let totalOnHand = 0;
    let totalReserved = 0;
    let lowStockCount = 0;

    for (const prod of products) {
      if (prod.variants && prod.variants.length > 0) {
        for (const v of prod.variants) {
          totalOnHand += v.stockOnHand || 0;
          totalReserved += v.stockReserved || 0;
          const avail = v.stockOnHand - v.stockReserved;
          if (avail <= v.lowStockThreshold && avail >= 0) {
            lowStockCount++;
          }
        }
      } else {
        const pStock = prod.stock || 0;
        totalOnHand += pStock;
        if (pStock <= 5) lowStockCount++;
      }
    }

    return {
      grossMerchandise,
      netSales,
      ordersPlaced: orders.length,
      pendingOrdersCount,
      deliveredCount,
      cancelledCount,
      totalOnHand,
      totalReserved,
      totalAvailable: Math.max(0, totalOnHand - totalReserved),
      lowStockCount,
      openReturnsCount: returns.filter((r) => r.status === 'requested').length,
    };
  }, [orders, products, returns]);

  const hasSales = orders.length > 0 && metrics.netSales > 0;
  const hasOrders = orders.length > 0;

  return (
    <div className="space-y-6 text-[#1A1816]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#DED6CA] pb-4">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-medium tracking-tight text-[#1A1816]">
            Store Performance & KPIs
          </h1>
          <p className="text-xs text-[#685F54] mt-0.5">
            Real-time commercial analytics and inventory management for SARUS Premium Fabrics.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono bg-[#FFFFFF] px-3 py-1.5 rounded-lg border border-[#DED6CA] text-[#8A7864] shadow-2xs">
          <Clock size={13} />
          <span>PKT LIVE REPORTING</span>
        </div>
      </div>

      {/* Primary KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Products */}
        <div className="p-5 bg-[#FFFFFF] rounded-xl border border-[#DED6CA] space-y-1 shadow-2xs">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-[#8A7864] block flex items-center gap-1.5">
            <Layers size={13} />
            <span>Total Fabrics</span>
          </span>
          <p className="font-display text-2xl sm:text-3xl font-medium text-[#1A1816] tabular-nums">
            {products.length}
          </p>
          <span className="text-[11px] text-[#685F54] block">
            {products.filter((p) => p.status === 'active' || p.isPublished !== false).length} Active in Catalog
          </span>
        </div>

        {/* Total Categories */}
        <div className="p-5 bg-[#FFFFFF] rounded-xl border border-[#DED6CA] space-y-1 shadow-2xs">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-[#8A7864] block flex items-center gap-1.5">
            <FolderTree size={13} />
            <span>Categories</span>
          </span>
          <p className="font-display text-2xl sm:text-3xl font-medium text-[#1A1816] tabular-nums">
            {categoryItems.length}
          </p>
          <span className="text-[11px] text-[#685F54] block">
            {categoryItems.filter((c) => c.isVisible !== false).length} Visible Collections
          </span>
        </div>

        {/* Total Orders */}
        <div className="p-5 bg-[#FFFFFF] rounded-xl border border-[#DED6CA] space-y-1 shadow-2xs">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-[#8A7864] block flex items-center gap-1.5">
            <Package size={13} />
            <span>Total Orders</span>
          </span>
          <p className="font-display text-2xl sm:text-3xl font-medium text-[#1A1816] tabular-nums">
            {metrics.ordersPlaced}
          </p>
          <span className="text-[11px] text-[#8A7864] font-medium block">
            {metrics.pendingOrdersCount} Pending Confirmation
          </span>
        </div>

        {/* Net Realized Sales */}
        <div className="p-5 bg-[#FFFFFF] rounded-xl border border-[#DED6CA] space-y-1 shadow-2xs">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-[#8A7864] block flex items-center gap-1.5">
            <TrendingUp size={13} />
            <span>Net Revenue</span>
          </span>
          {hasSales ? (
            <>
              <p className="font-display text-2xl sm:text-3xl font-medium text-[#1A1816] tabular-nums">
                Rs {metrics.netSales.toLocaleString()}
              </p>
              <span className="text-[11px] text-[#685F54] block">COD Orders Value</span>
            </>
          ) : (
            <div className="py-1">
              <p className="text-sm font-semibold text-[#1A1816] uppercase">Rs 0</p>
              <span className="text-[11px] text-[#685F54]">Awaiting customer checkouts</span>
            </div>
          )}
        </div>
      </div>

      {/* Secondary Quick Metrics Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Pending Orders Alert */}
        <div className="p-4 bg-[#FAF8F5] border border-[#DED6CA] rounded-xl flex items-center justify-between">
          <div>
            <span className="text-[10px] font-semibold text-[#8A7864] uppercase tracking-wider block">
              Pending Orders
            </span>
            <p className="text-lg font-bold text-[#1A1816] tabular-nums mt-0.5">
              {metrics.pendingOrdersCount} {metrics.pendingOrdersCount === 1 ? 'Order' : 'Orders'}
            </p>
            <span className="text-[11px] text-[#685F54]">Awaiting dispatch verification</span>
          </div>
          <div className="w-10 h-10 rounded-full bg-[#FFFFFF] border border-[#DED6CA] flex items-center justify-center text-[#8A7864]">
            <Package size={18} />
          </div>
        </div>

        {/* Low Stock Watch */}
        <div className="p-4 bg-[#FAF8F5] border border-[#DED6CA] rounded-xl flex items-center justify-between">
          <div>
            <span className="text-[10px] font-semibold text-[#8A7864] uppercase tracking-wider block">
              Low Stock Warnings
            </span>
            <p className="text-lg font-bold text-[#1A1816] tabular-nums mt-0.5">
              {metrics.lowStockCount} {metrics.lowStockCount === 1 ? 'Fabric' : 'Fabrics'}
            </p>
            <span className="text-[11px] text-[#685F54]">Requires supplier restocking</span>
          </div>
          <div className="w-10 h-10 rounded-full bg-[#FFFFFF] border border-[#DED6CA] flex items-center justify-center text-[#8A7864]">
            <Boxes size={18} />
          </div>
        </div>

        {/* Patrons & CRM */}
        <div className="p-4 bg-[#FAF8F5] border border-[#DED6CA] rounded-xl flex items-center justify-between">
          <div>
            <span className="text-[10px] font-semibold text-[#8A7864] uppercase tracking-wider block">
              Customer Registry
            </span>
            <p className="text-lg font-bold text-[#1A1816] tabular-nums mt-0.5">
              {customers.length} Patrons
            </p>
            <span className="text-[11px] text-[#685F54]">Registered client profiles</span>
          </div>
          <div className="w-10 h-10 rounded-full bg-[#FFFFFF] border border-[#DED6CA] flex items-center justify-center text-[#8A7864]">
            <Users size={18} />
          </div>
        </div>
      </div>

      {/* Recent Orders Stream */}
      <div className="bg-[#FFFFFF] rounded-xl border border-[#DED6CA] overflow-hidden shadow-2xs">
        <div className="p-4 border-b border-[#DED6CA] flex items-center justify-between bg-[#FAF8F5]">
          <h3 className="font-semibold text-xs uppercase tracking-wider text-[#1A1816] flex items-center gap-2">
            <Package size={15} className="text-[#8A7864]" />
            <span>Recent Storefront Orders</span>
          </h3>
          <span className="text-[11px] text-[#685F54]">Cash on Delivery Logistics</span>
        </div>

        {hasOrders ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs tabular-nums text-[#1A1816]">
              <thead className="bg-[#FAF8F5] uppercase text-[10px] text-[#8A7864] tracking-wider border-b border-[#DED6CA]">
                <tr>
                  <th className="p-3">Order Number</th>
                  <th className="p-3">Customer</th>
                  <th className="p-3">City</th>
                  <th className="p-3">Items</th>
                  <th className="p-3">Total (COD)</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Placed Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#DED6CA]/60">
                {orders.slice(0, 5).map((ord) => (
                  <tr key={ord.id} className="hover:bg-[#FAF8F5]/60">
                    <td className="p-3 font-mono font-medium text-[#1A1816]">{ord.orderNumber}</td>
                    <td className="p-3">
                      <p className="font-medium text-[#1A1816]">{ord.customer?.name}</p>
                      <p className="text-[11px] text-[#685F54]">{ord.customer?.phone}</p>
                    </td>
                    <td className="p-3 text-[#685F54]">{ord.shippingAddress?.city}</td>
                    <td className="p-3">{ord.items?.length || 0} fabrics</td>
                    <td className="p-3 font-semibold text-[#1A1816]">
                      Rs {(ord.totals?.total || ord.totalAmount || 0).toLocaleString()}
                    </td>
                    <td className="p-3">
                      <span className="px-2.5 py-0.5 text-[10px] font-semibold uppercase rounded-full border border-[#DED6CA] bg-[#FAF8F5] text-[#1A1816]">
                        {ord.status.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="p-3 text-[#685F54] text-[11px]">
                      {new Date(ord.placedAt || ord.createdAt || Date.now()).toLocaleTimeString('en-PK', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}{' '}
                      PKT
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-12 text-center p-6">
            <div className="w-12 h-12 rounded-full bg-[#FAF8F5] border border-[#DED6CA] flex items-center justify-center mx-auto mb-3 text-[#8A7864]">
              <Package size={20} />
            </div>
            <p className="font-medium text-sm text-[#1A1816] uppercase tracking-wide">No Orders Placed Yet</p>
            <p className="text-xs text-[#685F54] max-w-sm mx-auto mt-1">
              Customer orders placed on the storefront via Cash on Delivery will appear in this real-time stream.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
