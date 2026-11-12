/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, Lock, ShieldCheck, ArrowRight, AlertCircle, KeyRound, Loader2 } from 'lucide-react';
import { useStore } from '../../context/StoreContext.tsx';

export const AdminLoginModal: React.FC = () => {
  const {
    isAdminLoginModalOpen,
    setIsAdminLoginModalOpen,
    adminLogin,
    setIsAdminMode,
  } = useStore();

  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  if (!isAdminLoginModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim() || isLoading) return;
    setError(null);
    setIsLoading(true);

    try {
      const result = await adminLogin(password);
      if (result.success) {
        setIsAdminLoginModalOpen(false);
        setIsAdminMode(true);
        setPassword('');
      } else if (result.status === 429) {
        setError('Too many attempts, try again later');
      } else {
        setError('Incorrect password');
      }
    } catch {
      setError('Incorrect password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="admin-login-title"
      className="fixed inset-0 z-50 overflow-y-auto bg-[#1A1816]/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md bg-[#FFFFFF] border border-[#DED6CA] rounded-xl shadow-2xl overflow-hidden relative"
      >
        {/* Subtle Botanical Header Band */}
        <div className="h-1 bg-gradient-to-r from-[#DED6CA] via-[#8A7864] to-[#DED6CA]" />

        {/* Header */}
        <div className="p-6 pb-4 border-b border-[#DED6CA] flex items-center justify-between bg-[#FAF8F5]">
          <div className="flex items-center gap-3">
            <img
              src="/assets/aistudio/SARUS_Premium_Fabrics_Logo-removebg-preview_2b5db1d0.png"
              alt="SARUS Premium Fabrics"
              className="h-10 w-auto object-contain"
            />
            <div className="border-l border-[#DED6CA] pl-3">
              <span className="text-[10px] tracking-widest text-[#8A7864] uppercase block font-medium">
                Admin Security
              </span>
              <h2
                id="admin-login-title"
                className="font-display text-lg font-normal tracking-tight text-[#1A1816]"
              >
                Owner Portal Access
              </h2>
            </div>
          </div>
          <button
            onClick={() => setIsAdminLoginModalOpen(false)}
            className="p-1.5 text-[#8A7864] hover:text-[#1A1816] hover:bg-[#EFE8DC] rounded-full transition-colors cursor-pointer"
            aria-label="Close admin login modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 bg-[#FAF8F5]">
          <div className="p-3.5 bg-[#FFFFFF] border border-[#DED6CA] rounded-xl text-xs text-[#685F54] space-y-1 shadow-xs">
            <div className="flex items-center gap-1.5 font-semibold text-[#1A1816]">
              <ShieldCheck size={14} className="text-[#8A7864]" />
              <span>SARUS Commercial Back-Office</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              Manage unstitched catalog, upload photography, update yardage stock, and monitor nationwide COD orders.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="admin-password-input"
                className="block text-xs font-semibold text-[#1A1816] uppercase tracking-wider mb-1.5"
              >
                Admin Password
              </label>
              <div className="relative">
                <input
                  id="admin-password-input"
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (error) setError(null);
                  }}
                  placeholder="Enter administrator password"
                  disabled={isLoading}
                  className="w-full bg-[#FFFFFF] border border-[#DED6CA] rounded-lg px-3 py-2.5 text-sm text-[#1A1816] placeholder-[#A09586] focus:outline-none focus:border-[#1A1816] font-mono tracking-widest disabled:opacity-50"
                  autoFocus
                />
                <KeyRound
                  size={16}
                  className="absolute right-3 top-3 text-[#8A7864] pointer-events-none"
                />
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-xs text-red-700">
                <AlertCircle size={15} className="shrink-0 text-red-600" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading || !password.trim()}
              className="w-full py-3 bg-[#1A1816] hover:bg-[#332E27] text-[#FAF8F5] font-medium text-xs uppercase tracking-widest rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 size={14} className="animate-spin text-[#FAF8F5]" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <span>Unlock Admin Portal</span>
                  <ArrowRight size={14} />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
