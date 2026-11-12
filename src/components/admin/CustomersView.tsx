/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import {
  Users,
  Search,
  Phone,
  Mail,
  MapPin,
  CheckCircle2,
  Clock,
  Eye,
  EyeOff,
  Plus,
  MessageSquare,
  ShieldAlert,
  Coins,
  ShoppingBag,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext.tsx';
import { CustomerRecord } from '../../types/index.ts';

export const CustomersView: React.FC = () => {
  const { customers, addCustomerNote, currentUser } = useStore();
  const [search, setSearch] = useState('');
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
  const [unmaskedIds, setUnmaskedIds] = useState<Set<string>>(new Set());
  const [newNoteText, setNewNoteText] = useState('');

  const canUnmaskPII = currentUser.role === 'owner' || currentUser.role === 'order_manager';

  const filteredCustomers = useMemo(() => {
    return customers.filter((c) => {
      if (!search.trim()) return true;
      const q = search.toLowerCase();
      return (
        c.name.toLowerCase().includes(q) ||
        c.phone.includes(q) ||
        c.city.toLowerCase().includes(q) ||
        (c.email && c.email.toLowerCase().includes(q))
      );
    });
  }, [customers, search]);

  const activeCustomer = useMemo(() => {
    return customers.find((c) => c.id === selectedCustomerId) || filteredCustomers[0] || null;
  }, [customers, selectedCustomerId, filteredCustomers]);

  const toggleMask = (id: string) => {
    if (!canUnmaskPII) return;
    setUnmaskedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const maskPhone = (phone: string, id: string) => {
    if (unmaskedIds.has(id)) return phone;
    if (phone.length > 7) {
      return phone.slice(0, 5) + '***' + phone.slice(-4);
    }
    return '***-*******';
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeCustomer || !newNoteText.trim()) return;
    addCustomerNote(activeCustomer.id, newNoteText.trim());
    setNewNoteText('');
  };

  if (customers.length === 0) {
    return (
      <div className="space-y-6 text-[#F5F5F5]">
        <div className="border-b border-[#3A3323] pb-4">
          <h2 className="font-display text-2xl font-bold tracking-tight text-[#F5F5F5] flex items-center gap-2">
            <Users size={24} className="text-[#D4AF37]" />
            <span>Customer Profiles & CRM</span>
          </h2>
          <p className="text-xs text-[#B5B5B5]">
            Verified customer records, purchase histories, and support audit notes.
          </p>
        </div>

        <div className="p-16 bg-[#171717] border border-[#3A3323] rounded-lg text-center max-w-xl mx-auto shadow-xl">
          <div className="w-16 h-16 rounded-full bg-[#202020] border border-[#3A3323] text-[#D4AF37] flex items-center justify-center mx-auto mb-4">
            <Users size={28} />
          </div>
          <h3 className="font-display text-2xl font-bold uppercase text-[#F5F5F5]">
            No Customers Yet
          </h3>
          <p className="text-xs text-[#B5B5B5] max-w-sm mx-auto mt-2 leading-relaxed">
            Client profiles with order histories, lifetime spending calculations, and delivery destinations will generate automatically as real checkouts occur.
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
            <Users size={24} className="text-[#D4AF37]" />
            <span>Customer Profiles & CRM</span>
          </h2>
          <p className="text-xs text-[#B5B5B5]">
            Track customer lifetime spend (PKR), loyalty points balance, verified phones, and staff support notes.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A88732]" />
          <input
            type="text"
            placeholder="Search name, phone, city..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-[#171717] border border-[#3A3323] text-[#F5F5F5] rounded text-xs placeholder-[#B5B5B5]/50 focus:outline-none focus:border-[#D4AF37]"
          />
        </div>
      </div>

      {/* Grid: Customer List (Left) + Customer Details (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Customer List */}
        <div className="lg:col-span-5 bg-[#171717] rounded border border-[#3A3323] overflow-hidden">
          <div className="p-3 bg-[#090909] border-b border-[#3A3323] flex justify-between items-center text-xs font-bold uppercase text-[#A88732]">
            <span>Client Registry ({filteredCustomers.length})</span>
            <span>Total Spent</span>
          </div>

          <div className="divide-y divide-[#3A3323] max-h-[600px] overflow-y-auto">
            {filteredCustomers.map((c) => {
              const isSelected = activeCustomer?.id === c.id;
              return (
                <div
                  key={c.id}
                  onClick={() => setSelectedCustomerId(c.id)}
                  className={`p-3.5 transition-colors cursor-pointer text-xs space-y-1 ${
                    isSelected ? 'bg-[#202020] border-l-4 border-[#D4AF37]' : 'hover:bg-[#202020]/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#F5F5F5]">{c.name}</span>
                    <span className="font-mono font-bold text-[#D4AF37]">
                      Rs {c.totalSpentPkr.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-[#B5B5B5] text-[11px]">
                    <span>{c.city}, {c.province}</span>
                    <span>{c.totalOrders} order(s)</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Customer Workspace */}
        <div className="lg:col-span-7 bg-[#171717] rounded border border-[#3A3323] p-5 space-y-5">
          {activeCustomer ? (
            <>
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#3A3323] pb-3">
                <div>
                  <h3 className="font-display text-xl font-bold uppercase text-[#F5F5F5]">{activeCustomer.name}</h3>
                  <span className="text-xs text-[#B5B5B5] flex items-center gap-1 mt-0.5">
                    <MapPin size={12} className="text-[#A88732]" />
                    <span>{activeCustomer.city}, {activeCustomer.province}</span>
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-[#D4AF37] bg-[#202020] px-2.5 py-1 rounded border border-[#3A3323]">
                    {maskPhone(activeCustomer.phone, activeCustomer.id)}
                  </span>
                  {canUnmaskPII && (
                    <button
                      onClick={() => toggleMask(activeCustomer.id)}
                      className="p-1 text-[#B5B5B5] hover:text-[#F5F5F5] cursor-pointer"
                      title={unmaskedIds.has(activeCustomer.id) ? 'Mask phone number' : 'Unmask phone number'}
                    >
                      {unmaskedIds.has(activeCustomer.id) ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  )}
                </div>
              </div>

              {/* Quick stats */}
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="p-3 bg-[#202020] rounded border border-[#3A3323]">
                  <span className="text-[10px] text-[#A88732] uppercase block">Lifetime Orders</span>
                  <span className="font-display text-xl font-bold text-[#F5F5F5]">{activeCustomer.totalOrders}</span>
                </div>
                <div className="p-3 bg-[#202020] rounded border border-[#3A3323]">
                  <span className="text-[10px] text-[#A88732] uppercase block">Total Spent (PKR)</span>
                  <span className="font-mono text-xl font-bold text-[#D4AF37]">
                    Rs {activeCustomer.totalSpentPkr.toLocaleString()}
                  </span>
                </div>
                <div className="p-3 bg-[#202020] rounded border border-[#3A3323]">
                  <span className="text-[10px] text-[#A88732] uppercase block">Club Points</span>
                  <span className="font-display text-xl font-bold text-[#F3E5C0]">{activeCustomer.loyaltyPoints}</span>
                </div>
              </div>

              {/* Support Notes */}
              <div className="space-y-3 pt-2">
                <span className="font-bold text-xs uppercase tracking-wider text-[#A88732] block">
                  Staff CRM & Delivery Notes ({activeCustomer.supportNotes?.length || 0})
                </span>

                <form onSubmit={handleAddNote} className="flex gap-2">
                  <input
                    type="text"
                    value={newNoteText}
                    onChange={(e) => setNewNoteText(e.target.value)}
                    placeholder="Add delivery instruction, preferred COD timing..."
                    className="flex-1 bg-[#090909] border border-[#3A3323] text-[#F5F5F5] rounded px-3 py-1.5 text-xs placeholder-[#B5B5B5]/40"
                  />
                  <button
                    type="submit"
                    className="px-3.5 py-1.5 bg-[#D4AF37] hover:bg-[#F3E5C0] text-[#090909] font-bold text-xs uppercase rounded cursor-pointer"
                  >
                    Add Note
                  </button>
                </form>

                <div className="space-y-2">
                  {activeCustomer.supportNotes && activeCustomer.supportNotes.length > 0 ? (
                    activeCustomer.supportNotes.map((note) => (
                      <div key={note.id} className="p-2.5 bg-[#202020] border border-[#3A3323] rounded text-xs space-y-0.5">
                        <div className="flex justify-between text-[10px] text-[#A88732]">
                          <span>{note.author} ({note.role})</span>
                          <span>{new Date(note.createdAt).toLocaleDateString()}</span>
                        </div>
                        <p className="text-[#F5F5F5]">{note.content}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-[#B5B5B5] italic">No support notes logged yet.</p>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="p-8 text-center text-xs text-[#B5B5B5]">Select a customer profile to inspect details.</div>
          )}
        </div>
      </div>
    </div>
  );
};
