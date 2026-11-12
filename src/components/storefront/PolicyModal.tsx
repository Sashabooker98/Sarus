/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { X, Ruler, Truck, RotateCcw, HelpCircle, FileText } from 'lucide-react';
import { useStore } from '../../context/StoreContext.tsx';
import { STORE_CONTACT } from '../../config/storeContact.ts';

export const PolicyModal: React.FC = () => {
  const { policyModal, setPolicyModal, isSizeGuideOpen, setIsSizeGuideOpen, settings } = useStore();

  const isOpen = !!policyModal || isSizeGuideOpen;

  if (!isOpen) return null;

  const currentType = policyModal || (isSizeGuideOpen ? 'size_guide' : 'terms');

  const handleClose = () => {
    setPolicyModal(null);
    setIsSizeGuideOpen(false);
  };

  const getTitle = () => {
    switch (currentType) {
      case 'size_guide':
        return 'Fabric Yardage & Measurement Guide';
      case 'shipping':
        return 'Nationwide Shipping & COD Delivery Information';
      case 'returns':
        return '7-Day Fabric Exchange & Inspection Policy';
      case 'faq':
        return 'Frequently Asked Questions';
      case 'privacy':
        return 'Privacy & Data Protection Policy';
      default:
        return 'Terms & Fabric Care';
    }
  };

  const getIcon = () => {
    switch (currentType) {
      case 'size_guide':
        return <Ruler size={20} className="text-[#1A1816]" />;
      case 'shipping':
        return <Truck size={20} className="text-[#1A1816]" />;
      case 'returns':
        return <RotateCcw size={20} className="text-[#1A1816]" />;
      case 'faq':
        return <HelpCircle size={20} className="text-[#1A1816]" />;
      default:
        return <FileText size={20} className="text-[#1A1816]" />;
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="policy-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-[#1A1816]/60 backdrop-blur-sm overflow-y-auto animate-fade-in"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-3xl bg-[#FFFFFF] text-[#1A1816] rounded-xl border border-[#DED6CA] shadow-2xl overflow-hidden my-auto max-h-[90vh] flex flex-col p-5 sm:p-7 space-y-4"
      >
        {/* Subtle Botanical Header Band */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#DED6CA] via-[#8A7864] to-[#DED6CA]" />

        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#DED6CA] pb-3">
          <div className="flex items-center gap-2.5">
            {getIcon()}
            <div>
              <span className="text-[10px] tracking-[0.2em] uppercase text-[#8A7864] block">SARUS · سیرس</span>
              <h2 id="policy-modal-title" className="font-display text-xl sm:text-2xl font-normal tracking-tight text-[#1A1816]">
                {getTitle()}
              </h2>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 text-[#8A7864] hover:text-[#1A1816] hover:bg-[#EFE8DC] rounded-full cursor-pointer transition-colors"
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content Body */}
        <div className="overflow-y-auto flex-1 space-y-4 text-xs sm:text-sm text-[#685F54] leading-relaxed pr-2">
          {/* SIZE GUIDE */}
          {currentType === 'size_guide' && (
            <div className="space-y-6">
              <div>
                <p className="text-xs text-[#685F54]">
                  All SARUS textiles are 100% pure fabrics woven from authentic combed cotton, linen, silk, and winter wool. Standard unstitched suit lengths are precisely cut to allow master tailoring according to individual height and fit preferences.
                </p>
              </div>

              {/* Fabric Yardage Table */}
              <div>
                <h4 className="font-semibold text-xs uppercase tracking-wider text-[#1A1816] mb-2 flex items-center justify-between">
                  <span>Standard Unstitched Fabric Yardage Chart</span>
                  <span className="text-xs text-[#8A7864] font-normal">— ✤ —</span>
                </h4>
                <div className="overflow-x-auto border border-[#DED6CA] rounded-xl bg-[#FFFFFF]">
                  <table className="w-full text-left text-xs tabular-nums text-[#1A1816]">
                    <thead className="bg-[#FAF8F5] text-[#8A7864] uppercase text-[10px] tracking-wider border-b border-[#DED6CA]">
                      <tr>
                        <th className="p-3">Garment Type</th>
                        <th className="p-3">Yardage / Length</th>
                        <th className="p-3">Fabric Width (Arz)</th>
                        <th className="p-3">Recommended For</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#EFE8DC]">
                      <tr>
                        <td className="p-3 font-semibold text-[#1A1816]">Unstitched Suit (Double Arz)</td>
                        <td className="p-3">4.0 Meters (4.37 yds)</td>
                        <td className="p-3">54–56 Inches (Double Width)</td>
                        <td className="p-3 text-[#685F54]">Full men's or women's shalwar kameez / kurta trouser</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-semibold text-[#1A1816]">Unstitched Suit (Single Arz)</td>
                        <td className="p-3">4.5 Meters (4.92 yds)</td>
                        <td className="p-3">36–38 Inches (Regular Width)</td>
                        <td className="p-3 text-[#685F54]">Traditional pure cotton & karandi suit cuts</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-semibold text-[#1A1816]">Kurta / Shirt Only</td>
                        <td className="p-3">2.25 – 2.5 Meters</td>
                        <td className="p-3">54 Inches</td>
                        <td className="p-3 text-[#685F54]">Standalone tunic, kurta or modern dress shirt</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-semibold text-[#1A1816]">Waistcoat / Vest Length</td>
                        <td className="p-3">1.25 – 1.5 Meters</td>
                        <td className="p-3">54 Inches</td>
                        <td className="p-3 text-[#685F54]">Tailored formal waistcoat or blazer inner</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Pre-Shrinkage Notice */}
              <div className="p-3.5 bg-[#FAF8F5] border border-[#DED6CA] rounded-xl space-y-1">
                <h5 className="font-semibold text-[#1A1816] text-xs">Essential Fabric Preparation (Shrinkage):</h5>
                <p className="text-[11px] text-[#685F54]">
                  Pure cotton, raw silk, and karandi are 100% pure fabrics that relax upon initial soak. Immerse your unstitched fabric in clean water for 20 minutes and air-dry in shade prior to tailor cutting.
                </p>
              </div>
            </div>
          )}

          {/* SHIPPING POLICY */}
          {currentType === 'shipping' && (
            <div className="space-y-4">
              <p>
                SARUS delivers all textile packages across Pakistan directly from our Sadiqabad fulfillment center using insured courier services with end-to-end tracking.
              </p>

              <div className="p-3.5 bg-[#FAF8F5] border border-[#DED6CA] rounded-xl space-y-2">
                <h4 className="font-semibold text-[#1A1816] uppercase text-xs">Estimated Delivery Timelines:</h4>
                <ul className="list-disc pl-5 space-y-1 text-xs">
                  <li><strong>Zone 1 (Major Metros - Lahore, Karachi, Islamabad, Rawalpindi):</strong> 1–2 business days.</li>
                  <li><strong>Zone 2 (Urban Hubs - Multan, Faisalabad, Sialkot, Gujranwala):</strong> 2–3 business days.</li>
                  <li><strong>Zone 3 (Rest of Pakistan & Remote Regions):</strong> 3–5 business days.</li>
                </ul>
              </div>

              <div className="p-3.5 bg-[#FAF8F5] border border-[#DED6CA] rounded-xl">
                <h4 className="font-semibold text-[#1A1816] uppercase text-xs">Doorstep Cash Collection (COD):</h4>
                <p className="mt-1 text-xs">
                  All Cash on Delivery parcels are collected in Pakistani Rupees upon arrival. We encourage inspecting the tamper-evident exterior seal before making payment to the courier rider.
                </p>
              </div>
            </div>
          )}

          {/* RETURNS POLICY */}
          {currentType === 'returns' && (
            <div className="space-y-4">
              <p>
                At SARUS, fabric authenticity and tactile satisfaction are guaranteed. If a fabric does not meet your expectations or if there is any weave irregularity, we provide a <strong>7-Day Return and Exchange policy</strong> starting from delivery receipt.
              </p>

              <div className="p-3.5 bg-[#FAF8F5] border border-[#DED6CA] rounded-xl space-y-1">
                <h4 className="font-semibold text-[#1A1816] uppercase text-xs">Exchange Eligibility:</h4>
                <ul className="list-disc pl-5 space-y-0.5 text-xs">
                  <li>Fabric must be uncut, unwashed, and in pristine original packaging.</li>
                  <li>SARUS brand label and authenticity seals must be attached.</li>
                  <li>Proof of purchase (Order reference number) is required.</li>
                </ul>
              </div>

              <p>
                To initiate an exchange, reach out to our customer care WhatsApp concierge at <strong className="text-[#1A1816]">{settings.whatsappNumber || STORE_CONTACT.whatsapp}</strong>. We will arrange a doorstep reverse collection anywhere in Pakistan.
              </p>
            </div>
          )}

          {/* FAQ */}
          {currentType === 'faq' && (
            <div className="space-y-3 text-xs sm:text-sm">
              <div className="p-3.5 bg-[#FAF8F5] border border-[#DED6CA] rounded-xl">
                <h4 className="font-semibold text-[#1A1816]">How do I pay on delivery?</h4>
                <p className="mt-1 text-[#685F54] text-xs">
                  When the courier arrives with your SARUS fabric box, hand over the exact cash amount indicated on your invoice. The rider will issue a signed proof of delivery.
                </p>
              </div>

              <div className="p-3.5 bg-[#FAF8F5] border border-[#DED6CA] rounded-xl">
                <h4 className="font-semibold text-[#1A1816]">Are SARUS fabrics 100% authentic and unstitched?</h4>
                <p className="mt-1 text-[#685F54] text-xs">
                  Yes, every piece is woven from 100% pure fabrics including combed Egyptian cotton, Belgian flax linen, and winter Karandi. Each fabric length is inspected, packaged with our signature label, and sealed.
                </p>
              </div>

              <div className="p-3.5 bg-[#FAF8F5] border border-[#DED6CA] rounded-xl">
                <h4 className="font-semibold text-[#1A1816]">Where is SARUS based?</h4>
                <p className="mt-1 text-[#685F54] text-xs">
                  Our boutique operations and textile dispatch facility are located at Sadiqabad Tibbi Wighawar, Near Madni Masjid, Sadiqabad, Punjab, Pakistan.
                </p>
              </div>
            </div>
          )}

          {/* TERMS & PRIVACY */}
          {(currentType === 'terms' || currentType === 'privacy') && (
            <div className="space-y-4">
              <p>
                SARUS Clothes is an authentic premium fabric house established in Punjab, Pakistan. All woven textile designs, brand labels, and media assets are protected.
              </p>
              <div className="p-3.5 bg-[#FAF8F5] border border-[#DED6CA] rounded-xl space-y-1">
                <h4 className="font-semibold text-[#1A1816] uppercase text-xs">Data Confidentiality:</h4>
                <p className="text-xs text-[#685F54]">
                  Customer names, phone numbers, and addresses are utilized strictly for delivery booking, shipment notification, and customer support. We never disclose personal data to third-party marketing companies.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
