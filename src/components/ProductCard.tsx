import React from 'react';
import { Star, Sparkles, Plus, Check } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onQuickView: (product: Product) => void;
  onAddToCart: (product: Product, size?: string) => void;
  onAskAIAboutProduct: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onQuickView,
  onAddToCart,
  onAskAIAboutProduct
}) => {
  const [added, setAdded] = React.useState(false);

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    const defaultSize = product.sizes ? product.sizes[0] : undefined;
    onAddToCart(product, defaultSize);
    setAdded(true);
    setTimeout(() => setAdded(false), 1400);
  };

  const handleAskAI = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAskAIAboutProduct(product);
  };

  return (
    <div
      id={`product-card-${product.id}`}
      onClick={() => onQuickView(product)}
      className="group flex flex-col bg-white rounded-xl border border-neutral-200 overflow-hidden hover:border-neutral-300 hover:shadow-md transition-all duration-200 cursor-pointer"
    >
      {/* Product Image Stage */}
      <div className="relative aspect-square w-full bg-neutral-100 overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />

        {/* Category & Badge */}
        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
          <span className="text-[11px] font-semibold bg-white/90 backdrop-blur px-2 py-0.5 rounded text-neutral-800 shadow-xs border border-neutral-100">
            {product.category}
          </span>
          <span className="text-[10px] font-bold bg-indigo-50/90 text-indigo-700 backdrop-blur px-1.5 py-0.5 rounded border border-indigo-200/80 shadow-2xs">
            3D View
          </span>
          {product.originalPrice && (
            <span className="text-[10px] font-bold bg-amber-500 text-white px-1.5 py-0.5 rounded shadow-xs">
              SALE
            </span>
          )}
        </div>

        {/* Ask Lumi floating button on image hover */}
        <button
          id={`ask-ai-product-${product.id}`}
          onClick={handleAskAI}
          title="Ask Lumi AI about sizing, materials, or compatibility"
          className="absolute bottom-2.5 right-2.5 flex items-center gap-1 text-xs font-medium bg-neutral-900/85 hover:bg-neutral-900 text-white backdrop-blur px-2.5 py-1 rounded-full shadow transition-all duration-150 transform hover:scale-105 z-10"
        >
          <Sparkles className="w-3 h-3 text-amber-300" />
          <span>Ask Lumi</span>
        </button>
      </div>

      {/* Product Information */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Rating */}
          <div className="flex items-center gap-1 text-xs text-neutral-500 mb-1.5">
            <div className="flex text-amber-400">
              <Star className="w-3.5 h-3.5 fill-current" />
            </div>
            <span className="font-semibold text-neutral-800">{product.rating}</span>
            <span className="text-neutral-400">({product.reviewsCount})</span>
          </div>

          {/* Title */}
          <h3 className="font-semibold text-neutral-900 text-sm leading-snug line-clamp-1 group-hover:text-indigo-600 transition-colors">
            {product.name}
          </h3>

          {/* Tagline */}
          <p className="text-xs text-neutral-500 mt-1 line-clamp-2 leading-relaxed">
            {product.tagline}
          </p>
        </div>

        {/* Footer: Price & Add to Cart */}
        <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between">
          <div className="flex items-baseline gap-1.5">
            <span className="font-bold text-neutral-900 text-base">${product.price}</span>
            {product.originalPrice && (
              <span className="text-xs text-neutral-400 line-through">${product.originalPrice}</span>
            )}
          </div>

          <button
            id={`add-to-cart-btn-${product.id}`}
            onClick={handleAdd}
            className={`flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all duration-150 cursor-pointer ${
              added
                ? 'bg-emerald-600 text-white'
                : 'bg-neutral-900 hover:bg-neutral-800 text-white'
            }`}
          >
            {added ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Added</span>
              </>
            ) : (
              <>
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
