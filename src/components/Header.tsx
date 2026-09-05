import React from 'react';
import { ShoppingBag, Sparkles, Search, PackageCheck, ShieldCheck, SlidersHorizontal, User } from 'lucide-react';
import { CartItem } from '../types';
import { STORE_INFO } from '../data/mockStoreData';

interface HeaderProps {
  cart: CartItem[];
  onOpenCart: () => void;
  onOpenChat: (initialPrompt?: string) => void;
  onOpenOrderTracker: () => void;
  onOpenAdmin: () => void;
  onOpenPolicies: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  customerMode: 'Alex Morgan' | 'Guest Shopper';
  onToggleCustomerMode: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  cart,
  onOpenCart,
  onOpenChat,
  onOpenOrderTracker,
  onOpenAdmin,
  onOpenPolicies,
  searchQuery,
  onSearchChange,
  selectedCategory,
  onSelectCategory,
  customerMode,
  onToggleCustomerMode
}) => {
  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const categories = ['All', 'Tech & EDC', 'Apparel', 'Footwear', 'Accessories'];

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-neutral-200">
      {/* Top utility alert bar */}
      <div className="bg-neutral-900 text-neutral-200 px-4 py-1.5 text-xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-medium text-white">24/7 AI Shopper Assistant Online</span>
            <span className="hidden md:inline text-neutral-400">• Free express shipping on orders over ${STORE_INFO.freeShippingThreshold} with code <strong>WELCOME15</strong></span>
          </div>
          <div className="flex items-center gap-4 text-neutral-300">
            <button
              id="header-track-order-btn"
              onClick={onOpenOrderTracker}
              className="hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
            >
              <PackageCheck className="w-3.5 h-3.5 text-indigo-400" />
              <span>Track Orders</span>
            </button>
            <button
              id="header-policies-btn"
              onClick={onOpenPolicies}
              className="hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>30-Day Returns</span>
            </button>
            <button
              id="header-admin-btn"
              onClick={onOpenAdmin}
              className="hover:text-white flex items-center gap-1 transition-colors text-amber-300 cursor-pointer"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Agent Telemetry</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main navigation row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4">
        {/* Brand & Logo */}
        <div className="flex items-center gap-6">
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold tracking-tight text-neutral-900 font-serif">LUMINA</span>
              <span className="text-[10px] font-semibold uppercase tracking-wider bg-neutral-100 text-neutral-700 px-1.5 py-0.5 rounded border border-neutral-200">
                STUDIO
              </span>
            </div>
            <span className="text-[11px] text-neutral-500 hidden sm:inline">Lifestyle & Performance Gear</span>
          </div>

          {/* Customer persona simulator chip */}
          <button
            id="header-customer-toggle-btn"
            onClick={onToggleCustomerMode}
            title="Click to switch between logged-in shopper and guest"
            className="hidden lg:flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-700 border border-neutral-200 transition-colors"
          >
            <User className="w-3.5 h-3.5 text-indigo-600" />
            <span>Shopper: <strong>{customerMode}</strong></span>
            <span className="text-[10px] text-neutral-400 font-mono">(3 Orders)</span>
          </button>
        </div>

        {/* Search Bar */}
        <div className="flex-1 max-w-md hidden md:block">
          <div className="relative">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              id="header-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search gear, wool apparel, headphones, waterproof bags..."
              className="w-full pl-9 pr-4 py-1.5 text-sm bg-neutral-50 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-neutral-400"
            />
          </div>
        </div>

        {/* Action buttons: Ask Lumi AI & Shopping Bag */}
        <div className="flex items-center gap-3">
          {/* Ask AI Agent Trigger */}
          <button
            id="header-ask-ai-btn"
            onClick={() => onOpenChat()}
            className="relative flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white text-sm font-medium px-3.5 py-2 rounded-lg shadow-sm hover:shadow transition-all cursor-pointer group"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
            </span>
            <Sparkles className="w-4 h-4 text-amber-300 transition-transform group-hover:scale-110" />
            <span>Ask Lumi AI</span>
            <span className="hidden sm:inline-block text-[11px] bg-white/20 px-1.5 py-0.5 rounded text-indigo-100 font-mono">
              24/7
            </span>
          </button>

          {/* Cart Trigger */}
          <button
            id="header-cart-btn"
            onClick={onOpenCart}
            className="relative p-2 text-neutral-700 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors cursor-pointer"
            aria-label="Open Cart"
          >
            <ShoppingBag className="w-5 h-5" />
            {totalCartCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-indigo-600 text-white text-[11px] font-bold rounded-full flex items-center justify-center shadow">
                {totalCartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Category Pills Bar */}
      <div className="border-t border-neutral-100 px-4 sm:px-6 py-2 bg-neutral-50/50">
        <div className="max-w-7xl mx-auto flex items-center justify-between overflow-x-auto gap-2 scrollbar-none">
          <div className="flex items-center gap-1.5">
            {categories.map((cat) => {
              const active = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  id={`cat-filter-${cat.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                  onClick={() => onSelectCategory(cat)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
                    active
                      ? 'bg-neutral-900 text-white shadow-xs'
                      : 'bg-white text-neutral-600 hover:bg-neutral-200 border border-neutral-200'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          <div className="hidden sm:flex items-center gap-2 text-xs text-neutral-500 whitespace-nowrap">
            <span>Ask AI:</span>
            <button
              onClick={() => onOpenChat("Where is my package ORD-9421?")}
              className="text-indigo-600 hover:underline hover:text-indigo-800 cursor-pointer"
            >
              "Where is my package?"
            </button>
            <span>•</span>
            <button
              onClick={() => onOpenChat("How do 30-day returns work?")}
              className="text-indigo-600 hover:underline hover:text-indigo-800 cursor-pointer"
            >
              "Return an item"
            </button>
            <span>•</span>
            <button
              onClick={() => onOpenChat("Recommend best tech gifts under $75")}
              className="text-indigo-600 hover:underline hover:text-indigo-800 cursor-pointer"
            >
              "Gifts under $75"
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
