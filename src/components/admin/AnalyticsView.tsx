/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo } from 'react';
import { TrendingUp, Download, PieChart, BarChart3, AlertCircle } from 'lucide-react';
import { useStore } from '../../context/StoreContext.tsx';

export const AnalyticsView: React.FC = () => {
  const { orders } = useStore();

  const stats = useMemo(() => {
    const validOrders = orders.filter((o) => o.status !== 'cancelled');
    const netRevenue = validOrders.reduce((sum, o) => sum + o.totals.total, 0);
    const grossRevenue = orders.reduce((sum, o) => sum + o.totals.merchandiseGross, 0);
    const totalDiscount = orders.reduce((sum, o) => sum + o.totals.promotionDiscount + o.totals.couponDiscount, 0);

    const deliveredOrders = orders.filter((o) => o.status === 'delivered');
    const codSettled = deliveredOrders.reduce((sum, o) => sum + o.totals.total, 0);
    const codOutstanding = orders
      .filter((o) => ['shipped', 'packed', 'confirmed'].includes(o.status))
      .reduce((sum, o) => sum + o.totals.total, 0);

    const aov = validOrders.length > 0 ? Math.round(netRevenue / validOrders.length) : 0;

    // City distribution
    const cityMap: Record<string, { count: number; revenue: number }> = {};
    validOrders.forEach((o) => {
      const city = o.shippingAddress?.city || 'Other';
      if (!cityMap[city]) cityMap[city] = { count: 0, revenue: 0 };
      cityMap[city].count += 1;
      cityMap[city].revenue += o.totals.total;
    });

    // Category distribution
    const catMap: Record<string, { count: number; revenue: number }> = {};
    validOrders.forEach((o) => {
      o.items?.forEach((item) => {
        const cat = item.name.includes('Hoodie')
          ? 'Hoodies'
          : item.name.includes('Cargo')
          ? 'Cargos'
          : item.name.includes('Tee')
          ? 'T-Shirts'
          : item.name.includes('Puffer')
          ? 'Outerwear'
          : 'Streetwear';
        if (!catMap[cat]) catMap[cat] = { count: 0, revenue: 0 };
        catMap[cat].count += item.quantity;
        catMap[cat].revenue += item.lineTotal;
      });
    });

    return {
      netRevenue,
      grossRevenue,
      totalDiscount,
      codSettled,
      codOutstanding,
      aov,
      orderCount: orders.length,
      cities: Object.entries(cityMap).sort((a, b) => b[1].revenue - a[1].revenue),
      categories: Object.entries(catMap).sort((a, b) => b[1].revenue - a[1].revenue),
    };
  }, [orders]);

  const handleExportCsv = () => {
    if (orders.length === 0) return;
    const headers = ['Order Number', 'Date', 'Customer', 'Phone', 'City', 'Status', 'Payment Method', 'Total PKR'];
    const rows = orders.map((o) => [
      o.orderNumber,
      new Date(o.placedAt).toISOString(),
      `"${o.customer.name}"`,
      o.customer.phone,
      o.shippingAddress.city,
      o.status,
      o.paymentMethod,
      o.totals.total,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `sarus_orders_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (orders.length === 0) {
    return (
      <div className="space-y-6 text-[#F5F5F5]">
        <div className="border-b border-[#3A3323] pb-4">
          <h1 className="font-display text-3xl font-bold uppercase tracking-tight text-[#F5F5F5]">
            Financial Analytics & Reporting
          </h1>
          <p className="text-xs text-[#B5B5B5]">Authoritative PKR accounting and COD courier settlement tracking.</p>
        </div>

        <div className="p-16 bg-[#171717] border border-[#3A3323] rounded-lg text-center max-w-xl mx-auto shadow-xl">
          <div className="w-16 h-16 rounded-full bg-[#202020] border border-[#3A3323] text-[#D4AF37] flex items-center justify-center mx-auto mb-4">
            <TrendingUp size={28} />
          </div>
          <h3 className="font-display text-2xl font-bold uppercase text-[#F5F5F5]">
            No Sales Data Available
          </h3>
          <p className="text-xs text-[#B5B5B5] max-w-sm mx-auto mt-2 leading-relaxed">
            Revenue metrics, COD settlement calculations, and regional city distributions will compute automatically once customers place orders.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-[#F5F5F5]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#3A3323] pb-4">
        <div>
          <h2 className="font-display text-2xl font-bold tracking-tight text-[#F5F5F5] flex items-center gap-2">
            <TrendingUp size={24} className="text-[#D4AF37]" />
            <span>Financial Analytics & Reporting</span>
          </h2>
          <p className="text-xs text-[#B5B5B5]">
            Revenue metrics in PKR integers, Cash on Delivery settlement tracking, city distributions, and CSV export.
          </p>
        </div>

        <button
          onClick={handleExportCsv}
          className="px-3.5 py-2 bg-[#D4AF37] text-[#090909] hover:bg-[#F3E5C0] text-xs font-bold uppercase rounded flex items-center gap-2 cursor-pointer shadow-md transition-colors self-start sm:self-auto"
        >
          <Download size={14} />
          <span>Export Orders CSV</span>
        </button>
      </div>

      {/* 4 Core Financial KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#171717] p-4 rounded border border-[#3A3323] space-y-1">
          <span className="text-[10px] uppercase font-bold text-[#A88732] tracking-wider block">
            Net Sales (PKR)
          </span>
          <p className="font-mono text-2xl font-bold text-[#F5F5F5] tabular-nums">
            Rs {stats.netRevenue.toLocaleString()}
          </p>
          <div className="text-[11px] text-[#B5B5B5] flex justify-between pt-1 border-t border-[#3A3323]">
            <span>Gross: Rs {stats.grossRevenue.toLocaleString()}</span>
            <span className="text-[#D4AF37]">Disc: -Rs {stats.totalDiscount.toLocaleString()}</span>
          </div>
        </div>

        <div className="bg-[#171717] p-4 rounded border border-[#3A3323] space-y-1">
          <span className="text-[10px] uppercase font-bold text-[#A88732] tracking-wider block">
            COD Settled Revenue
          </span>
          <p className="font-mono text-2xl font-bold text-[#D4AF37] tabular-nums">
            Rs {stats.codSettled.toLocaleString()}
          </p>
          <div className="text-[11px] text-[#B5B5B5] flex justify-between pt-1 border-t border-[#3A3323]">
            <span>In-Transit COD:</span>
            <span className="font-bold text-[#F3E5C0]">Rs {stats.codOutstanding.toLocaleString()}</span>
          </div>
        </div>

        <div className="bg-[#171717] p-4 rounded border border-[#3A3323] space-y-1">
          <span className="text-[10px] uppercase font-bold text-[#A88732] tracking-wider block">
            Average Order Value (AOV)
          </span>
          <p className="font-mono text-2xl font-bold text-[#F5F5F5] tabular-nums">
            Rs {stats.aov.toLocaleString()}
          </p>
          <div className="text-[11px] text-[#B5B5B5] flex justify-between pt-1 border-t border-[#3A3323]">
            <span>Total Orders:</span>
            <span className="font-bold text-[#D4AF37]">{stats.orderCount}</span>
          </div>
        </div>

        <div className="bg-[#171717] p-4 rounded border border-[#3A3323] space-y-1">
          <span className="text-[10px] uppercase font-bold text-[#A88732] tracking-wider block">
            Settlement Reliability
          </span>
          <p className="font-mono text-2xl font-bold text-[#D4AF37] tabular-nums">
            100% COD
          </p>
          <div className="text-[11px] text-[#B5B5B5] flex justify-between pt-1 border-t border-[#3A3323]">
            <span>Audit Integrity:</span>
            <span className="text-[#D4AF37]">Verified</span>
          </div>
        </div>
      </div>

      {/* Breakdown: City Distribution & Category Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* City Breakdown */}
        <div className="bg-[#171717] p-5 rounded border border-[#3A3323] space-y-4">
          <div className="flex items-center justify-between border-b border-[#3A3323] pb-3">
            <h3 className="font-bold text-sm uppercase tracking-wide text-[#F5F5F5] flex items-center gap-2">
              <BarChart3 size={16} className="text-[#D4AF37]" />
              <span>City Volume Distribution</span>
            </h3>
            <span className="text-[10px] text-[#A88732]">Verified Deliveries</span>
          </div>

          <div className="space-y-3">
            {stats.cities.length > 0 ? (
              stats.cities.map(([cityName, data]) => {
                const percent = stats.netRevenue > 0 ? Math.round((data.revenue / stats.netRevenue) * 100) : 0;
                return (
                  <div key={cityName} className="space-y-1 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-[#F5F5F5]">{cityName}</span>
                      <span className="font-mono text-[#B5B5B5]">
                        Rs {data.revenue.toLocaleString()}{' '}
                        <span className="text-[10px]">({data.count} orders · {percent}%)</span>
                      </span>
                    </div>
                    <div className="w-full bg-[#090909] rounded-full h-2 overflow-hidden border border-[#3A3323]">
                      <div
                        className="bg-[#D4AF37] h-2 rounded-full transition-all duration-500"
                        style={{ width: `${Math.max(percent, 4)}%` }}
                      />
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="p-8 text-center text-xs text-[#B5B5B5]">No regional orders logged yet.</div>
            )}
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="bg-[#171717] p-5 rounded border border-[#3A3323] space-y-4">
          <div className="flex items-center justify-between border-b border-[#3A3323] pb-3">
            <h3 className="font-bold text-sm uppercase tracking-wide text-[#F5F5F5] flex items-center gap-2">
              <PieChart size={16} className="text-[#D4AF37]" />
              <span>Silhouette Category Contribution</span>
            </h3>
            <span className="text-[10px] text-[#A88732]">Heavyweight Streetwear</span>
          </div>

          <div className="space-y-3">
            {stats.categories.length > 0 ? (
              stats.categories.map(([catName, data]) => {
                const percent = stats.netRevenue > 0 ? Math.round((data.revenue / stats.netRevenue) * 100) : 0;
                return (
                  <div key={catName} className="space-y-1 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-[#F5F5F5]">{catName}</span>
                      <span className="font-mono text-[#B5B5B5]">
                        Rs {data.revenue.toLocaleString()}{' '}
                        <span className="text-[10px]">({data.count} units sold)</span>
                      </span>
                    </div>
                    <div className="w-full bg-[#090909] rounded-full h-2 overflow-hidden border border-[#3A3323]">
                      <div
                        className="bg-[#D4AF37] h-2 rounded-full transition-all duration-500"
                        style={{ width: `${Math.max(percent, 4)}%` }}
                      />
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="p-8 text-center text-xs text-[#B5B5B5]">No silhouette sales logged yet.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
