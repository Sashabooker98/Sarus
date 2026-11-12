/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { StoreProvider, useStore } from './context/StoreContext.tsx';
import { Header } from './components/common/Header.tsx';
import { HeroBanner } from './components/storefront/HeroBanner.tsx';
import { CategoriesSection } from './components/storefront/CategoriesSection.tsx';
import { FeaturedSection } from './components/storefront/FeaturedSection.tsx';
import { ProductGrid } from './components/storefront/ProductGrid.tsx';
import { AboutSection } from './components/storefront/AboutSection.tsx';
import { Footer } from './components/common/Footer.tsx';
import { ProductDetailModal } from './components/storefront/ProductDetailModal.tsx';
import { CartDrawer } from './components/storefront/CartDrawer.tsx';
import { CheckoutModal } from './components/storefront/CheckoutModal.tsx';
import { OrderConfirmation } from './components/storefront/OrderConfirmation.tsx';
import { OrderTrackingModal } from './components/storefront/OrderTrackingModal.tsx';
import { AccountPortal } from './components/storefront/AccountPortal.tsx';
import { AiStylistDrawer } from './components/storefront/AiStylistDrawer.tsx';
import { PolicyModal } from './components/storefront/PolicyModal.tsx';
import { WhatsAppButton } from './components/storefront/WhatsAppButton.tsx';
import { AdminLayout } from './components/admin/AdminLayout.tsx';
import { AdminLoginModal } from './components/admin/AdminLoginModal.tsx';
import { SplashScreen } from './components/common/SplashScreen.tsx';
import { CustomCursor } from './components/common/CustomCursor.tsx';
import { ScrollProgressBar } from './components/common/ScrollProgressBar.tsx';

const StorefrontView: React.FC = () => {
  const { filterCategory } = useStore();

  return (
    <>
      {/* 1. Desktop Interactive Fluid Custom Cursor */}
      <CustomCursor />

      {/* 2. Top Scroll Progress Indicator Bar */}
      <ScrollProgressBar />

      {/* 3. Opening Splash Screen */}
      <SplashScreen />

      <div className="min-h-screen flex flex-col bg-[#F7F4EE] text-[#1A1816]">
        <Header />

        {/* 4. Smooth Page-to-Page View Transition (0.25s) */}
        <AnimatePresence mode="wait">
          <motion.main
            key={filterCategory}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="flex-1"
          >
            <HeroBanner />
            <CategoriesSection />
            <FeaturedSection />
            <ProductGrid />
            <AboutSection />
          </motion.main>
        </AnimatePresence>

        <Footer />

        {/* Floating WhatsApp Concierge Button */}
        <WhatsAppButton />

        {/* Global Modals & Drawers */}
        <ProductDetailModal />
        <CartDrawer />
        <CheckoutModal />
        <OrderConfirmation />
        <OrderTrackingModal />
        <AccountPortal />
        <AiStylistDrawer />
        <PolicyModal />
        <AdminLoginModal />
      </div>
    </>
  );
};

const MainContent: React.FC = () => {
  const { isAdminMode, isAdminAuthenticated } = useStore();

  return isAdminMode && isAdminAuthenticated ? <AdminLayout /> : <StorefrontView />;
};

export default function App() {
  return (
    <StoreProvider>
      <MainContent />
    </StoreProvider>
  );
}
