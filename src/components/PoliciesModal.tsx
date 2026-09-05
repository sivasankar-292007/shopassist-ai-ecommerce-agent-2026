import React from 'react';
import { X, RotateCcw, Truck, ShieldCheck, Leaf, Headphones, ArrowRight, Sparkles } from 'lucide-react';
import { STORE_INFO } from '../data/mockStoreData';

interface PoliciesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenChatWithPrompt: (prompt: string) => void;
}

export const PoliciesModal: React.FC<PoliciesModalProps> = ({
  isOpen,
  onClose,
  onOpenChatWithPrompt
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-neutral-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div
        id="policies-modal"
        className="relative w-full max-w-2xl bg-white rounded-2xl shadow-xl overflow-hidden border border-neutral-200 animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="p-5 border-b border-neutral-200 flex items-center justify-between bg-neutral-50/70">
          <div>
            <h3 className="font-bold text-neutral-900 text-base">Store Policies & Customer Guarantees</h3>
            <p className="text-xs text-neutral-500">Transparent, shopper-first promises at {STORE_INFO.name}</p>
          </div>
          <button
            id="close-policies-modal-btn"
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-neutral-700 rounded-lg hover:bg-neutral-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Policy 1: 30-Day Free Returns */}
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-sm text-neutral-900">30-Day Hassle-Free Returns & Size Exchanges</h4>
              <p className="text-xs text-neutral-600 mt-1 leading-relaxed">
                Any unworn item in original condition can be returned within 30 days of delivery.
                Lumi generates an instant prepaid return QR label right in your chat—no printer required. Drop off at any USPS or FedEx counter.
              </p>
            </div>
          </div>

          {/* Policy 2: Shipping */}
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-sm text-neutral-900">Free Express Shipping on Orders Over ${STORE_INFO.freeShippingThreshold}</h4>
              <p className="text-xs text-neutral-600 mt-1 leading-relaxed">
                Orders ship same-day if placed before 2:00 PM EST. Flat $8 standard delivery for smaller carts under $50, or use code <strong>FREESHIP</strong>. Live real-time courier tracking is provided for every shipment.
              </p>
            </div>
          </div>

          {/* Policy 3: Warranty */}
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-sm text-neutral-900">1-Year Comprehensive Manufacturer Warranty</h4>
              <p className="text-xs text-neutral-600 mt-1 leading-relaxed">
                All Lumina backpacks, electronics, and precision hardware are covered against craftsmanship and material defects for 365 days. Free repairs or direct replacements.
              </p>
            </div>
          </div>

          {/* Policy 4: Eco Packaging */}
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
              <Leaf className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-sm text-neutral-900">100% Recycled FSC-Certified Eco-Packaging</h4>
              <p className="text-xs text-neutral-600 mt-1 leading-relaxed">
                Zero single-use plastics. All garment mailers, boxes, and kraft tape are 100% biodegradable and recyclable.
              </p>
            </div>
          </div>

          {/* Policy 5: 24/7 AI + Human Support */}
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center shrink-0">
              <Headphones className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-sm text-neutral-900">24/7 AI Concierge + Human Escalation Desk</h4>
              <p className="text-xs text-neutral-600 mt-1 leading-relaxed">
                Lumi handles questions, order tracking, and returns instantly 24/7. If you ever require human support, Lumi will open a tier-2 ticket with a 15-minute response SLA.
              </p>
            </div>
          </div>

          {/* Bottom Action Prompt */}
          <div className="p-4 bg-indigo-50/70 rounded-xl border border-indigo-100 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs text-indigo-950 font-medium">
              <Sparkles className="w-4 h-4 text-indigo-600 shrink-0" />
              <span>Have a question about a specific order or policy?</span>
            </div>
            <button
              onClick={() => {
                onClose();
                onOpenChatWithPrompt("Can you explain how returns and size exchanges work step by step?");
              }}
              className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer whitespace-nowrap"
            >
              <span>Ask Lumi</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
