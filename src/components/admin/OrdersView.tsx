/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import {
  Package,
  Search,
  Filter,
  CheckCircle,
  Truck,
  RotateCcw,
  XCircle,
  Clock,
  ArrowRight,
  AlertCircle,
  FileText,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext.tsx';
import { Order, OrderStatus } from '../../types/index.ts';

export const OrdersView: React.FC = () => {
  const { orders, transitionOrder } = useStore();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(orders[0]?.id || null);

  // Modals for actions
  const [shipModalOrder, setShipModalOrder] = useState<Order | null>(null);
  const [courierName, setCourierName] = useState('Trax Logistics');
  const [trackingRef, setTrackingRef] = useState('');

  const [cancelModalOrder, setCancelModalOrder] = useState<Order | null>(null);
  const [cancelReason, setCancelReason] = useState('Customer unreachable for phone confirmation');

  const [deliveryModalOrder, setDeliveryModalOrder] = useState<Order | null>(null);
  const [codAmountCollected, setCodAmountCollected] = useState<number>(0);

  const [actionError, setActionError] = useState<string | null>(null);

  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      if (statusFilter !== 'all' && o.status !== statusFilter) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        const matchNo = o.orderNumber?.toLowerCase().includes(q);
        const matchCust = o.customer?.name?.toLowerCase().includes(q);
        const matchPhone = o.customer?.phone?.includes(q);
        if (!matchNo && !matchCust && !matchPhone) return false;
      }
      return true;
    });
  }, [orders, statusFilter, search]);

  const activeOrder = useMemo(() => {
    return orders.find((o) => o.id === selectedOrderId) || filteredOrders[0] || null;
  }, [orders, selectedOrderId, filteredOrders]);

  const handleShipSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!shipModalOrder) return;
    setActionError(null);

    const res = transitionOrder(shipModalOrder.id, 'shipped', `Dispatched via ${courierName}`, {
      courierName,
      trackingRef,
    });

    if (res.success) {
      setShipModalOrder(null);
    } else {
      setActionError(res.error || 'Failed to dispatch order.');
    }
  };

  const handleCancelSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cancelModalOrder) return;
    setActionError(null);

    const res = transitionOrder(cancelModalOrder.id, 'cancelled', cancelReason);
    if (res.success) {
      setCancelModalOrder(null);
    } else {
      setActionError(res.error || 'Failed to cancel order.');
    }
  };

  const handleDeliverySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!deliveryModalOrder) return;
    setActionError(null);

    const res = transitionOrder(
      deliveryModalOrder.id,
      'delivered',
      `Rider confirmed delivery and collected Rs ${codAmountCollected.toLocaleString()} in cash`,
      { codCollected: codAmountCollected }
    );

    if (res.success) {
      setDeliveryModalOrder(null);
    } else {
      setActionError(res.error || 'Failed to complete delivery.');
    }
  };

  if (orders.length === 0) {
    return (
      <div className="space-y-6 text-[#1A1816]">
        <div className="border-b border-[#DED6CA] pb-4">
          <h1 className="font-display text-2xl sm:text-3xl font-medium tracking-tight text-[#1A1816]">
            Orders & Fulfillment
          </h1>
          <p className="text-xs text-[#685F54] mt-0.5">
            Manage Cash on Delivery orders, courier dispatch, and delivery confirmation.
          </p>
        </div>

        <div className="p-16 bg-[#FFFFFF] border border-[#DED6CA] rounded-xl text-center max-w-xl mx-auto shadow-2xs">
          <div className="w-16 h-16 rounded-full bg-[#FAF8F5] border border-[#DED6CA] text-[#8A7864] flex items-center justify-center mx-auto mb-4">
            <Package size={28} />
          </div>
          <h3 className="font-display text-2xl font-medium text-[#1A1816]">No Orders Placed Yet</h3>
          <p className="text-xs text-[#685F54] max-w-sm mx-auto mt-2 leading-relaxed">
            Customer checkout orders will appear here automatically with complete shipping addresses, verification statuses, and courier integration.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-[#1A1816]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#DED6CA] pb-4">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-medium tracking-tight text-[#1A1816]">
            Orders & Fulfillment
          </h1>
          <p className="text-xs text-[#685F54] mt-0.5">
            Strict status lifecycle for Cash on Delivery (COD) dispatch & tracking.
          </p>
        </div>

        {/* Global Search */}
        <div className="flex items-center gap-2 bg-[#FFFFFF] border border-[#DED6CA] rounded-lg px-3 py-1.5 text-xs shadow-2xs">
          <Search size={14} className="text-[#8A7864]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search order #, customer or phone..."
            className="bg-transparent border-none outline-none text-[#1A1816] placeholder-[#685F54]/50 w-48 sm:w-64"
          />
        </div>
      </div>

      {actionError && (
        <div className="p-3 bg-[#FAF8F5] border border-red-300 rounded-lg flex items-center gap-2 text-xs text-red-700">
          <AlertCircle size={15} className="text-red-600 shrink-0" />
          <span>{actionError}</span>
        </div>
      )}

      {/* Status Segment Filter Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        <Filter size={14} className="text-[#8A7864] shrink-0" />
        <div className="flex items-center gap-1.5">
          {[
            { id: 'all', label: 'All Orders' },
            { id: 'pending_confirmation', label: 'Pending Confirmation' },
            { id: 'confirmed', label: 'Confirmed' },
            { id: 'processing', label: 'Processing' },
            { id: 'packed', label: 'Packed' },
            { id: 'shipped', label: 'Shipped' },
            { id: 'delivered', label: 'Delivered' },
            { id: 'cancelled', label: 'Cancelled' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer whitespace-nowrap transition-colors ${
                statusFilter === tab.id
                  ? 'bg-[#1A1816] text-[#FAF8F5] shadow-2xs'
                  : 'bg-[#FFFFFF] border border-[#DED6CA] text-[#685F54] hover:text-[#1A1816]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid: Order List (Left) + Order Detail Workspace (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Orders List */}
        <div className="lg:col-span-5 bg-[#FFFFFF] rounded-xl border border-[#DED6CA] overflow-hidden shadow-2xs">
          <div className="p-3.5 border-b border-[#DED6CA] bg-[#FAF8F5] flex justify-between text-xs font-semibold uppercase tracking-wider text-[#8A7864]">
            <span>Orders Queue ({filteredOrders.length})</span>
            <span>Status</span>
          </div>

          <div className="divide-y divide-[#DED6CA]/60 max-h-[600px] overflow-y-auto">
            {filteredOrders.length > 0 ? (
              filteredOrders.map((ord) => {
                const isSelected = activeOrder?.id === ord.id;
                const totalVal = ord.totals?.total || ord.totalAmount || 0;
                return (
                  <div
                    key={ord.id}
                    onClick={() => setSelectedOrderId(ord.id)}
                    className={`p-3.5 transition-colors cursor-pointer text-xs space-y-1.5 ${
                      isSelected ? 'bg-[#FAF8F5] border-l-4 border-[#1A1816]' : 'hover:bg-[#FAF8F5]/60'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-semibold text-[#1A1816]">{ord.orderNumber}</span>
                      <span className="px-2 py-0.5 text-[10px] font-semibold uppercase rounded-full bg-[#FFFFFF] text-[#685F54] border border-[#DED6CA]">
                        {ord.status.replace(/_/g, ' ')}
                      </span>
                    </div>

                    <div className="flex justify-between text-[#685F54]">
                      <span>{ord.customer?.name} · {ord.shippingAddress?.city}</span>
                      <span className="font-semibold text-[#1A1816] tabular-nums">
                        Rs {totalVal.toLocaleString()}
                      </span>
                    </div>

                    <div className="text-[10px] text-[#8A7864]">
                      {new Date(ord.placedAt || ord.createdAt || Date.now()).toLocaleString('en-PK', { timeZone: 'Asia/Karachi' })} PKT
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="p-8 text-center text-xs text-[#685F54]">No orders matching criteria.</div>
            )}
          </div>
        </div>

        {/* Right Column: Order Detail & Action Workspace */}
        <div className="lg:col-span-7 bg-[#FFFFFF] rounded-xl border border-[#DED6CA] p-5 space-y-5 shadow-2xs">
          {activeOrder ? (
            <>
              {/* Order Detail Header */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#DED6CA] pb-4">
                <div>
                  <span className="text-[10px] font-mono text-[#8A7864] uppercase tracking-wider">Order Detail</span>
                  <h3 className="font-mono text-xl font-bold text-[#1A1816]">{activeOrder.orderNumber}</h3>
                  <span className="text-xs text-[#685F54]">
                    Placed {new Date(activeOrder.placedAt || activeOrder.createdAt || Date.now()).toLocaleString('en-PK', { timeZone: 'Asia/Karachi' })} PKT
                  </span>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-[#8A7864] block">Payment Method</span>
                  <span className="px-2.5 py-1 bg-[#FAF8F5] border border-[#DED6CA] text-[#1A1816] rounded-md text-xs font-semibold uppercase">
                    COD ({activeOrder.paymentStatus || 'cod_awaiting'})
                  </span>
                </div>
              </div>

              {/* Action Buttons based on status */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                {(activeOrder.status === 'pending_confirmation' || (activeOrder.status as string) === 'pending') && (
                  <button
                    onClick={() => transitionOrder(activeOrder.id, 'confirmed', 'Confirmed by admin via phone call')}
                    className="px-4 py-2 bg-[#1A1816] hover:bg-[#332E27] text-[#FAF8F5] font-semibold text-xs uppercase tracking-wider rounded-lg cursor-pointer transition-all flex items-center gap-1.5 shadow-2xs"
                  >
                    <CheckCircle size={14} />
                    <span>Confirm Order</span>
                  </button>
                )}

                {activeOrder.status === 'confirmed' && (
                  <button
                    onClick={() => transitionOrder(activeOrder.id, 'processing', 'Order routed to cutting & packing queue')}
                    className="px-4 py-2 bg-[#1A1816] hover:bg-[#332E27] text-[#FAF8F5] font-semibold text-xs uppercase tracking-wider rounded-lg cursor-pointer transition-all flex items-center gap-1.5 shadow-2xs"
                  >
                    <Clock size={14} />
                    <span>Begin Processing</span>
                  </button>
                )}

                {activeOrder.status === 'processing' && (
                  <button
                    onClick={() => transitionOrder(activeOrder.id, 'packed', 'Fabrics inspected, measured and bagged')}
                    className="px-4 py-2 bg-[#1A1816] hover:bg-[#332E27] text-[#FAF8F5] font-semibold text-xs uppercase tracking-wider rounded-lg cursor-pointer transition-all flex items-center gap-1.5 shadow-2xs"
                  >
                    <Package size={14} />
                    <span>Mark as Packed</span>
                  </button>
                )}

                {activeOrder.status === 'packed' && (
                  <button
                    onClick={() => setShipModalOrder(activeOrder)}
                    className="px-4 py-2 bg-[#1A1816] hover:bg-[#332E27] text-[#FAF8F5] font-semibold text-xs uppercase tracking-wider rounded-lg cursor-pointer transition-all flex items-center gap-1.5 shadow-2xs"
                  >
                    <Truck size={14} />
                    <span>Dispatch to Courier</span>
                  </button>
                )}

                {activeOrder.status === 'shipped' && (
                  <button
                    onClick={() => {
                      setDeliveryModalOrder(activeOrder);
                      setCodAmountCollected(activeOrder.totals?.total || activeOrder.totalAmount || 0);
                    }}
                    className="px-4 py-2 bg-[#1A1816] hover:bg-[#332E27] text-[#FAF8F5] font-semibold text-xs uppercase tracking-wider rounded-lg cursor-pointer transition-all flex items-center gap-1.5 shadow-2xs"
                  >
                    <CheckCircle size={14} />
                    <span>Record Cash Delivered</span>
                  </button>
                )}

                {/* Cancel Option */}
                {['pending_confirmation', 'pending', 'confirmed', 'processing'].includes(activeOrder.status) && (
                  <button
                    onClick={() => setCancelModalOrder(activeOrder)}
                    className="px-3.5 py-2 bg-[#FFFFFF] text-red-700 border border-red-200 font-semibold text-xs uppercase tracking-wider rounded-lg cursor-pointer hover:bg-red-50 flex items-center gap-1"
                  >
                    <XCircle size={14} />
                    <span>Cancel Order</span>
                  </button>
                )}
              </div>

              {/* Recipient Details */}
              <div className="p-4 bg-[#FAF8F5] border border-[#DED6CA] rounded-xl space-y-1.5 text-xs">
                <span className="font-semibold text-[#8A7864] uppercase text-[10px] tracking-wider block">
                  Customer & Shipping Address
                </span>
                <p className="font-semibold text-[#1A1816]">
                  {activeOrder.customer?.name} ·{' '}
                  <span className="font-mono text-[#8A7864]">{activeOrder.customer?.phone}</span>
                </p>
                <p className="text-[#685F54]">
                  {activeOrder.shippingAddress?.line1}, {activeOrder.shippingAddress?.city}, {activeOrder.shippingAddress?.province}
                </p>
                {activeOrder.shippingAddress?.instructions && (
                  <p className="text-[#8A7864] text-[11px]">Instructions: {activeOrder.shippingAddress.instructions}</p>
                )}
              </div>

              {/* Items List */}
              <div className="space-y-2">
                <span className="font-semibold text-[#8A7864] uppercase text-xs tracking-wider block">Order Items</span>
                <div className="space-y-1.5">
                  {activeOrder.items?.map((it) => (
                    <div
                      key={it.id || it.productId}
                      className="p-3 bg-[#FAF8F5] border border-[#DED6CA] rounded-lg flex justify-between items-center text-xs"
                    >
                      <div>
                        <p className="font-medium text-[#1A1816]">{it.name}</p>
                        <p className="text-[11px] text-[#685F54]">
                          {it.size ? `Cut: ${it.size} · ` : ''}Qty {it.quantity}
                        </p>
                      </div>
                      <span className="font-mono text-[#1A1816] font-semibold">
                        Rs {(it.lineTotal || (it.unitPrice * it.quantity)).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total Summary */}
              <div className="p-3.5 bg-[#FAF8F5] border border-[#DED6CA] rounded-xl flex justify-between items-center font-mono text-sm font-semibold">
                <span className="text-[#685F54]">Total Payable (Cash on Delivery):</span>
                <span className="text-[#1A1816] text-base">
                  Rs {(activeOrder.totals?.total || activeOrder.totalAmount || 0).toLocaleString()}
                </span>
              </div>
            </>
          ) : (
            <div className="p-8 text-center text-xs text-[#685F54]">Select an order to view dispatch details.</div>
          )}
        </div>
      </div>

      {/* Dispatch Modal */}
      {shipModalOrder && (
        <div className="fixed inset-0 z-60 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleShipSubmit}
            className="bg-[#FFFFFF] border border-[#DED6CA] text-[#1A1816] rounded-xl max-w-sm w-full p-6 space-y-4 shadow-xl"
          >
            <h4 className="font-semibold text-sm uppercase tracking-wide text-[#1A1816]">
              Courier Dispatch #{shipModalOrder.orderNumber}
            </h4>
            <div>
              <label className="block text-xs font-semibold text-[#685F54] mb-1">Select Courier Partner</label>
              <select
                value={courierName}
                onChange={(e) => setCourierName(e.target.value)}
                className="w-full text-xs bg-[#FAF8F5] border border-[#DED6CA] text-[#1A1816] rounded-lg p-2.5"
              >
                <option value="Trax Logistics">Trax Logistics</option>
                <option value="Call Courier">Call Courier</option>
                <option value="TCS Express">TCS Express</option>
                <option value="Leopards Courier">Leopards Courier</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#685F54] mb-1">Airway Bill / Tracking Ref</label>
              <input
                type="text"
                required
                value={trackingRef}
                onChange={(e) => setTrackingRef(e.target.value)}
                placeholder="e.g. TRX-992102"
                className="w-full text-xs bg-[#FAF8F5] border border-[#DED6CA] text-[#1A1816] rounded-lg p-2.5 font-mono uppercase"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShipModalOrder(null)}
                className="px-3 py-1.5 text-xs text-[#685F54] border border-[#DED6CA] rounded-lg cursor-pointer hover:bg-[#FAF8F5]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 text-xs font-semibold text-[#FAF8F5] bg-[#1A1816] rounded-lg hover:bg-[#332E27] cursor-pointer"
              >
                Confirm Dispatch
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Delivery Confirmation Modal */}
      {deliveryModalOrder && (
        <div className="fixed inset-0 z-60 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleDeliverySubmit}
            className="bg-[#FFFFFF] border border-[#DED6CA] text-[#1A1816] rounded-xl max-w-sm w-full p-6 space-y-4 shadow-xl"
          >
            <h4 className="font-semibold text-sm uppercase tracking-wide text-[#1A1816]">
              Confirm Delivery #{deliveryModalOrder.orderNumber}
            </h4>
            <div>
              <label className="block text-xs font-semibold text-[#685F54] mb-1">Cash Collected (PKR)</label>
              <input
                type="number"
                required
                value={codAmountCollected}
                onChange={(e) => setCodAmountCollected(Number(e.target.value))}
                className="w-full text-xs bg-[#FAF8F5] border border-[#DED6CA] text-[#1A1816] rounded-lg p-2.5 font-mono"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeliveryModalOrder(null)}
                className="px-3 py-1.5 text-xs text-[#685F54] border border-[#DED6CA] rounded-lg cursor-pointer hover:bg-[#FAF8F5]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 text-xs font-semibold text-[#FAF8F5] bg-[#1A1816] rounded-lg hover:bg-[#332E27] cursor-pointer"
              >
                Confirm Delivery
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Cancel Modal */}
      {cancelModalOrder && (
        <div className="fixed inset-0 z-60 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleCancelSubmit}
            className="bg-[#FFFFFF] border border-[#DED6CA] text-[#1A1816] rounded-xl max-w-sm w-full p-6 space-y-4 shadow-xl"
          >
            <h4 className="font-semibold text-sm uppercase text-red-700">Cancel Order #{cancelModalOrder.orderNumber}</h4>
            <p className="text-xs text-[#685F54]">Fabric yardage will be released back to active stock.</p>
            <div>
              <label className="block text-xs font-semibold text-[#685F54] mb-1">Cancellation Reason</label>
              <select
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="w-full text-xs bg-[#FAF8F5] border border-[#DED6CA] text-[#1A1816] rounded-lg p-2.5"
              >
                <option value="Customer unreachable for phone confirmation">Customer unreachable for phone confirmation</option>
                <option value="Customer requested cancellation via phone">Customer requested cancellation via phone</option>
                <option value="Invalid address or unserviceable pincode">Invalid address or unserviceable pincode</option>
                <option value="Duplicate order placed">Duplicate order placed</option>
              </select>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setCancelModalOrder(null)}
                className="px-3 py-1.5 text-xs text-[#685F54] border border-[#DED6CA] rounded-lg cursor-pointer hover:bg-[#FAF8F5]"
              >
                Keep Order
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 text-xs font-semibold text-white bg-red-700 rounded-lg hover:bg-red-800 cursor-pointer"
              >
                Confirm Cancellation
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
