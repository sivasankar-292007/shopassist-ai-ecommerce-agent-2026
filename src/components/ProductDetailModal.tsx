import React, { useState } from 'react';
import { X, Star, Sparkles, Check, ShoppingBag, Shield, Truck, RotateCcw, Box, Image as ImageIcon } from 'lucide-react';
import { Product } from '../types';
import { ProductViewer3D } from './3d/ProductViewer3D';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, size?: string, color?: string) => void;
  onAskAIAboutProduct: (product: Product, specificQuestion?: string) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onAddToCart,
  onAskAIAboutProduct
}) => {
  if (!product) return null;

  const [selectedSize, setSelectedSize] = useState<string>(product.sizes ? product.sizes[0] : '');
  const [selectedColor, setSelectedColor] = useState<string>(product.colors ? product.colors[0] : '');
  const [viewMode, setViewMode] = useState<'3d' | 'photo'>('3d');
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    onAddToCart(product, selectedSize || undefined, selectedColor || undefined);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-neutral-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div
        id="product-detail-modal"
        className="relative w-full max-w-3xl bg-white rounded-2xl shadow-xl overflow-hidden border border-neutral-200 animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Close Button */}
        <button
          id="close-product-modal-btn"
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/80 hover:bg-white text-neutral-600 hover:text-neutral-900 shadow-xs border border-neutral-200 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Media / 3D Canvas Side */}
          <div className="relative bg-neutral-100 aspect-square md:aspect-auto h-full min-h-[360px] flex flex-col">
            {viewMode === '3d' ? (
              <div className="w-full h-full min-h-[360px] flex-1">
                <ProductViewer3D
                  product={product}
                  selectedColor={selectedColor}
                  onSelectColor={setSelectedColor}
                  onAskAIAboutFeature={(feature, detail) => {
                    onAskAIAboutProduct(
                      product,
                      `Can you tell me about the ${feature} on ${product.name}? Specifically: ${detail}`
                    );
                  }}
                />
              </div>
            ) : (
              <div className="relative w-full h-full min-h-[360px]">
                <img
                  src={product.image}
                  alt={product.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center"
                />
                <div className="absolute bottom-3 left-3 bg-neutral-900/80 backdrop-blur text-white text-[11px] px-2.5 py-1 rounded-md">
                  SKU: {product.sku}
                </div>
              </div>
            )}

            {/* Toggle between 3D and 2D */}
            <div className="absolute top-4 left-4 z-20 flex items-center bg-white/90 backdrop-blur rounded-lg p-1 border border-neutral-200 shadow-xs gap-1">
              <button
                onClick={() => setViewMode('3d')}
                className={`px-2.5 py-1 rounded text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                  viewMode === '3d'
                    ? 'bg-neutral-900 text-white'
                    : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
                }`}
              >
                <Box className="w-3.5 h-3.5 text-indigo-400" />
                <span>3D Interactive</span>
              </button>
              <button
                onClick={() => setViewMode('photo')}
                className={`px-2.5 py-1 rounded text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                  viewMode === 'photo'
                    ? 'bg-neutral-900 text-white'
                    : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
                }`}
              >
                <ImageIcon className="w-3.5 h-3.5" />
                <span>Photos</span>
              </button>
            </div>
          </div>

          {/* Details Side */}
          <div className="p-6 flex flex-col justify-between max-h-[85vh] overflow-y-auto">
            <div>
              {/* Category & Rating */}
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                  {product.category}
                </span>
                <div className="flex items-center gap-1 text-xs text-neutral-600">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span className="font-semibold">{product.rating}</span>
                  <span className="text-neutral-400">({product.reviewsCount} reviews)</span>
                </div>
              </div>

              {/* Title & Price */}
              <h2 className="text-xl font-bold text-neutral-900 leading-tight">
                {product.name}
              </h2>
              <p className="text-xs text-neutral-500 mt-1">
                {product.tagline}
              </p>

              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-2xl font-extrabold text-neutral-900">${product.price}</span>
                {product.originalPrice && (
                  <span className="text-sm text-neutral-400 line-through">${product.originalPrice}</span>
                )}
                <span className="text-xs text-emerald-600 font-medium ml-2">
                  In Stock ({product.stockCount} available)
                </span>
              </div>

              {/* Sizing options if available */}
              {product.sizes && product.sizes.length > 0 && (
                <div className="mt-4">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-semibold text-neutral-800">Select Size:</span>
                    <button
                      onClick={() => onAskAIAboutProduct(product, `What size do you recommend for ${product.name}?`)}
                      className="text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-1 cursor-pointer"
                    >
                      <Sparkles className="w-3 h-3 text-amber-400" />
                      <span>AI Sizing Guide</span>
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((sz) => (
                      <button
                        key={sz}
                        id={`size-btn-${sz}`}
                        onClick={() => setSelectedSize(sz)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                          selectedSize === sz
                            ? 'border-neutral-900 bg-neutral-900 text-white shadow-xs'
                            : 'border-neutral-200 bg-white text-neutral-700 hover:border-neutral-400'
                        }`}
                      >
                        {sz}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Color options if available */}
              {product.colors && product.colors.length > 0 && (
                <div className="mt-4">
                  <span className="font-semibold text-neutral-800 text-xs block mb-1.5">
                    Color: <span className="text-neutral-500 font-normal">{selectedColor}</span>
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {product.colors.map((c) => (
                      <button
                        key={c}
                        onClick={() => setSelectedColor(c)}
                        className={`px-2.5 py-1 rounded-md text-xs border transition-all cursor-pointer ${
                          selectedColor === c
                            ? 'border-indigo-600 bg-indigo-50/50 text-indigo-900 font-semibold'
                            : 'border-neutral-200 text-neutral-600 hover:border-neutral-300'
                        }`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* AI Sizing & Advice Assistant Prompt Box */}
              <div className="mt-5 p-3.5 bg-gradient-to-br from-indigo-50/70 to-purple-50/40 rounded-xl border border-indigo-100">
                <div className="flex items-center gap-2 text-xs font-semibold text-indigo-900 mb-1">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Ask Lumi AI about this item:</span>
                </div>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  <button
                    onClick={() => onAskAIAboutProduct(product, `What size is best for ${product.name} and how does it fit?`)}
                    className="text-[11px] bg-white text-neutral-700 hover:text-indigo-600 px-2 py-1 rounded border border-indigo-100 hover:border-indigo-300 transition-colors cursor-pointer"
                  >
                    "Fit & Sizing advice"
                  </button>
                  <button
                    onClick={() => onAskAIAboutProduct(product, `What are the materials and care instructions for ${product.name}?`)}
                    className="text-[11px] bg-white text-neutral-700 hover:text-indigo-600 px-2 py-1 rounded border border-indigo-100 hover:border-indigo-300 transition-colors cursor-pointer"
                  >
                    "Care & washing"
                  </button>
                  <button
                    onClick={() => onAskAIAboutProduct(product, `Can I return ${product.name} within 30 days if it doesn't fit?`)}
                    className="text-[11px] bg-white text-neutral-700 hover:text-indigo-600 px-2 py-1 rounded border border-indigo-100 hover:border-indigo-300 transition-colors cursor-pointer"
                  >
                    "Return eligibility"
                  </button>
                </div>
              </div>

              {/* Product Highlights */}
              <div className="mt-4 pt-4 border-t border-neutral-100">
                <span className="text-xs font-semibold text-neutral-800 block mb-2">Key Highlights:</span>
                <ul className="space-y-1.5 text-xs text-neutral-600">
                  {product.highlights.map((h, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Warranty and Trust */}
              <div className="mt-4 grid grid-cols-3 gap-2 text-center text-[10px] text-neutral-500 py-2 border-t border-neutral-100">
                <div className="flex flex-col items-center gap-1">
                  <Truck className="w-3.5 h-3.5 text-neutral-700" />
                  <span>Free 2-Day Shipping</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <RotateCcw className="w-3.5 h-3.5 text-neutral-700" />
                  <span>30-Day Free Returns</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <Shield className="w-3.5 h-3.5 text-neutral-700" />
                  <span>1-Year Warranty</span>
                </div>
              </div>
            </div>

            {/* Action Bar */}
            <div className="mt-6 pt-4 border-t border-neutral-200 flex items-center gap-3">
              <button
                id="modal-add-to-cart-btn"
                onClick={handleAdd}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm transition-all duration-150 cursor-pointer shadow-xs ${
                  added
                    ? 'bg-emerald-600 text-white'
                    : 'bg-neutral-900 hover:bg-neutral-800 text-white'
                }`}
              >
                {added ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Added to Bag!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add to Bag • ${product.price}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
