import React, { useState } from 'react';
import { X, Activity, Zap, CheckCircle2, TrendingUp, Users, Sliders, ShieldCheck, RefreshCw } from 'lucide-react';
import { AgentSettings, Order } from '../types';

interface StoreAdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AgentSettings;
  onUpdateSettings: (newSettings: AgentSettings) => void;
  onCreateDemoOrder: () => Order;
  onOpenOrderTracker: (order: Order) => void;
}

export const StoreAdminModal: React.FC<StoreAdminModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  onCreateDemoOrder,
  onOpenOrderTracker
}) => {
  const [activeTab, setActiveTab] = useState<'telemetry' | 'settings'>('telemetry');
  const [createdNotification, setCreatedNotification] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGenerateTestOrder = () => {
    const order = onCreateDemoOrder();
    setCreatedNotification(`Created new test order ${order.id}!`);
    setTimeout(() => setCreatedNotification(null), 3500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-neutral-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div
        id="store-admin-modal"
        className="relative w-full max-w-2xl bg-white rounded-2xl shadow-xl overflow-hidden border border-neutral-200 animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="p-5 border-b border-neutral-200 flex items-center justify-between bg-neutral-900 text-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-500 text-white flex items-center justify-center">
              <Activity className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base text-white">Agent Operations & Store Telemetry</h3>
              <p className="text-xs text-neutral-300">Live metrics and configuration for Lumi 24/7 Support Agent</p>
            </div>
          </div>
          <button
            id="close-admin-modal-btn"
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex border-b border-neutral-200 bg-neutral-50 px-5 pt-3 gap-4 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('telemetry')}
            className={`pb-3 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'telemetry'
                ? 'border-indigo-600 text-indigo-600 font-bold'
                : 'border-transparent text-neutral-500 hover:text-neutral-900'
            }`}
          >
            Live Performance Metrics
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`pb-3 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'settings'
                ? 'border-indigo-600 text-indigo-600 font-bold'
                : 'border-transparent text-neutral-500 hover:text-neutral-900'
            }`}
          >
            Agent Behavior & Policy Settings
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {activeTab === 'telemetry' ? (
            <>
              {/* Telemetry KPI Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 bg-neutral-50 rounded-xl border border-neutral-200">
                  <span className="text-[11px] font-medium text-neutral-500 block">AI Resolution Rate</span>
                  <span className="text-xl font-extrabold text-emerald-600 mt-1 block">94.8%</span>
                  <span className="text-[10px] text-neutral-400">Zero human intervention</span>
                </div>

                <div className="p-3.5 bg-neutral-50 rounded-xl border border-neutral-200">
                  <span className="text-[11px] font-medium text-neutral-500 block">Avg Response Time</span>
                  <span className="text-xl font-extrabold text-neutral-900 mt-1 block">680ms</span>
                  <span className="text-[10px] text-neutral-400">Powered by Gemini 3.8</span>
                </div>

                <div className="p-3.5 bg-neutral-50 rounded-xl border border-neutral-200">
                  <span className="text-[11px] font-medium text-neutral-500 block">Shopper CSAT</span>
                  <span className="text-xl font-extrabold text-amber-500 mt-1 block">4.92 / 5.0</span>
                  <span className="text-[10px] text-neutral-400">From 1,482 reviews</span>
                </div>

                <div className="p-3.5 bg-neutral-50 rounded-xl border border-neutral-200">
                  <span className="text-[11px] font-medium text-neutral-500 block">Assisted Sales</span>
                  <span className="text-xl font-extrabold text-indigo-600 mt-1 block">+28.4%</span>
                  <span className="text-[10px] text-neutral-400">Cart recovery lift</span>
                </div>
              </div>

              {/* Intent breakdown */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-700 mb-3">
                  Top Shopper Inquiry Categories:
                </h4>
                <div className="space-y-2 text-xs">
                  <div>
                    <div className="flex justify-between text-neutral-700 font-medium mb-1">
                      <span>Order Tracking & Delivery ETAs</span>
                      <span className="font-bold">44%</span>
                    </div>
                    <div className="w-full h-2 bg-neutral-100 rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-600 rounded-full" style={{ width: '44%' }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-neutral-700 font-medium mb-1">
                      <span>Sizing, Material & Fit Guidance</span>
                      <span className="font-bold">28%</span>
                    </div>
                    <div className="w-full h-2 bg-neutral-100 rounded-full overflow-hidden">
                      <div className="h-full bg-violet-500 rounded-full" style={{ width: '28%' }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-neutral-700 font-medium mb-1">
                      <span>30-Day Returns & Size Exchanges</span>
                      <span className="font-bold">16%</span>
                    </div>
                    <div className="w-full h-2 bg-neutral-100 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded-full" style={{ width: '16%' }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-neutral-700 font-medium mb-1">
                      <span>Discount Codes & Checkout Inquiries</span>
                      <span className="font-bold">12%</span>
                    </div>
                    <div className="w-full h-2 bg-neutral-100 rounded-full overflow-hidden">
                      <div className="h-full bg-amber-500 rounded-full" style={{ width: '12%' }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Testing Sandbox: Generate Test Order */}
              <div className="p-4 bg-indigo-50/70 rounded-xl border border-indigo-100 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div>
                  <h5 className="font-bold text-xs text-indigo-950">Store Tester Sandbox</h5>
                  <p className="text-[11px] text-indigo-800">
                    Generate a brand new simulated shipment order to test tracking in the AI chat.
                  </p>
                </div>
                <button
                  onClick={handleGenerateTestOrder}
                  className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 shadow-xs"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Generate Test Order</span>
                </button>
              </div>

              {createdNotification && (
                <div className="p-2.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{createdNotification} You can now ask Lumi: "Where is my order?"</span>
                </div>
              )}
            </>
          ) : (
            <>
              {/* Agent Settings Form */}
              <div className="space-y-4 text-xs">
                <div>
                  <label className="font-semibold text-neutral-800 block mb-1.5">
                    Agent Persona & Tone:
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'friendly', title: 'Warm & Empathetic', desc: 'Friendly, enthusiastic, supportive' },
                      { id: 'concierge', title: 'Luxury Concierge', desc: 'Refined, polished, sophisticated' },
                      { id: 'speedy', title: 'Direct & Rapid', desc: 'Bullet-pointed, ultra-concise' },
                    ].map((t) => (
                      <button
                        key={t.id}
                        onClick={() => onUpdateSettings({ ...settings, tone: t.id as any })}
                        className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                          settings.tone === t.id
                            ? 'border-indigo-600 bg-indigo-50/50 text-indigo-950 font-medium'
                            : 'border-neutral-200 text-neutral-600 hover:border-neutral-300'
                        }`}
                      >
                        <strong className="block text-xs text-neutral-900">{t.title}</strong>
                        <span className="text-[10px] text-neutral-500 mt-0.5 block">{t.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div>
                    <label className="font-semibold text-neutral-800 block mb-1">
                      Free Shipping Threshold ($):
                    </label>
                    <input
                      type="number"
                      value={settings.freeShippingThreshold}
                      onChange={(e) => onUpdateSettings({ ...settings, freeShippingThreshold: Number(e.target.value) })}
                      className="w-full p-2 bg-neutral-50 border border-neutral-300 rounded-lg text-xs"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-neutral-800 block mb-1">
                      Hassle-Free Return Window (Days):
                    </label>
                    <input
                      type="number"
                      value={settings.returnWindowDays}
                      onChange={(e) => onUpdateSettings({ ...settings, returnWindowDays: Number(e.target.value) })}
                      className="w-full p-2 bg-neutral-50 border border-neutral-300 rounded-lg text-xs"
                    />
                  </div>
                </div>

                <div className="pt-2 border-t border-neutral-100 space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.autoApplyDiscounts}
                      onChange={(e) => onUpdateSettings({ ...settings, autoApplyDiscounts: e.target.checked })}
                      className="rounded border-neutral-300 text-indigo-600"
                    />
                    <span className="text-neutral-700">Allow Lumi to automatically apply promo codes in chat</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.proactivePrompts}
                      onChange={(e) => onUpdateSettings({ ...settings, proactivePrompts: e.target.checked })}
                      className="rounded border-neutral-300 text-indigo-600"
                    />
                    <span className="text-neutral-700">Display smart follow-up suggestions after each AI response</span>
                  </label>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
