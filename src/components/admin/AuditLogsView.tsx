/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ShieldAlert, Search, Clock, FileText } from 'lucide-react';
import { useStore } from '../../context/StoreContext.tsx';

export const AuditLogsView: React.FC = () => {
  const { auditLogs } = useStore();
  const [search, setSearch] = useState('');

  const filteredLogs = auditLogs.filter(
    (log) =>
      log.action.toLowerCase().includes(search.toLowerCase()) ||
      log.actor.name.toLowerCase().includes(search.toLowerCase()) ||
      log.entityType.toLowerCase().includes(search.toLowerCase()) ||
      log.entityId.toLowerCase().includes(search.toLowerCase()) ||
      (log.diff && log.diff.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div className="border-b border-[#3A3323] pb-4">
        <h1 className="font-display text-2xl md:text-3xl font-bold uppercase tracking-tight text-[#F5F5F5]">
          Security & Operation Audit Logs
        </h1>
        <p className="text-xs text-[#B5B5B5] mt-1">
          Append-only immutable record of all privileged staff actions, state machine transitions, and configuration edits.
        </p>
      </div>

      <div className="bg-[#171717] p-3.5 rounded border border-[#3A3323] flex items-center gap-2">
        <Search size={16} className="text-[#B5B5B5]" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Filter logs by actor, action type, entity, or diff..."
          className="w-full text-xs bg-transparent border-none outline-none focus:ring-0 text-[#F5F5F5] placeholder-[#B5B5B5]/50"
        />
      </div>

      {filteredLogs.length === 0 ? (
        <div className="bg-[#171717] rounded border border-[#3A3323] p-12 text-center">
          <div className="w-12 h-12 rounded-full bg-[#202020] border border-[#3A3323] flex items-center justify-center mx-auto mb-3 text-[#D4AF37]">
            <Clock size={20} />
          </div>
          <h3 className="font-display font-bold text-base uppercase text-[#F5F5F5]">
            No Audit Logs Yet
          </h3>
          <p className="text-xs text-[#B5B5B5] max-w-sm mx-auto mt-1">
            Privileged administrative actions, inventory adjustments, and status transitions will be permanently recorded here in real time.
          </p>
        </div>
      ) : (
        <div className="bg-[#171717] rounded border border-[#3A3323] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs tabular-nums">
              <thead className="bg-[#202020] uppercase text-[10px] text-[#D4AF37] tracking-wider border-b border-[#3A3323]">
                <tr>
                  <th className="p-3">Timestamp (PKT)</th>
                  <th className="p-3">Staff Actor</th>
                  <th className="p-3">Action Type</th>
                  <th className="p-3">Entity Type & ID</th>
                  <th className="p-3">Change Summary</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#3A3323] font-mono text-[11px]">
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-[#202020]/50 transition-colors">
                    <td className="p-3 text-[#B5B5B5] whitespace-nowrap">
                      {new Date(log.createdAt).toLocaleString('en-PK', { timeZone: 'Asia/Karachi' })}
                    </td>
                    <td className="p-3">
                      <span className="font-bold text-[#F5F5F5]">{log.actor.name}</span>
                      <span className="text-[10px] text-[#D4AF37] block uppercase">({log.actor.role})</span>
                    </td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 bg-[#202020] border border-[#3A3323] font-bold uppercase text-[#D4AF37] rounded text-[10px]">
                        {log.action}
                      </span>
                    </td>
                    <td className="p-3 text-[#B5B5B5]">
                      {log.entityType} <strong className="text-[#F5F5F5] font-mono">[{log.entityId}]</strong>
                    </td>
                    <td className="p-3 font-sans text-xs text-[#F5F5F5]">
                      {log.diff || 'Action committed.'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
