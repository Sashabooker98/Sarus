/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { RotateCcw, Check, X, ShieldAlert, ArrowRight } from 'lucide-react';
import { useStore } from '../../context/StoreContext.tsx';
import { ReturnRequest } from '../../types/index.ts';

export const ReturnsView: React.FC = () => {
  const { returns, updateReturnStatus } = useStore();

  const [selectedReturn, setSelectedReturn] = useState<ReturnRequest | null>(returns[0] || null);
  const [decisionNote, setDecisionNote] = useState('');

  const handleApprove = (r: ReturnRequest) => {
    updateReturnStatus(r.id, 'approved', decisionNote.trim() || 'Reverse pick-up authorized');
  };

  const handleReject = (r: ReturnRequest) => {
    updateReturnStatus(r.id, 'rejected', decisionNote.trim() || 'Return rejected: Outside policy window');
  };

  const handleResolve = (r: ReturnRequest) => {
    updateReturnStatus(r.id, 'resolved', 'Exchange garment dispatched to customer.');
  };

  if (returns.length === 0) {
    return (
      <div className="space-y-6 text-[#F5F5F5]">
        <div className="border-b border-[#3A3323] pb-4">
          <h1 className="font-display text-3xl font-bold uppercase tracking-tight text-[#F5F5F5]">
            Returns, Exchanges & Inspection Queue
          </h1>
          <p className="text-xs text-[#B5B5B5]">
            Manage 7-day exchange requests, doorstep reverse logistics, and quality inspections.
          </p>
        </div>

        <div className="p-16 bg-[#171717] border border-[#3A3323] rounded-lg text-center max-w-xl mx-auto shadow-xl">
          <div className="w-16 h-16 rounded-full bg-[#202020] border border-[#3A3323] text-[#D4AF37] flex items-center justify-center mx-auto mb-4">
            <RotateCcw size={28} />
          </div>
          <h3 className="font-display text-2xl font-bold uppercase text-[#F5F5F5]">
            No Return Requests Yet
          </h3>
          <p className="text-xs text-[#B5B5B5] max-w-sm mx-auto mt-2 leading-relaxed">
            Customer return requests submitted through the Client Portal or support channels will appear here for inspection and reverse pickup authorization.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-[#F5F5F5]">
      <div className="border-b border-[#3A3323] pb-4">
        <h1 className="font-display text-3xl font-bold uppercase tracking-tight text-[#F5F5F5]">
          Returns, Exchanges & Inspection Queue
        </h1>
        <p className="text-xs text-[#B5B5B5]">
          Evaluate customer 7-day return requests, inspect returned garments, and complete resolutions.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Returns List */}
        <div className="lg:col-span-5 bg-[#171717] rounded border border-[#3A3323] overflow-hidden">
          <div className="p-3 bg-[#090909] border-b border-[#3A3323] font-bold text-xs uppercase text-[#A88732]">
            Active Requests ({returns.length})
          </div>

          <div className="divide-y divide-[#3A3323]">
            {returns.map((r) => (
              <div
                key={r.id}
                onClick={() => setSelectedReturn(r)}
                className={`p-3.5 text-xs space-y-1 cursor-pointer transition-colors ${
                  selectedReturn?.id === r.id ? 'bg-[#202020] border-l-4 border-[#D4AF37]' : 'hover:bg-[#202020]/50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-[#D4AF37]">{r.orderNumber}</span>
                  <span className="px-2 py-0.5 bg-[#D4AF37] text-[#090909] font-bold uppercase text-[10px] rounded">
                    {r.status}
                  </span>
                </div>
                <p className="font-bold text-[#F5F5F5]">{r.customerName}</p>
                <p className="text-[#B5B5B5] text-[11px]">{r.customerPhone}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Return Details */}
        <div className="lg:col-span-7 bg-[#171717] rounded border border-[#3A3323] p-5 space-y-4">
          {selectedReturn ? (
            <>
              <div className="border-b border-[#3A3323] pb-3">
                <span className="font-mono text-xs text-[#A88732] uppercase">Return Audit File</span>
                <h3 className="font-display text-xl font-bold uppercase text-[#F5F5F5]">
                  Order #{selectedReturn.orderNumber}
                </h3>
              </div>

              <div className="space-y-2 text-xs">
                <p><strong className="text-[#F5F5F5]">Customer:</strong> {selectedReturn.customerName} ({selectedReturn.customerPhone})</p>
                <p><strong className="text-[#F5F5F5]">Resolution Type:</strong> {selectedReturn.resolutionType}</p>
                <p><strong className="text-[#F5F5F5]">Current Status:</strong> {selectedReturn.status}</p>
              </div>

              {selectedReturn.status === 'requested' && (
                <div className="pt-3 border-t border-[#3A3323] flex gap-2">
                  <button
                    onClick={() => handleApprove(selectedReturn)}
                    className="px-3.5 py-1.5 bg-[#D4AF37] text-[#090909] font-bold text-xs uppercase rounded hover:bg-[#F3E5C0] cursor-pointer"
                  >
                    Approve Reverse Pick-Up
                  </button>
                  <button
                    onClick={() => handleReject(selectedReturn)}
                    className="px-3 py-1.5 bg-red-950/60 border border-red-800/40 text-red-400 font-bold text-xs uppercase rounded cursor-pointer"
                  >
                    Reject
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="p-8 text-center text-xs text-[#B5B5B5]">Select a request to inspect details.</div>
          )}
        </div>
      </div>
    </div>
  );
};
