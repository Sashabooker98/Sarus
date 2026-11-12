/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Settings, ShieldCheck, AlertCircle, Save, Check, Phone, MessageSquare, MapPin, Mail, Truck, Lock, KeyRound, Database, Download } from 'lucide-react';
import { useStore } from '../../context/StoreContext.tsx';

export const SettingsView: React.FC = () => {
  const { settings, updateSettings } = useStore();

  const [storeName, setStoreName] = useState(settings.storeName || 'SARUS Clothes');
  const [orderPrefix, setOrderPrefix] = useState(settings.orderPrefix || 'SC-');
  const [ownerName, setOwnerName] = useState(settings.ownerName || 'Suleman Sarwar');
  const [freeThreshold, setFreeThreshold] = useState<number | ''>(settings.freeShippingThreshold ?? 3500);
  const [defaultFee, setDefaultFee] = useState<number | ''>(settings.defaultShippingFee ?? 190);
  const [returnDays, setReturnDays] = useState<number | ''>(settings.returnWindowDays ?? 7);

  // Business contact fields
  const [phone, setPhone] = useState(settings.phone || '0326-3512202');
  const [whatsappNumber, setWhatsappNumber] = useState(settings.whatsappNumber || '0326-3512202');
  const [emailAddress, setEmailAddress] = useState(settings.emailAddress || '');
  const [storeAddress, setStoreAddress] = useState(
    settings.storeAddress || 'Sadiqabad Tibbi Wighawar, Near Madni Masjid, Sadiqabad, Punjab, Pakistan'
  );
  const [bannerEnabled, setBannerEnabled] = useState(settings.bannerEnabled !== false);
  const [bannerText, setBannerText] = useState(settings.bannerText || 'CRAFTED WITH CARE · MADE TO INSPIRE');
  const [bannerSubtext, setBannerSubtext] = useState(settings.bannerSubtext || 'CASH ON DELIVERY NATIONWIDE');

  const [saveSuccess, setSaveSuccess] = useState(false);

  // Password change state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordNotice, setPasswordNotice] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      ...settings,
      storeName: storeName.trim(),
      ownerName: ownerName.trim(),
      orderPrefix: orderPrefix.trim(),
      freeShippingThreshold: freeThreshold === '' ? 3500 : Number(freeThreshold),
      defaultShippingFee: defaultFee === '' ? 190 : Number(defaultFee),
      returnWindowDays: returnDays === '' ? 7 : Number(returnDays),
      phone: phone.trim(),
      whatsappNumber: whatsappNumber.trim(),
      emailAddress: emailAddress.trim(),
      storeAddress: storeAddress.trim(),
      bannerEnabled,
      bannerText: bannerText.trim(),
      bannerSubtext: bannerSubtext.trim(),
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordNotice(null);

    if (!currentPassword) {
      setPasswordNotice({ type: 'error', message: 'Current password is required.' });
      return;
    }
    if (newPassword.length < 6) {
      setPasswordNotice({ type: 'error', message: 'New password must be at least 6 characters.' });
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordNotice({ type: 'error', message: 'New password and confirmation do not match.' });
      return;
    }

    setIsChangingPassword(true);
    try {
      const res = await fetch('/api/admin/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setPasswordNotice({ type: 'success', message: 'Admin password changed successfully!' });
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setPasswordNotice({ type: 'error', message: data.error || 'Failed to change password.' });
      }
    } catch {
      setPasswordNotice({ type: 'error', message: 'Connection error while updating password.' });
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <div className="space-y-6 text-[#1A1816]">
      <div className="border-b border-[#DED6CA] pb-4">
        <h1 className="font-display text-2xl sm:text-3xl font-medium tracking-tight text-[#1A1816]">
          Store Settings & Configuration
        </h1>
        <p className="text-xs text-[#685F54] mt-0.5">
          Manage brand details, genuine business contact records, delivery charges, and admin security.
        </p>
      </div>

      {saveSuccess && (
        <div className="p-3 bg-[#FAF8F5] border border-[#8A7864] text-[#1A1816] rounded-xl text-xs font-medium flex items-center gap-2 shadow-2xs">
          <Check size={16} className="text-[#8A7864]" />
          <span>Store configuration and business records saved successfully.</span>
        </div>
      )}

      {/* Main Settings Form */}
      <form onSubmit={handleSave} className="space-y-6">
        {/* Brand & Store Identity */}
        <div className="p-5 bg-[#FFFFFF] rounded-xl border border-[#DED6CA] space-y-4 shadow-2xs">
          <div className="border-b border-[#DED6CA] pb-2 flex justify-between items-center">
            <h3 className="font-semibold text-xs uppercase tracking-wider text-[#1A1816]">
              Store & Owner Identity
            </h3>
            <span className="text-[10px] text-[#8A7864] font-mono">Authoritative Brand Details</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#685F54] mb-1">Store Name</label>
              <input
                type="text"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                className="w-full bg-[#FAF8F5] border border-[#DED6CA] text-[#1A1816] rounded-lg p-2.5 text-xs font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#685F54] mb-1">Proprietor / Owner</label>
              <input
                type="text"
                value={ownerName}
                onChange={(e) => setOwnerName(e.target.value)}
                className="w-full bg-[#FAF8F5] border border-[#DED6CA] text-[#1A1816] rounded-lg p-2.5 text-xs font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#685F54] mb-1">Order Number Prefix</label>
              <input
                type="text"
                value={orderPrefix}
                onChange={(e) => setOrderPrefix(e.target.value)}
                className="w-full bg-[#FAF8F5] border border-[#DED6CA] text-[#1A1816] rounded-lg p-2.5 text-xs font-mono"
              />
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="p-5 bg-[#FFFFFF] rounded-xl border border-[#DED6CA] space-y-4 shadow-2xs">
          <div className="border-b border-[#DED6CA] pb-2 flex justify-between items-center">
            <h3 className="font-semibold text-xs uppercase tracking-wider text-[#1A1816]">
              Business Contact Records
            </h3>
            <span className="text-[10px] text-[#8A7864] font-mono">Rendered on live footer & concierge</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#685F54] mb-1 flex items-center gap-1.5">
                <Phone size={13} className="text-[#8A7864]" />
                <span>Helpline / Telephone</span>
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="0326-3512202"
                className="w-full bg-[#FAF8F5] border border-[#DED6CA] text-[#1A1816] rounded-lg p-2.5 text-xs font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#685F54] mb-1 flex items-center gap-1.5">
                <MessageSquare size={13} className="text-[#8A7864]" />
                <span>WhatsApp Concierge</span>
              </label>
              <input
                type="text"
                value={whatsappNumber}
                onChange={(e) => setWhatsappNumber(e.target.value)}
                placeholder="0326-3512202"
                className="w-full bg-[#FAF8F5] border border-[#DED6CA] text-[#1A1816] rounded-lg p-2.5 text-xs font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#685F54] mb-1 flex items-center gap-1.5">
                <Mail size={13} className="text-[#8A7864]" />
                <span>Business Email (Optional)</span>
              </label>
              <input
                type="email"
                value={emailAddress}
                onChange={(e) => setEmailAddress(e.target.value)}
                placeholder="Leave blank if not configured"
                className="w-full bg-[#FAF8F5] border border-[#DED6CA] text-[#1A1816] rounded-lg p-2.5 text-xs placeholder-[#685F54]/40"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#685F54] mb-1 flex items-center gap-1.5">
                <MapPin size={13} className="text-[#8A7864]" />
                <span>Physical Store Address</span>
              </label>
              <input
                type="text"
                value={storeAddress}
                onChange={(e) => setStoreAddress(e.target.value)}
                className="w-full bg-[#FAF8F5] border border-[#DED6CA] text-[#1A1816] rounded-lg p-2.5 text-xs"
              />
            </div>
          </div>
        </div>

        {/* Shipping & Delivery Charges */}
        <div className="p-5 bg-[#FFFFFF] rounded-xl border border-[#DED6CA] space-y-4 shadow-2xs">
          <div className="border-b border-[#DED6CA] pb-2">
            <h3 className="font-semibold text-xs uppercase tracking-wider text-[#1A1816] flex items-center gap-2">
              <Truck size={15} className="text-[#8A7864]" />
              <span>Delivery Charges & Shipping Thresholds</span>
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#685F54] mb-1">Standard Delivery Fee (PKR)</label>
              <input
                type="number"
                value={defaultFee}
                onChange={(e) => setDefaultFee(e.target.value === '' ? '' : Number(e.target.value))}
                className="w-full bg-[#FAF8F5] border border-[#DED6CA] text-[#1A1816] rounded-lg p-2.5 text-xs font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#685F54] mb-1">Free Delivery Threshold (PKR)</label>
              <input
                type="number"
                value={freeThreshold}
                onChange={(e) => setFreeThreshold(e.target.value === '' ? '' : Number(e.target.value))}
                className="w-full bg-[#FAF8F5] border border-[#DED6CA] text-[#1A1816] rounded-lg p-2.5 text-xs font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#685F54] mb-1">Exchange Window (Days)</label>
              <input
                type="number"
                value={returnDays}
                onChange={(e) => setReturnDays(e.target.value === '' ? '' : Number(e.target.value))}
                className="w-full bg-[#FAF8F5] border border-[#DED6CA] text-[#1A1816] rounded-lg p-2.5 text-xs font-mono"
              />
            </div>
          </div>
        </div>

        {/* Announcement Bar */}
        <div className="p-5 bg-[#FFFFFF] rounded-xl border border-[#DED6CA] space-y-4 shadow-2xs">
          <div className="border-b border-[#DED6CA] pb-2 flex justify-between items-center">
            <h3 className="font-semibold text-xs uppercase tracking-wider text-[#1A1816]">
              Storefront Announcement Bar
            </h3>
            <label className="flex items-center gap-2 text-xs cursor-pointer text-[#685F54]">
              <input
                type="checkbox"
                checked={bannerEnabled}
                onChange={(e) => setBannerEnabled(e.target.checked)}
                className="rounded border-[#DED6CA] text-[#1A1816] focus:ring-0"
              />
              <span>Enable Announcement Bar</span>
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#685F54] mb-1">Primary Banner Text</label>
              <input
                type="text"
                value={bannerText}
                onChange={(e) => setBannerText(e.target.value)}
                placeholder="CRAFTED WITH CARE · MADE TO INSPIRE"
                className="w-full bg-[#FAF8F5] border border-[#DED6CA] text-[#1A1816] rounded-lg p-2.5 text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#685F54] mb-1">Subtext / Details</label>
              <input
                type="text"
                value={bannerSubtext}
                onChange={(e) => setBannerSubtext(e.target.value)}
                placeholder="CASH ON DELIVERY NATIONWIDE"
                className="w-full bg-[#FAF8F5] border border-[#DED6CA] text-[#1A1816] rounded-lg p-2.5 text-xs"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-3 bg-[#1A1816] hover:bg-[#332E27] text-[#FAF8F5] font-semibold text-xs uppercase tracking-widest rounded-lg transition-all cursor-pointer shadow-sm flex items-center gap-2"
          >
            <Save size={15} />
            <span>Save Store Settings</span>
          </button>
        </div>
      </form>

      {/* Admin Password Security Form */}
      <div className="p-5 bg-[#FFFFFF] rounded-xl border border-[#DED6CA] space-y-4 shadow-2xs mt-8">
        <div className="border-b border-[#DED6CA] pb-2 flex justify-between items-center">
          <h3 className="font-semibold text-xs uppercase tracking-wider text-[#1A1816] flex items-center gap-2">
            <KeyRound size={15} className="text-[#8A7864]" />
            <span>Change Admin Password</span>
          </h3>
          <span className="text-[10px] text-[#8A7864] font-mono">Initial Password: @@Usman143</span>
        </div>

        {passwordNotice && (
          <div
            className={`p-3 rounded-lg text-xs font-medium flex items-center gap-2 ${
              passwordNotice.type === 'success'
                ? 'bg-[#FAF8F5] border border-[#8A7864] text-[#1A1816]'
                : 'bg-red-50 border border-red-200 text-red-700'
            }`}
          >
            {passwordNotice.type === 'success' ? (
              <Check size={15} className="text-[#8A7864]" />
            ) : (
              <AlertCircle size={15} className="text-red-600" />
            )}
            <span>{passwordNotice.message}</span>
          </div>
        )}

        <form onSubmit={handleChangePassword} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#685F54] mb-1">Current Password</label>
              <input
                type="password"
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter current password"
                className="w-full bg-[#FAF8F5] border border-[#DED6CA] text-[#1A1816] rounded-lg p-2.5 text-xs font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#685F54] mb-1">New Password (6+ chars)</label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new secure password"
                className="w-full bg-[#FAF8F5] border border-[#DED6CA] text-[#1A1816] rounded-lg p-2.5 text-xs font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#685F54] mb-1">Confirm New Password</label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                className="w-full bg-[#FAF8F5] border border-[#DED6CA] text-[#1A1816] rounded-lg p-2.5 text-xs font-mono"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isChangingPassword}
              className="px-5 py-2.5 bg-[#FAF8F5] border border-[#8A7864] hover:bg-[#1A1816] hover:text-[#FAF8F5] text-[#1A1816] font-semibold text-xs uppercase tracking-wider rounded-lg transition-all cursor-pointer shadow-2xs flex items-center gap-1.5"
            >
              <Lock size={13} />
              <span>{isChangingPassword ? 'Updating...' : 'Update Admin Password'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Database Backup & Disaster Recovery */}
      <div className="bg-white border border-[#DED6CA] rounded-xl p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Database className="text-[#8A7864]" size={20} />
            <h2 className="font-serif text-lg font-bold text-[#1A1816]">Database Backup & Disaster Recovery</h2>
          </div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#8A7864] bg-[#FAF8F5] px-2.5 py-1 rounded-full border border-[#DED6CA]">
            JSON Snapshot
          </span>
        </div>
        <p className="text-xs text-[#685F54] mb-4 leading-relaxed">
          Download a complete backup snapshot of the SARUS catalog, categories, incoming orders, and store configuration
          stored in <code className="font-mono bg-[#FAF8F5] px-1 py-0.5 rounded border border-[#DED6CA]">data/sarus_database.json</code>.
        </p>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-2 border-t border-[#EFECE6]">
          <div className="text-xs text-[#685F54]">
            Keep an offline copy of your fabrics catalog and customer orders safely stored.
          </div>
          <a
            href="/api/admin/backup"
            download
            className="px-5 py-2.5 bg-[#1A1816] text-[#FAF8F5] hover:bg-[#8A7864] font-semibold text-xs uppercase tracking-wider rounded-lg transition-all cursor-pointer shadow-2xs flex items-center justify-center gap-2"
          >
            <Download size={14} />
            <span>Download Backup</span>
          </a>
        </div>
      </div>
    </div>
  );
};
