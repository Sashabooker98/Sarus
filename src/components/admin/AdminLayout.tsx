/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  LayoutDashboard,
  Package,
  Layers,
  Boxes,
  RotateCcw,
  Users,
  TrendingUp,
  TicketPercent,
  Settings,
  ShieldAlert,
  ArrowLeft,
  ShieldCheck,
  FolderTree,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext.tsx';
import { DashboardView } from './DashboardView.tsx';
import { OrdersView } from './OrdersView.tsx';
import { ProductsView } from './ProductsView.tsx';
import { CategoriesView } from './CategoriesView.tsx';
import { InventoryView } from './InventoryView.tsx';
import { ReturnsView } from './ReturnsView.tsx';
import { CustomersView } from './CustomersView.tsx';
import { AnalyticsView } from './AnalyticsView.tsx';
import { CouponsView } from './CouponsView.tsx';
import { SettingsView } from './SettingsView.tsx';
import { AuditLogsView } from './AuditLogsView.tsx';

export type AdminTab =
  | 'dashboard'
  | 'orders'
  | 'products'
  | 'categories'
  | 'inventory'
  | 'returns'
  | 'customers'
  | 'analytics'
  | 'coupons'
  | 'settings'
  | 'audit';

export const AdminLayout: React.FC = () => {
  const { currentUser, switchUserRole, setIsAdminMode } = useStore();
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');

  return (
    <div className="min-h-screen bg-[#F7F4EE] text-[#1A1816] flex flex-col md:flex-row">
      {/* Light Linen Admin Sidebar */}
      <aside className="w-full md:w-64 bg-[#FFFFFF] text-[#1A1816] flex flex-col justify-between shrink-0 border-r border-[#DED6CA]">
        <div>
          {/* Brand & Mode Banner */}
          <div className="p-4 sm:p-5 border-b border-[#DED6CA] bg-[#FAF8F5]">
            <img
              src="/assets/aistudio/SARUS_Premium_Fabrics_Logo-removebg-preview_2b5db1d0.png"
              alt="SARUS Premium Fabrics"
              className="h-10 w-auto object-contain mb-2"
            />
            <span className="text-[10px] tracking-widest text-[#8A7864] uppercase font-medium block">
              Ops Console // Asia/Karachi
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1 text-xs font-medium">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg transition-all cursor-pointer ${
                activeTab === 'dashboard'
                  ? 'bg-[#1A1816] text-[#FAF8F5] font-semibold shadow-xs'
                  : 'text-[#685F54] hover:bg-[#FAF8F5] hover:text-[#1A1816]'
              }`}
            >
              <LayoutDashboard size={16} />
              <span>Overview & KPIs</span>
            </button>

            <button
              onClick={() => setActiveTab('orders')}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg transition-all cursor-pointer ${
                activeTab === 'orders'
                  ? 'bg-[#1A1816] text-[#FAF8F5] font-semibold shadow-xs'
                  : 'text-[#685F54] hover:bg-[#FAF8F5] hover:text-[#1A1816]'
              }`}
            >
              <Package size={16} />
              <span>Orders & Fulfillment</span>
            </button>

            <button
              onClick={() => setActiveTab('products')}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg transition-all cursor-pointer ${
                activeTab === 'products'
                  ? 'bg-[#1A1816] text-[#FAF8F5] font-semibold shadow-xs'
                  : 'text-[#685F54] hover:bg-[#FAF8F5] hover:text-[#1A1816]'
              }`}
            >
              <Layers size={16} />
              <span>Fabrics & Catalog</span>
            </button>

            <button
              onClick={() => setActiveTab('categories')}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg transition-all cursor-pointer ${
                activeTab === 'categories'
                  ? 'bg-[#1A1816] text-[#FAF8F5] font-semibold shadow-xs'
                  : 'text-[#685F54] hover:bg-[#FAF8F5] hover:text-[#1A1816]'
              }`}
            >
              <FolderTree size={16} />
              <span>Categories & Weaves</span>
            </button>

            <button
              onClick={() => setActiveTab('inventory')}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg transition-all cursor-pointer ${
                activeTab === 'inventory'
                  ? 'bg-[#1A1816] text-[#FAF8F5] font-semibold shadow-xs'
                  : 'text-[#685F54] hover:bg-[#FAF8F5] hover:text-[#1A1816]'
              }`}
            >
              <Boxes size={16} />
              <span>Yardage & Stock</span>
            </button>

            <button
              onClick={() => setActiveTab('returns')}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg transition-all cursor-pointer ${
                activeTab === 'returns'
                  ? 'bg-[#1A1816] text-[#FAF8F5] font-semibold shadow-xs'
                  : 'text-[#685F54] hover:bg-[#FAF8F5] hover:text-[#1A1816]'
              }`}
            >
              <RotateCcw size={16} />
              <span>Returns & Exchanges</span>
            </button>

            <button
              onClick={() => setActiveTab('customers')}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg transition-all cursor-pointer ${
                activeTab === 'customers'
                  ? 'bg-[#1A1816] text-[#FAF8F5] font-semibold shadow-xs'
                  : 'text-[#685F54] hover:bg-[#FAF8F5] hover:text-[#1A1816]'
              }`}
            >
              <Users size={16} />
              <span>Patrons & CRM</span>
            </button>

            <button
              onClick={() => setActiveTab('analytics')}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg transition-all cursor-pointer ${
                activeTab === 'analytics'
                  ? 'bg-[#1A1816] text-[#FAF8F5] font-semibold shadow-xs'
                  : 'text-[#685F54] hover:bg-[#FAF8F5] hover:text-[#1A1816]'
              }`}
            >
              <TrendingUp size={16} />
              <span>Revenue & Analytics</span>
            </button>

            <button
              onClick={() => setActiveTab('coupons')}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg transition-all cursor-pointer ${
                activeTab === 'coupons'
                  ? 'bg-[#1A1816] text-[#FAF8F5] font-semibold shadow-xs'
                  : 'text-[#685F54] hover:bg-[#FAF8F5] hover:text-[#1A1816]'
              }`}
            >
              <TicketPercent size={16} />
              <span>Discounts & Vouchers</span>
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg transition-all cursor-pointer ${
                activeTab === 'settings'
                  ? 'bg-[#1A1816] text-[#FAF8F5] font-semibold shadow-xs'
                  : 'text-[#685F54] hover:bg-[#FAF8F5] hover:text-[#1A1816]'
              }`}
            >
              <Settings size={16} />
              <span>Store & Contact Info</span>
            </button>

            <button
              onClick={() => setActiveTab('audit')}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg transition-all cursor-pointer ${
                activeTab === 'audit'
                  ? 'bg-[#1A1816] text-[#FAF8F5] font-semibold shadow-xs'
                  : 'text-[#685F54] hover:bg-[#FAF8F5] hover:text-[#1A1816]'
              }`}
            >
              <ShieldAlert size={16} />
              <span>Audit Logs</span>
            </button>
          </nav>
        </div>

        {/* Staff Persona Badge & Return to Storefront */}
        <div className="p-4 border-t border-[#DED6CA] bg-[#FAF8F5] space-y-3">
          <div className="bg-[#FFFFFF] p-3 rounded-xl border border-[#DED6CA] shadow-xs">
            <span className="text-[10px] text-[#8A7864] uppercase block font-medium">Active Staff Account</span>
            <p className="text-xs font-semibold text-[#1A1816] flex items-center gap-1.5 mt-0.5">
              <ShieldCheck size={13} className="text-[#8A7864]" />
              <span>{currentUser.name}</span>
            </p>
            <div className="flex gap-1.5 mt-2">
              <button
                onClick={() => switchUserRole('order_manager')}
                className={`px-2 py-0.5 text-[10px] rounded cursor-pointer transition-colors ${
                  currentUser.role === 'order_manager' ? 'bg-[#1A1816] text-[#FAF8F5] font-semibold' : 'bg-[#FAF8F5] border border-[#DED6CA] text-[#685F54]'
                }`}
              >
                Order Mgr
              </button>
              <button
                onClick={() => switchUserRole('owner')}
                className={`px-2 py-0.5 text-[10px] rounded cursor-pointer transition-colors ${
                  currentUser.role === 'owner' ? 'bg-[#1A1816] text-[#FAF8F5] font-semibold' : 'bg-[#FAF8F5] border border-[#DED6CA] text-[#685F54]'
                }`}
              >
                Owner
              </button>
            </div>
          </div>

          <button
            onClick={() => setIsAdminMode(false)}
            className="w-full py-2.5 px-3 bg-[#FFFFFF] border border-[#DED6CA] hover:border-[#1A1816] text-[#1A1816] font-medium text-xs uppercase tracking-wider rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
          >
            <ArrowLeft size={14} />
            <span>Return to Storefront</span>
          </button>
        </div>
      </aside>

      {/* Main Content View Container */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto max-w-7xl mx-auto w-full">
        {activeTab === 'dashboard' && <DashboardView />}
        {activeTab === 'orders' && <OrdersView />}
        {activeTab === 'products' && <ProductsView />}
        {activeTab === 'categories' && <CategoriesView />}
        {activeTab === 'inventory' && <InventoryView />}
        {activeTab === 'returns' && <ReturnsView />}
        {activeTab === 'customers' && <CustomersView />}
        {activeTab === 'analytics' && <AnalyticsView />}
        {activeTab === 'coupons' && <CouponsView />}
        {activeTab === 'settings' && <SettingsView />}
        {activeTab === 'audit' && <AuditLogsView />}
      </main>
    </div>
  );
};
