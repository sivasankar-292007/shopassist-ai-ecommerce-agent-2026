import React from 'react';
import { Product, Order, ReturnTicket } from '../../types';
import { Package, Truck, Tag, RotateCcw, Check, ShoppingBag, ExternalLink, LifeBuoy, ArrowRight } from 'lucide-react';

interface ProductCardProps {
  products: Product[];
  onAddToCart: (product: Product, size?: string) => void;
  onQuickView: (product: Product) => void;
}

export const ProductsActionCard: React.FC<ProductCardProps> = ({
  products,
  onAddToCart,
  onQuickView
}) => {
  const [addedId, setAddedId] = React.useState<string | null>(null);

  const handleAdd = (p: Product) => {
    onAddToCart(p, p.sizes ? p.sizes[0] : undefined);
    setAddedId(p.id);
    setTimeout(() => setAddedId(null), 1500);
  };

  return (
    <div className="mt-3 space-y-2">
      <div className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider">
        Recommended Items:
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {products.map((product) => (
          <div
            key={product.id}
            onClick={() => onQuickView(product)}
            className="flex items-center gap-2.5 p-2 bg-white rounded-xl border border-neutral-200 hover:border-indigo-300 hover:shadow-xs transition-all cursor-pointer group"
          >
            <img
              src={product.image}
              alt={product.name}
              referrerPolicy="no-referrer"
              className="w-14 h-14 object-cover rounded-lg bg-neutral-100 shrink-0 border border-neutral-100"
            />
            <div className="flex-1 min-w-0">
              <h5 className="font-semibold text-xs text-neutral-900 truncate group-hover:text-indigo-600 transition-colors">
                {product.name}
              </h5>
              <p className="text-[10px] text-neutral-500 line-clamp-1 mt-0.5">
                {product.tagline}
              </p>
              <div className="flex items-center justify-between mt-1">
                <span className="font-bold text-xs text-neutral-900">${product.price}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAdd(product);
                  }}
                  className={`px-2 py-0.5 rounded text-[11px] font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                    addedId === product.id
                      ? 'bg-emerald-600 text-white'
                      : 'bg-neutral-900 hover:bg-neutral-800 text-white'
                  }`}
                >
                  {addedId === product.id ? (
                    <>
                      <Check className="w-3 h-3" />
                      <span>Added</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-3 h-3" />
                      <span>Add</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

interface OrderCardProps {
  order: Order;
  onOpenFullTracker: (order: Order) => void;
}

export const OrderActionCard: React.FC<OrderCardProps> = ({ order, onOpenFullTracker }) => {
  return (
    <div className="mt-3 bg-white rounded-xl border border-neutral-200 p-3.5 shadow-2xs space-y-3">
      <div className="flex items-center justify-between border-b border-neutral-100 pb-2.5">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Package className="w-3.5 h-3.5" />
          </div>
          <div>
            <span className="font-mono font-bold text-xs text-neutral-900">{order.id}</span>
            <span className="text-[10px] text-neutral-400 block">{order.carrier} • {order.trackingNumber}</span>
          </div>
        </div>
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
          order.status === 'Delivered'
            ? 'bg-emerald-100 text-emerald-800'
            : order.status === 'Shipped'
            ? 'bg-blue-100 text-blue-800'
            : 'bg-amber-100 text-amber-800'
        }`}>
          {order.status}
        </span>
      </div>

      <div className="flex items-center gap-2 text-xs">
        <Truck className="w-3.5 h-3.5 text-neutral-500" />
        <span className="text-neutral-500">Estimated Delivery:</span>
        <span className="font-bold text-neutral-900">{order.estimatedDelivery}</span>
      </div>

      <div className="flex items-center gap-2 pt-1">
        <button
          onClick={() => onOpenFullTracker(order)}
          className="w-full py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-semibold rounded-lg flex items-center justify-center gap-1 transition-colors cursor-pointer"
        >
          <span>View Detailed Timeline</span>
          <ArrowRight className="w-3.5 h-3.5 text-neutral-600" />
        </button>
      </div>
    </div>
  );
};

interface PromoCardProps {
  promo: { code: string; discountText: string };
  onApplyPromo: (code: string) => void;
}

export const PromoActionCard: React.FC<PromoCardProps> = ({ promo, onApplyPromo }) => {
  const [applied, setApplied] = React.useState(false);

  const handleApply = () => {
    onApplyPromo(promo.code);
    setApplied(true);
    setTimeout(() => setApplied(false), 2000);
  };

  return (
    <div className="mt-3 bg-gradient-to-r from-emerald-50 to-teal-50/50 border border-dashed border-emerald-300 rounded-xl p-3 flex items-center justify-between gap-3">
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
          <Tag className="w-4 h-4" />
        </div>
        <div>
          <span className="text-[11px] font-bold text-emerald-900 uppercase tracking-wide block">
            {promo.discountText}
          </span>
          <span className="font-mono text-xs font-semibold text-emerald-700 bg-emerald-100/70 px-1.5 py-0.5 rounded">
            {promo.code}
          </span>
        </div>
      </div>

      <button
        onClick={handleApply}
        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
          applied
            ? 'bg-emerald-700 text-white'
            : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
        }`}
      >
        {applied ? 'Applied to Cart!' : 'Apply Code'}
      </button>
    </div>
  );
};

interface ReturnTicketProps {
  ticket: ReturnTicket;
}

export const ReturnActionCard: React.FC<ReturnTicketProps> = ({ ticket }) => {
  return (
    <div className="mt-3 bg-white rounded-xl border border-neutral-200 p-3.5 space-y-2.5 shadow-2xs">
      <div className="flex items-center justify-between border-b border-neutral-100 pb-2">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <RotateCcw className="w-3.5 h-3.5" />
          </div>
          <div>
            <span className="font-mono font-bold text-xs text-neutral-900">{ticket.ticketId}</span>
            <span className="text-[10px] text-neutral-400 block">Order: {ticket.orderId}</span>
          </div>
        </div>
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
          {ticket.status}
        </span>
      </div>

      <div className="text-xs space-y-1 text-neutral-600">
        <div className="flex justify-between">
          <span>Action Requested:</span>
          <strong className="text-neutral-900 capitalize">{ticket.type} ({ticket.exchangeSize})</strong>
        </div>
        <div className="flex justify-between">
          <span>Return Window:</span>
          <strong className="text-emerald-600">30-Day Free Return Active</strong>
        </div>
      </div>

      <div className="pt-2 border-t border-neutral-100 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 text-[11px] text-neutral-500">
          <Check className="w-3.5 h-3.5 text-emerald-500" />
          <span>Prepaid QR / FedEx Label Ready</span>
        </div>
        <a
          href="#label"
          onClick={(e) => {
            e.preventDefault();
            alert(`Prepaid return label for ${ticket.ticketId} generated! Drop off at any USPS or FedEx location.`);
          }}
          className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
        >
          <span>Print / QR Code</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </div>
  );
};

interface EscalationProps {
  ticketId: string;
}

export const EscalationActionCard: React.FC<EscalationProps> = ({ ticketId }) => {
  return (
    <div className="mt-3 bg-neutral-900 text-white rounded-xl p-3.5 space-y-2 shadow-xs">
      <div className="flex items-center gap-2">
        <LifeBuoy className="w-4 h-4 text-amber-400" />
        <span className="font-bold text-xs text-white">Tier-2 Human Escalation Created</span>
      </div>
      <p className="text-xs text-neutral-300 leading-relaxed">
        Reference Ticket: <strong className="font-mono text-amber-300">#{ticketId}</strong>.
        Our Senior Specialist Desk has been alerted and will respond via email within 15 minutes.
      </p>
    </div>
  );
};
