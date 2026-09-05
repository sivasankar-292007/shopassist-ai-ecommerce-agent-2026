import React from 'react';
import { ProductCard } from './ProductCard';
import { Product } from '../types';
import { Sparkles, ArrowRight, ShieldCheck, Truck, RotateCcw } from 'lucide-react';
import { AgentOrb3D } from './3d/AgentOrb3D';

interface ProductCatalogProps {
  products: Product[];
  onQuickView: (product: Product) => void;
  onAddToCart: (product: Product, size?: string) => void;
  onAskAIAboutProduct: (product: Product) => void;
  onOpenChatWithPrompt: (prompt: string) => void;
  selectedCategory: string;
}

export const ProductCatalog: React.FC<ProductCatalogProps> = ({
  products,
  onQuickView,
  onAddToCart,
  onAskAIAboutProduct,
  onOpenChatWithPrompt,
  selectedCategory
}) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-8">
      {/* Hero Assistant Welcome Card */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-neutral-900 via-neutral-800 to-indigo-950 text-white p-6 sm:p-8 shadow-sm border border-neutral-800 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="relative z-10 max-w-xl">
          <div className="inline-flex items-center gap-2 bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-3 py-1 rounded-full text-xs font-medium mb-4 backdrop-blur">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Meet Lumi • 24/7 E-Commerce AI Agent</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-serif">
            Instant, personalized support for every shopper.
          </h1>
          <p className="mt-2 text-sm sm:text-base text-neutral-300 leading-relaxed">
            Need real-time order tracking, interactive 3D product inspection, true-to-size advice, instant 30-day returns, or personalized gift recommendations? Ask Lumi anytime.
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-2">
            <span className="text-xs text-neutral-400 font-medium mr-1">Popular inquiries:</span>
            <button
              id="prompt-track-hero"
              onClick={() => onOpenChatWithPrompt("Where is my package ORD-9421?")}
              className="text-xs bg-white/10 hover:bg-white/20 text-neutral-200 hover:text-white px-3 py-1.5 rounded-lg border border-white/10 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <span>Track ORD-9421</span>
              <ArrowRight className="w-3 h-3 text-indigo-300" />
            </button>
            <button
              id="prompt-deals-hero"
              onClick={() => onOpenChatWithPrompt("What active promo codes do you have?")}
              className="text-xs bg-white/10 hover:bg-white/20 text-neutral-200 hover:text-white px-3 py-1.5 rounded-lg border border-white/10 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <span>Get 15% discount code</span>
              <ArrowRight className="w-3 h-3 text-indigo-300" />
            </button>
            <button
              id="prompt-returns-hero"
              onClick={() => onOpenChatWithPrompt("I need to exchange an item for a different size from ORD-8812")}
              className="text-xs bg-white/10 hover:bg-white/20 text-neutral-200 hover:text-white px-3 py-1.5 rounded-lg border border-white/10 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <span>Exchange size (ORD-8812)</span>
              <ArrowRight className="w-3 h-3 text-indigo-300" />
            </button>
          </div>
        </div>

        {/* 3D Holographic AI Core Orb Stage */}
        <div className="relative z-10 flex flex-col items-center justify-center p-3 bg-white/5 rounded-2xl border border-white/10 backdrop-blur shrink-0 group">
          <div className="w-[140px] h-[140px] flex items-center justify-center">
            <AgentOrb3D size={135} state="idle" interactive={true} />
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-indigo-200 mt-1 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>3D AI Core (Drag to spin)</span>
          </div>
        </div>

        {/* Ambient background decoration */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial from-indigo-500/20 to-transparent blur-2xl pointer-events-none" />
      </div>

      {/* Trust & Guarantee highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 py-1 text-xs">
        <div className="flex items-center gap-3 p-3.5 bg-white rounded-xl border border-neutral-200/80 shadow-2xs">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <Truck className="w-4 h-4" />
          </div>
          <div>
            <span className="font-semibold text-neutral-900 block">Free 2-Day Shipping</span>
            <span className="text-neutral-500 text-[11px]">On all orders over $50 with live carrier GPS</span>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3.5 bg-white rounded-xl border border-neutral-200/80 shadow-2xs">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
            <RotateCcw className="w-4 h-4" />
          </div>
          <div>
            <span className="font-semibold text-neutral-900 block">30-Day Free Returns</span>
            <span className="text-neutral-500 text-[11px]">Instant prepaid QR code via Lumi in chat</span>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3.5 bg-white rounded-xl border border-neutral-200/80 shadow-2xs">
          <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <span className="font-semibold text-neutral-900 block">1-Year Gear Warranty</span>
            <span className="text-neutral-500 text-[11px]">All bags, electronics, and hardware covered</span>
          </div>
        </div>
      </div>

      {/* Catalog Section Header */}
      <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
        <div>
          <h2 className="text-lg font-bold text-neutral-900">
            {selectedCategory === 'All' ? 'Featured Products & Essentials' : `${selectedCategory} Collection`}
          </h2>
          <p className="text-xs text-neutral-500">
            Showing {products.length} performance-crafted items in stock
          </p>
        </div>
      </div>

      {/* Products Grid */}
      {products.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-neutral-200">
          <p className="text-sm font-medium text-neutral-700">No products match your search or filter.</p>
          <p className="text-xs text-neutral-400 mt-1">Try resetting category or ask Lumi AI to find what you need.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onQuickView={onQuickView}
              onAddToCart={onAddToCart}
              onAskAIAboutProduct={onAskAIAboutProduct}
            />
          ))}
        </div>
      )}
    </div>
  );
};
