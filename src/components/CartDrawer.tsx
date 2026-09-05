import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, Tag, ArrowRight, ShieldCheck, Sparkles, CheckCircle2, ShoppingBag } from 'lucide-react';
import { CartItem, Order } from '../types';
import { STORE_INFO, PROMO_CODES } from '../data/mockStoreData';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onUpdateQuantity: (index: number, newQty: number) => void;
  onRemoveItem: (index: number) => void;
  appliedPromo: string;
  onApplyPromo: (code: string) => { success: boolean; message: string };
  onClearPromo: () => void;
  onCheckoutSuccess: (newOrder: Order) => void;
  onOpenChatWithPrompt: (prompt: string) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cart,
  onUpdateQuantity,
  onRemoveItem,
  appliedPromo,
  onApplyPromo,
  onClearPromo,
  onCheckoutSuccess,
  onOpenChatWithPrompt
}) => {
  const [promoInput, setPromoInput] = useState('');
  const [promoMessage, setPromoMessage] = useState<{ text: string; isError: boolean } | null>(null);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  if (!isOpen) return null;

  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  // Calculate discount
  let discountAmount = 0;
  const promoObj = PROMO_CODES.find(p => p.code.toUpperCase() === appliedPromo.toUpperCase());
  if (promoObj) {
    if (promoObj.discountType === 'percentage') {
      discountAmount = (subtotal * promoObj.discountValue) / 100;
    } else if (promoObj.discountType === 'fixed') {
      discountAmount = Math.min(subtotal, promoObj.discountValue);
    }
  }

  const freeShippingThreshold = STORE_INFO.freeShippingThreshold;
  const isFreeShipping = subtotal >= freeShippingThreshold || appliedPromo.toUpperCase() === 'FREESHIP';
  const shippingCost = isFreeShipping ? 0 : 8;
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const freeShippingProgress = Math.min(100, (subtotal / freeShippingThreshold) * 100);

  const total = Math.max(0, subtotal - discountAmount + shippingCost);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoInput.trim()) return;
    const result = onApplyPromo(promoInput);
    if (result.success) {
      setPromoMessage({ text: result.message, isError: false });
      setPromoInput('');
    } else {
      setPromoMessage({ text: result.message, isError: true });
    }
  };

  const handleSimulateCheckout = () => {
    setIsCheckingOut(true);
    setTimeout(() => {
      const newOrderId = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;
      const newOrder: Order = {
        id: newOrderId,
        customerName: 'Alex Morgan',
        customerEmail: 'alex.morgan@example.com',
        date: 'Just now',
        status: 'Processing',
        items: cart.map(item => ({
          productId: item.product.id,
          productName: item.product.name,
          quantity: item.quantity,
          price: item.product.price,
          image: item.product.image,
          size: item.selectedSize
        })),
        total,
        carrier: 'FedEx Express',
        trackingNumber: `FX-${Math.floor(10000000 + Math.random() * 90000000)}`,
        estimatedDelivery: '2 business days',
        shippingAddress: '742 Evergreen Terrace, Suite 4B, Springfield, OR 97477',
        timeline: [
          { title: 'Order Confirmed', time: 'Just now', completed: true, current: true, location: 'Online Store Checkout' },
          { title: 'Fulfillment Queue', time: 'Queued for packing', completed: false, current: false },
          { title: 'Carrier Hand-off', time: 'Estimated within 12 hours', completed: false, current: false },
          { title: 'Delivered', time: 'Estimated in 2 days', completed: false, current: false }
        ],
        returnEligibleUntil: '30 days after delivery'
      };

      setIsCheckingOut(false);
      onCheckoutSuccess(newOrder);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-neutral-900/50 backdrop-blur-xs">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div
          id="cart-drawer-panel"
          className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between border-l border-neutral-200 animate-in slide-in-from-right duration-200"
        >
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-neutral-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-neutral-900" />
              <h2 className="font-bold text-neutral-900 text-base">Your Shopping Bag</h2>
              <span className="text-xs bg-neutral-100 text-neutral-600 px-2 py-0.5 rounded-full font-medium">
                {cart.reduce((s, i) => s + i.quantity, 0)} items
              </span>
            </div>
            <button
              id="close-cart-btn"
              onClick={onClose}
              className="p-2 text-neutral-400 hover:text-neutral-700 rounded-lg hover:bg-neutral-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Bar */}
          <div className="px-5 py-3 bg-neutral-50 border-b border-neutral-200 text-xs">
            {isFreeShipping ? (
              <div className="flex items-center gap-1.5 text-emerald-700 font-semibold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Congratulations! You've unlocked Free Express Shipping!</span>
              </div>
            ) : (
              <div>
                <div className="flex items-center justify-between text-neutral-700 font-medium mb-1">
                  <span>Add <strong>${remainingForFreeShipping.toFixed(2)}</strong> more for Free Shipping</span>
                  <span>{freeShippingProgress.toFixed(0)}%</span>
                </div>
                <div className="w-full h-1.5 bg-neutral-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                    style={{ width: `${freeShippingProgress}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {cart.length === 0 ? (
              <div className="text-center py-16">
                <ShoppingBag className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
                <p className="font-semibold text-neutral-800 text-sm">Your bag is empty</p>
                <p className="text-xs text-neutral-500 mt-1">Explore our high-performance gear and apparel.</p>
                <button
                  onClick={onClose}
                  className="mt-4 px-4 py-2 bg-neutral-900 text-white rounded-lg text-xs font-semibold hover:bg-neutral-800 cursor-pointer"
                >
                  Continue Shopping
                </button>
              </div>
            ) : (
              cart.map((item, index) => (
                <div
                  key={`${item.product.id}-${index}`}
                  className="flex gap-3 pb-4 border-b border-neutral-100 last:border-0"
                >
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    referrerPolicy="no-referrer"
                    className="w-18 h-18 object-cover rounded-lg bg-neutral-100 shrink-0 border border-neutral-200"
                  />
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-1">
                        <h4 className="text-xs font-semibold text-neutral-900 truncate">
                          {item.product.name}
                        </h4>
                        <button
                          onClick={() => onRemoveItem(index)}
                          className="text-neutral-400 hover:text-red-500 transition-colors p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <div className="flex items-center gap-2 mt-0.5 text-[11px] text-neutral-500">
                        {item.selectedSize && (
                          <span className="bg-neutral-100 px-1.5 py-0.5 rounded text-neutral-700 font-medium">
                            Size: {item.selectedSize}
                          </span>
                        )}
                        {item.selectedColor && (
                          <span>{item.selectedColor}</span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center border border-neutral-200 rounded-md">
                        <button
                          onClick={() => onUpdateQuantity(index, item.quantity - 1)}
                          className="p-1 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-xs font-semibold text-neutral-800">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(index, item.quantity + 1)}
                          className="p-1 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="font-bold text-neutral-900 text-xs">
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* AI Cart Helper Notice */}
          {cart.length > 0 && (
            <div className="mx-5 mb-2 p-2.5 bg-indigo-50/70 border border-indigo-100 rounded-lg flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-indigo-950">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                <span>Ask Lumi for secret discount codes or bundle advice</span>
              </div>
              <button
                onClick={() => {
                  onClose();
                  onOpenChatWithPrompt("Are there any discount codes or bundle deals for the items in my cart?");
                }}
                className="font-semibold text-indigo-600 hover:text-indigo-800 text-[11px] whitespace-nowrap cursor-pointer"
              >
                Ask Lumi
              </button>
            </div>
          )}

          {/* Footer & Checkout Breakdown */}
          {cart.length > 0 && (
            <div className="p-5 border-t border-neutral-200 bg-neutral-50/50 space-y-3">
              {/* Promo Code Input */}
              <form onSubmit={handleApplyPromo} className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value)}
                    placeholder="Enter code: WELCOME15"
                    className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-neutral-300 rounded-lg uppercase tracking-wide focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                >
                  Apply
                </button>
              </form>

              {appliedPromo && (
                <div className="flex items-center justify-between text-xs bg-emerald-50 border border-emerald-200 text-emerald-800 px-2.5 py-1 rounded">
                  <span>Applied Promo: <strong>{appliedPromo.toUpperCase()}</strong></span>
                  <button
                    onClick={onClearPromo}
                    className="text-emerald-900 underline text-[11px] hover:text-red-600 ml-2 cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
              )}

              {promoMessage && (
                <p className={`text-[11px] ${promoMessage.isError ? 'text-red-500' : 'text-emerald-600'}`}>
                  {promoMessage.text}
                </p>
              )}

              {/* Price Breakdown */}
              <div className="space-y-1.5 text-xs pt-2 text-neutral-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-neutral-900">${subtotal.toFixed(2)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-medium">
                    <span>Discount ({appliedPromo.toUpperCase()})</span>
                    <span>-${discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>{isFreeShipping ? <strong className="text-emerald-600">FREE</strong> : `$${shippingCost.toFixed(2)}`}</span>
                </div>
                <div className="border-t border-neutral-200 pt-2 flex justify-between text-sm font-bold text-neutral-900">
                  <span>Estimated Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                id="simulate-checkout-btn"
                onClick={handleSimulateCheckout}
                disabled={isCheckingOut}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-sm flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer disabled:opacity-50"
              >
                {isCheckingOut ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Processing Order...</span>
                  </>
                ) : (
                  <>
                    <span>Complete Order • ${total.toFixed(2)}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-1 text-[11px] text-neutral-400">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>30-Day Money-Back Guarantee • Instant AI Tracking</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
