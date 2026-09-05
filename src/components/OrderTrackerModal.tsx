import React, { useState } from 'react';
import { X, Search, Package, Truck, CheckCircle2, Clock, MapPin, Sparkles, AlertCircle } from 'lucide-react';
import { Order } from '../types';
import { SAMPLE_ORDERS } from '../data/mockStoreData';
import { PackageTransit3D } from './3d/PackageTransit3D';

interface OrderTrackerModalProps {
  isOpen: boolean;
  onClose: () => void;
  orders: Order[];
  onOpenChatWithPrompt: (prompt: string) => void;
}

export const OrderTrackerModal: React.FC<OrderTrackerModalProps> = ({
  isOpen,
  onClose,
  orders,
  onOpenChatWithPrompt
}) => {
  const [searchId, setSearchId] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order>(orders[0] || SAMPLE_ORDERS[0]);
  const [searchError, setSearchError] = useState('');

  if (!isOpen) return null;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchError('');
    const clean = searchId.trim().toUpperCase();
    const found = orders.find(o => o.id.toUpperCase() === clean || o.id.replace('ORD-', '') === clean);
    if (found) {
      setSelectedOrder(found);
    } else {
      setSearchError(`No order found matching "${searchId}". Try ORD-9421, ORD-8812, or ORD-7305.`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-neutral-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div
        id="order-tracker-modal"
        className="relative w-full max-w-2xl bg-white rounded-2xl shadow-xl overflow-hidden border border-neutral-200 animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="p-5 border-b border-neutral-200 flex items-center justify-between bg-neutral-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center">
              <Package className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-neutral-900 text-base">Real-Time Order & Shipment Tracker</h3>
              <p className="text-xs text-neutral-500">Track courier scans, estimated delivery dates, and return eligibility</p>
            </div>
          </div>
          <button
            id="close-order-tracker-btn"
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-neutral-700 rounded-lg hover:bg-neutral-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search and Quick Select */}
        <div className="p-5 border-b border-neutral-100 bg-white">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                placeholder="Enter Order ID: ORD-9421, ORD-8812, ORD-7305..."
                className="w-full pl-9 pr-3 py-2 text-xs bg-neutral-50 border border-neutral-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
            >
              Lookup
            </button>
          </form>

          {searchError && (
            <p className="text-xs text-red-500 mt-2 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>{searchError}</span>
            </p>
          )}

          {/* Quick Select Buttons */}
          <div className="flex flex-wrap items-center gap-1.5 mt-3">
            <span className="text-[11px] text-neutral-400 font-medium">Sample Orders:</span>
            {orders.slice(0, 3).map((ord) => (
              <button
                key={ord.id}
                onClick={() => {
                  setSelectedOrder(ord);
                  setSearchError('');
                }}
                className={`text-[11px] font-mono px-2.5 py-1 rounded-md border transition-colors cursor-pointer ${
                  selectedOrder.id === ord.id
                    ? 'bg-indigo-50 border-indigo-300 text-indigo-700 font-semibold'
                    : 'bg-neutral-50 border-neutral-200 text-neutral-600 hover:bg-neutral-100'
                }`}
              >
                {ord.id} ({ord.status})
              </button>
            ))}
          </div>
        </div>

        {/* Selected Order Display */}
        {selectedOrder && (
          <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
            {/* Top Status Card */}
            <div className="bg-gradient-to-r from-neutral-50 to-indigo-50/40 p-4 rounded-xl border border-neutral-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-sm text-neutral-900">{selectedOrder.id}</span>
                  <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                    selectedOrder.status === 'Delivered'
                      ? 'bg-emerald-100 text-emerald-800'
                      : selectedOrder.status === 'Shipped'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}>
                    {selectedOrder.status}
                  </span>
                </div>
                <p className="text-xs text-neutral-600 mt-1">
                  Recipient: <strong>{selectedOrder.customerName}</strong> • Ordered {selectedOrder.date}
                </p>
              </div>

              <div className="text-left sm:text-right">
                <span className="text-[11px] text-neutral-500 block">Carrier & Tracking:</span>
                <span className="text-xs font-semibold text-neutral-900 block">{selectedOrder.carrier}</span>
                <span className="text-[11px] font-mono text-indigo-600 font-medium">{selectedOrder.trackingNumber}</span>
              </div>
            </div>

            {/* Live 3D Transit Animation */}
            <div>
              <PackageTransit3D order={selectedOrder} />
            </div>

            {/* Estimated Delivery Notice */}
            <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-neutral-200">
              <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                <Truck className="w-4 h-4" />
              </div>
              <div className="text-xs">
                <span className="text-neutral-500 block">Estimated Delivery:</span>
                <span className="font-bold text-neutral-900">{selectedOrder.estimatedDelivery}</span>
              </div>
            </div>

            {/* Timeline Progress */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-700 mb-4">
                Shipment Journey:
              </h4>
              <div className="space-y-4 pl-2">
                {selectedOrder.timeline.map((step, idx) => (
                  <div key={idx} className="relative flex items-start gap-3">
                    {/* Vertical connector line */}
                    {idx < selectedOrder.timeline.length - 1 && (
                      <div
                        className={`absolute left-2.25 top-4.5 bottom-0 w-0.5 -mb-4 ${
                          step.completed ? 'bg-emerald-400' : 'bg-neutral-200'
                        }`}
                      />
                    )}

                    {/* Step Icon */}
                    <div className={`relative z-10 w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                      step.completed
                        ? 'bg-emerald-500 text-white'
                        : step.current
                        ? 'bg-indigo-600 text-white ring-4 ring-indigo-100'
                        : 'bg-neutral-200 text-neutral-400'
                    }`}>
                      {step.completed ? (
                        <CheckCircle2 className="w-3 h-3" />
                      ) : (
                        <Clock className="w-2.5 h-2.5" />
                      )}
                    </div>

                    {/* Step Content */}
                    <div className="flex-1 text-xs">
                      <div className="flex items-center justify-between">
                        <span className={`font-semibold ${step.current ? 'text-indigo-600' : 'text-neutral-900'}`}>
                          {step.title}
                        </span>
                        <span className="text-[11px] text-neutral-400">{step.time}</span>
                      </div>
                      {step.location && (
                        <p className="text-[11px] text-neutral-500 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-neutral-400" />
                          <span>{step.location}</span>
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Items Included */}
            <div className="border-t border-neutral-100 pt-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-700 mb-3">
                Items in this package ({selectedOrder.items.length}):
              </h4>
              <div className="space-y-2">
                {selectedOrder.items.map((item, i) => (
                  <div key={i} className="flex items-center gap-3 p-2 rounded-lg bg-neutral-50 border border-neutral-200">
                    <img
                      src={item.image}
                      alt={item.productName}
                      referrerPolicy="no-referrer"
                      className="w-10 h-10 object-cover rounded bg-white border border-neutral-200"
                    />
                    <div className="flex-1 min-w-0 text-xs">
                      <span className="font-semibold text-neutral-900 block truncate">{item.productName}</span>
                      <span className="text-neutral-500">Qty: {item.quantity} • {item.size || 'Standard'}</span>
                    </div>
                    <span className="font-bold text-xs text-neutral-900">${item.price}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Actions with Lumi AI */}
            <div className="p-3.5 bg-indigo-50/70 rounded-xl border border-indigo-100 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs text-indigo-950">
                <Sparkles className="w-4 h-4 text-indigo-600 shrink-0" />
                <span>Need to exchange, return, or redirect this shipment?</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    onClose();
                    onOpenChatWithPrompt(`I need to return or exchange an item from order ${selectedOrder.id}`);
                  }}
                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap"
                >
                  Return / Exchange with Lumi
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
