import React, { useState } from 'react';
import { Header } from './components/Header';
import { ProductCatalog } from './components/ProductCatalog';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { OrderTrackerModal } from './components/OrderTrackerModal';
import { AIChatDrawer } from './components/AIChatDrawer';
import { StoreAdminModal } from './components/StoreAdminModal';
import { PoliciesModal } from './components/PoliciesModal';
import { PRODUCTS, SAMPLE_ORDERS, PROMO_CODES, STORE_INFO } from './data/mockStoreData';
import { Product, CartItem, Order, AgentSettings } from './types';
import { Sparkles, CheckCircle2 } from 'lucide-react';

export default function App() {
  // Store state
  const [products] = useState<Product[]>(PRODUCTS);
  const [cart, setCart] = useState<CartItem[]>([
    {
      product: PRODUCTS[0],
      quantity: 1,
      selectedSize: 'One Size',
      selectedColor: 'Obsidian Black'
    }
  ]);
  const [appliedPromo, setAppliedPromo] = useState<string>('WELCOME15');
  const [orders, setOrders] = useState<Order[]>(SAMPLE_ORDERS);
  const [customerMode, setCustomerMode] = useState<'Alex Morgan' | 'Guest Shopper'>('Alex Morgan');

  // Modals & Drawers state
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(true);
  const [chatInitialPrompt, setChatInitialPrompt] = useState<string | undefined>(undefined);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isOrderTrackerOpen, setIsOrderTrackerOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isPoliciesOpen, setIsPoliciesOpen] = useState(false);
  const [orderConfirmation, setOrderConfirmation] = useState<Order | null>(null);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Agent Settings
  const [agentSettings, setAgentSettings] = useState<AgentSettings>({
    tone: 'friendly',
    proactivePrompts: true,
    autoApplyDiscounts: true,
    freeShippingThreshold: 50,
    returnWindowDays: 30
  });

  // Filtered Products
  const filteredProducts = products.filter((product) => {
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    const matchesSearch =
      !searchQuery.trim() ||
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.highlights.some(h => h.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  // Cart Handlers
  const handleAddToCart = (product: Product, size?: string, color?: string) => {
    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.product.id === product.id && item.selectedSize === size && item.selectedColor === color
      );
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += 1;
        return updated;
      }
      return [...prev, { product, quantity: 1, selectedSize: size, selectedColor: color }];
    });
  };

  const handleUpdateQuantity = (index: number, newQty: number) => {
    if (newQty <= 0) {
      handleRemoveItem(index);
    } else {
      setCart((prev) => {
        const updated = [...prev];
        updated[index].quantity = newQty;
        return updated;
      });
    }
  };

  const handleRemoveItem = (index: number) => {
    setCart((prev) => prev.filter((_, i) => i !== index));
  };

  const handleApplyPromo = (code: string) => {
    const clean = code.trim().toUpperCase();
    const found = PROMO_CODES.find((p) => p.code.toUpperCase() === clean);
    if (found) {
      setAppliedPromo(found.code);
      return { success: true, message: `Promo code ${found.code} applied! ${found.description}` };
    }
    return { success: false, message: `Code "${code}" is invalid or expired.` };
  };

  const handleClearPromo = () => {
    setAppliedPromo('');
  };

  // AI Chat Opener
  const handleOpenChatWithPrompt = (prompt?: string) => {
    setChatInitialPrompt(prompt);
    setIsChatOpen(true);
  };

  const handleAskAIAboutProduct = (product: Product, specificQuestion?: string) => {
    setSelectedProduct(product);
    const question = specificQuestion || `Can you tell me more about the fit, sizing, and key features of ${product.name}?`;
    handleOpenChatWithPrompt(question);
  };

  // Checkout Success Handler
  const handleCheckoutSuccess = (newOrder: Order) => {
    setOrders((prev) => [newOrder, ...prev]);
    setCart([]);
    setIsCartOpen(false);
    setOrderConfirmation(newOrder);
  };

  // Create Demo Order Handler for Admin Sandbox
  const handleCreateDemoOrder = (): Order => {
    const randomProd = PRODUCTS[Math.floor(Math.random() * PRODUCTS.length)];
    const newId = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrd: Order = {
      id: newId,
      customerName: customerMode,
      customerEmail: 'alex.morgan@example.com',
      date: 'Just now',
      status: 'Shipped',
      items: [
        {
          productId: randomProd.id,
          productName: randomProd.name,
          quantity: 1,
          price: randomProd.price,
          image: randomProd.image,
          size: randomProd.sizes ? randomProd.sizes[0] : 'Standard'
        }
      ],
      total: randomProd.price,
      carrier: 'UPS 2nd Day Air',
      trackingNumber: `1Z${Math.floor(1000000000000000 + Math.random() * 9000000000000000)}`,
      estimatedDelivery: 'Tomorrow by 4:00 PM',
      shippingAddress: '742 Evergreen Terrace, Suite 4B, Springfield, OR 97477',
      timeline: [
        { title: 'Order Processed', time: 'Just now', completed: true, current: false },
        { title: 'Departed Facility', time: 'Just now', completed: true, current: true, location: 'Local Distribution Center' },
        { title: 'Delivered', time: 'Tomorrow 4:00 PM', completed: false, current: false }
      ],
      returnEligibleUntil: '30 days after delivery'
    };

    setOrders(prev => [newOrd, ...prev]);
    return newOrd;
  };

  const handleToggleCustomerMode = () => {
    setCustomerMode(prev => prev === 'Alex Morgan' ? 'Guest Shopper' : 'Alex Morgan');
  };

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50 font-['Plus_Jakarta_Sans',sans-serif] text-neutral-900">
      {/* Header Bar */}
      <Header
        cart={cart}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenChat={handleOpenChatWithPrompt}
        onOpenOrderTracker={() => setIsOrderTrackerOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenPolicies={() => setIsPoliciesOpen(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        customerMode={customerMode}
        onToggleCustomerMode={handleToggleCustomerMode}
      />

      {/* Main Content: Store Catalog */}
      <main className="flex-1 pb-16">
        <ProductCatalog
          products={filteredProducts}
          onQuickView={(p) => setSelectedProduct(p)}
          onAddToCart={handleAddToCart}
          onAskAIAboutProduct={handleAskAIAboutProduct}
          onOpenChatWithPrompt={handleOpenChatWithPrompt}
          selectedCategory={selectedCategory}
        />
      </main>

      {/* Floating Action Button for Lumi AI (when drawer is closed) */}
      {!isChatOpen && (
        <button
          id="floating-ask-lumi-btn"
          onClick={() => handleOpenChatWithPrompt()}
          className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5 bg-gradient-to-r from-neutral-900 via-neutral-800 to-indigo-900 text-white px-4 py-3 rounded-full shadow-2xl hover:shadow-indigo-500/20 border border-neutral-700/80 hover:scale-105 transition-all cursor-pointer group"
        >
          <div className="relative flex items-center justify-center">
            <span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400"></span>
          </div>
          <Sparkles className="w-4 h-4 text-amber-300 group-hover:rotate-12 transition-transform" />
          <span className="text-sm font-semibold">Ask Lumi 24/7</span>
          <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded font-mono text-indigo-100">
            Online
          </span>
        </button>
      )}

      {/* Customer-Facing 24/7 AI Concierge Drawer */}
      <AIChatDrawer
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        cart={cart}
        currentProduct={selectedProduct}
        onAddToCart={handleAddToCart}
        onQuickView={(p) => setSelectedProduct(p)}
        onOpenOrderTracker={(ord) => {
          setIsOrderTrackerOpen(true);
        }}
        onApplyPromo={(code) => setAppliedPromo(code)}
        initialPrompt={chatInitialPrompt}
        customerMode={customerMode}
      />

      {/* Product Quick View / Detail Modal */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
        onAskAIAboutProduct={handleAskAIAboutProduct}
      />

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        appliedPromo={appliedPromo}
        onApplyPromo={handleApplyPromo}
        onClearPromo={handleClearPromo}
        onCheckoutSuccess={handleCheckoutSuccess}
        onOpenChatWithPrompt={handleOpenChatWithPrompt}
      />

      {/* Real-time Order Tracker Modal */}
      <OrderTrackerModal
        isOpen={isOrderTrackerOpen}
        onClose={() => setIsOrderTrackerOpen(false)}
        orders={orders}
        onOpenChatWithPrompt={handleOpenChatWithPrompt}
      />

      {/* Store Admin & Telemetry Modal */}
      <StoreAdminModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        settings={agentSettings}
        onUpdateSettings={setAgentSettings}
        onCreateDemoOrder={handleCreateDemoOrder}
        onOpenOrderTracker={() => setIsOrderTrackerOpen(true)}
      />

      {/* Store Policies Modal */}
      <PoliciesModal
        isOpen={isPoliciesOpen}
        onClose={() => setIsPoliciesOpen(false)}
        onOpenChatWithPrompt={handleOpenChatWithPrompt}
      />

      {/* Order Confirmation Toast / Modal */}
      {orderConfirmation && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-neutral-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 text-center border border-neutral-200 animate-in zoom-in-95 duration-200">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-neutral-900 font-serif">Order Confirmed!</h3>
            <p className="text-xs text-neutral-500 mt-1">
              Thank you, {orderConfirmation.customerName}! Your order has been placed.
            </p>

            <div className="my-4 p-3 bg-neutral-50 rounded-xl border border-neutral-200 text-left text-xs space-y-1">
              <div className="flex justify-between">
                <span className="text-neutral-500">Order ID:</span>
                <strong className="font-mono text-neutral-900">{orderConfirmation.id}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Carrier:</span>
                <span className="text-neutral-900">{orderConfirmation.carrier}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Tracking Code:</span>
                <span className="font-mono text-indigo-600">{orderConfirmation.trackingNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Estimated Delivery:</span>
                <span className="font-semibold text-neutral-900">{orderConfirmation.estimatedDelivery}</span>
              </div>
            </div>

            <div className="space-y-2">
              <button
                onClick={() => {
                  const id = orderConfirmation.id;
                  setOrderConfirmation(null);
                  handleOpenChatWithPrompt(`Where is my new order ${id}?`);
                }}
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Track this order with Lumi AI</span>
              </button>

              <button
                onClick={() => setOrderConfirmation(null)}
                className="w-full py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-xl text-xs font-medium transition-colors cursor-pointer"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-neutral-200 bg-white py-8 text-xs text-neutral-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-serif font-bold text-neutral-900">LUMINA</span>
            <span>© {new Date().getFullYear()} {STORE_INFO.name}. All rights reserved.</span>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => setIsPoliciesOpen(true)} className="hover:text-neutral-900 cursor-pointer">
              30-Day Returns & Exchanges
            </button>
            <button onClick={() => setIsOrderTrackerOpen(true)} className="hover:text-neutral-900 cursor-pointer">
              Package Tracking
            </button>
            <button onClick={() => setIsAdminOpen(true)} className="hover:text-neutral-900 cursor-pointer">
              Agent Telemetry & Settings
            </button>
            <button
              onClick={() => handleOpenChatWithPrompt("What is the store warranty and return policy?")}
              className="hover:text-indigo-600 font-medium cursor-pointer"
            >
              Ask Lumi AI
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
