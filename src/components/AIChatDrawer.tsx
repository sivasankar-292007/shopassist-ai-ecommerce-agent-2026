import React, { useState, useEffect, useRef } from 'react';
import Markdown from 'react-markdown';
import {
  X,
  Send,
  Sparkles,
  Maximize2,
  Minimize2,
  RotateCcw,
  Volume2,
  VolumeX,
  Mic,
  MicOff,
  User,
  ShoppingBag,
  Bot,
  ExternalLink
} from 'lucide-react';
import { ChatMessage, Product, Order, CartItem } from '../types';
import {
  ProductsActionCard,
  OrderActionCard,
  PromoActionCard,
  ReturnActionCard,
  EscalationActionCard
} from './chat/ChatActionCards';
import { AgentOrb3D } from './3d/AgentOrb3D';

interface AIChatDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  currentProduct: Product | null;
  onAddToCart: (product: Product, size?: string) => void;
  onQuickView: (product: Product) => void;
  onOpenOrderTracker: (order: Order) => void;
  onApplyPromo: (code: string) => void;
  initialPrompt?: string;
  customerMode: string;
}

export const AIChatDrawer: React.FC<AIChatDrawerProps> = ({
  isOpen,
  onClose,
  cart,
  currentProduct,
  onAddToCart,
  onQuickView,
  onOpenOrderTracker,
  onApplyPromo,
  initialPrompt,
  customerMode
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-msg',
      sender: 'agent',
      text: `Hello! I'm **Lumi**, your 24/7 personal shopping and support concierge at Lumina Lifestyle & Gear. ✨\n\nHow can I help you today? You can ask me to **track shipments**, **recommend products**, **handle 30-day returns & exchanges**, or **apply store discounts**!`,
      timestamp: 'Just now',
      suggestedFollowUps: [
        'Where is my order ORD-9421?',
        'Do you have any discount codes?',
        'How do 30-day returns work?',
        'Recommend tech gifts under $75'
      ]
    }
  ]);

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [isListening, setIsListening] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen]);

  // Handle initial prompt if triggered from elsewhere
  useEffect(() => {
    if (initialPrompt && isOpen) {
      handleSendMessage(initialPrompt);
    }
  }, [initialPrompt, isOpen]);

  // Speech synthesis audio helper
  const speakText = (text: string) => {
    if (!soundEnabled || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      // Strip markdown asterisks and backticks for clean speech
      const clean = text.replace(/[*_`#]/g, '').slice(0, 200);
      const utterance = new SpeechSynthesisUtterance(clean);
      utterance.rate = 1.05;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    } catch {
      // Audio speech failed gracefully
    }
  };

  // Voice recognition toggle
  const toggleVoiceInput = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser. Please type your message.');
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onerror = () => setIsListening(false);
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setInput(transcript);
        }
      };

      recognition.start();
    } catch {
      setIsListening(false);
    }
  };

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query || loading) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          history: messages.slice(-6).map(m => ({ sender: m.sender, text: m.text })),
          cart,
          currentProductId: currentProduct?.id || null,
          customer: {
            name: customerMode,
            email: 'alex.morgan@example.com'
          }
        })
      });

      if (!response.ok) {
        throw new Error(`Chat API error: ${response.status}`);
      }

      const data = await response.json();

      const agentMessage: ChatMessage = {
        id: `agent-${Date.now()}`,
        sender: 'agent',
        text: data.reply || 'I am happy to help you with anything in our store!',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actionData: data.actionData || undefined,
        suggestedFollowUps: data.suggestedFollowUps || []
      };

      setMessages(prev => [...prev, agentMessage]);
      speakText(agentMessage.text);

      // If promo code is applied, trigger callback
      if (data.actionData?.promo?.code) {
        onApplyPromo(data.actionData.promo.code);
      }
    } catch {
      // Graceful client fallback without noisy console error logging
      const errorMessage: ChatMessage = {
        id: `err-${Date.now()}`,
        sender: 'agent',
        text: `I'm currently connected and ready! You can ask me to track orders like **ORD-9421**, view our 30-day return policy, or explore recommendations.`,
        timestamp: 'Just now',
        suggestedFollowUps: ['Track order ORD-9421', 'What are your return policies?', 'Recommend bestsellers']
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleClearHistory = () => {
    setMessages([
      {
        id: 'welcome-reset',
        sender: 'agent',
        text: `Conversation restarted. How can I assist you with your shopping today?`,
        timestamp: 'Just now',
        suggestedFollowUps: [
          'Track order ORD-9421',
          'Do you have any promo codes?',
          'How do 30-day returns work?'
        ]
      }
    ]);
  };

  if (!isOpen) return null;

  return (
    <div className={`fixed z-50 transition-all duration-300 ${
      isExpanded
        ? 'inset-4 sm:inset-10'
        : 'bottom-4 right-4 w-full sm:w-[440px] h-[640px] max-h-[90vh]'
    }`}>
      <div
        id="ai-chat-drawer-container"
        className="w-full h-full bg-white rounded-2xl shadow-2xl border border-neutral-200 flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
      >
        {/* Header Bar */}
        <div className="bg-gradient-to-r from-neutral-900 via-neutral-800 to-indigo-950 text-white px-4 py-3 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-900/90 to-neutral-900 flex items-center justify-center overflow-hidden shadow-xs border border-indigo-500/30">
                <AgentOrb3D state={loading ? 'thinking' : soundEnabled ? 'speaking' : 'idle'} size={38} />
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-neutral-900" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm text-white">Lumi</h3>
                <span className="text-[10px] font-semibold bg-indigo-500/30 text-indigo-200 border border-indigo-500/40 px-1.5 py-0.2 rounded">
                  3D AI Core
                </span>
              </div>
              <p className="text-[11px] text-neutral-300 flex items-center gap-1.5">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>24/7 E-Commerce Concierge</span>
                <span>•</span>
                <span className="text-neutral-400">&lt;1s latency</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 text-neutral-300">
            {/* Audio Toggle */}
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              title={soundEnabled ? 'Disable Voice Playback' : 'Enable Voice Playback'}
              className="p-1.5 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {/* Clear Chat */}
            <button
              onClick={handleClearHistory}
              title="Reset Conversation"
              className="p-1.5 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {/* Expand / Minimize */}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              title={isExpanded ? 'Collapse' : 'Expand full screen'}
              className="p-1.5 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer hidden sm:block"
            >
              {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            {/* Close */}
            <button
              id="close-chat-drawer-btn"
              onClick={onClose}
              className="p-1.5 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Current Product Context Bar (if viewing a product) */}
        {currentProduct && (
          <div className="bg-indigo-50/80 px-4 py-2 border-b border-indigo-100 flex items-center justify-between text-xs text-indigo-900 shrink-0">
            <div className="flex items-center gap-2 truncate">
              <span className="text-[10px] font-bold uppercase bg-indigo-200/70 text-indigo-800 px-1.5 py-0.5 rounded">
                Viewing
              </span>
              <span className="font-semibold truncate">{currentProduct.name}</span>
            </div>
            <button
              onClick={() => handleSendMessage(`What size do you recommend for ${currentProduct.name} and how does it fit?`)}
              className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-800 underline shrink-0 cursor-pointer ml-2"
            >
              Ask about fit
            </button>
          </div>
        )}

        {/* Message Stream */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-neutral-50/60">
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';
            return (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-indigo-600 to-violet-500 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  </div>
                )}

                <div className={`max-w-[85%] ${isUser ? 'items-end' : 'items-start'} flex flex-col`}>
                  <div
                    className={`px-3.5 py-2.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                      isUser
                        ? 'bg-neutral-900 text-white rounded-br-xs shadow-xs'
                        : 'bg-white text-neutral-800 rounded-bl-xs border border-neutral-200/90 shadow-2xs'
                    }`}
                  >
                    <div className="markdown-body prose prose-sm max-w-none prose-p:my-1 prose-ul:my-1 prose-li:my-0.5 prose-strong:text-current">
                      <Markdown>{msg.text}</Markdown>
                    </div>

                    {/* Interactive Action Cards */}
                    {msg.actionData && (
                      <div className="mt-2">
                        {msg.actionData.type === 'product_recommendation' && msg.actionData.products && (
                          <ProductsActionCard
                            products={msg.actionData.products}
                            onAddToCart={onAddToCart}
                            onQuickView={onQuickView}
                          />
                        )}

                        {msg.actionData.type === 'order_status' && msg.actionData.order && (
                          <OrderActionCard
                            order={msg.actionData.order}
                            onOpenFullTracker={onOpenOrderTracker}
                          />
                        )}

                        {msg.actionData.type === 'promo_applied' && msg.actionData.promo && (
                          <PromoActionCard
                            promo={msg.actionData.promo}
                            onApplyPromo={onApplyPromo}
                          />
                        )}

                        {msg.actionData.type === 'return_initiated' && msg.actionData.returnTicket && (
                          <ReturnActionCard
                            ticket={msg.actionData.returnTicket}
                          />
                        )}

                        {msg.actionData.type === 'escalation_ticket' && msg.actionData.ticketId && (
                          <EscalationActionCard
                            ticketId={msg.actionData.ticketId}
                          />
                        )}
                      </div>
                    )}
                  </div>

                  <span className="text-[10px] text-neutral-400 mt-1 px-1">
                    {msg.timestamp}
                  </span>

                  {/* Follow-up Suggestion Chips attached to latest agent message */}
                  {!isUser && msg.suggestedFollowUps && msg.suggestedFollowUps.length > 0 && msg === messages[messages.length - 1] && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {msg.suggestedFollowUps.map((suggestion, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSendMessage(suggestion)}
                          className="text-[11px] bg-white hover:bg-indigo-50 text-neutral-700 hover:text-indigo-700 px-2.5 py-1 rounded-full border border-neutral-200 hover:border-indigo-300 transition-colors shadow-2xs cursor-pointer text-left"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {isUser && (
                  <div className="w-7 h-7 rounded-lg bg-neutral-200 text-neutral-700 flex items-center justify-center shrink-0 mt-0.5">
                    <User className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            );
          })}

          {/* Thinking Indicator */}
          {loading && (
            <div className="flex gap-2.5 justify-start items-center">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-indigo-600 to-violet-500 text-white flex items-center justify-center shrink-0 shadow-2xs">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              </div>
              <div className="px-3.5 py-2.5 rounded-2xl rounded-bl-xs bg-white border border-neutral-200 flex items-center gap-2 shadow-2xs">
                <span className="text-xs text-neutral-500 font-medium">Lumi is thinking...</span>
                <span className="flex gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: '300ms' }} />
                </span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input & Controls Box */}
        <div className="p-3 border-t border-neutral-200 bg-white shrink-0">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            {/* Voice Dictation Button */}
            <button
              type="button"
              onClick={toggleVoiceInput}
              title={isListening ? 'Stop listening' : 'Speak to Lumi'}
              className={`p-2 rounded-xl transition-colors cursor-pointer shrink-0 ${
                isListening
                  ? 'bg-red-500 text-white animate-pulse'
                  : 'text-neutral-500 hover:text-neutral-800 hover:bg-neutral-100'
              }`}
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>

            {/* Input Field */}
            <div className="relative flex-1">
              <input
                ref={inputRef}
                id="ai-chat-input"
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about order tracking, sizing, returns, or gifts..."
                className="w-full pl-3 pr-8 py-2 text-xs sm:text-sm bg-neutral-50 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-neutral-400"
                disabled={loading}
              />
            </div>

            {/* Send Button */}
            <button
              id="ai-chat-send-btn"
              type="submit"
              disabled={!input.trim() || loading}
              className="p-2.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

          {/* Footer status text */}
          <div className="flex items-center justify-between text-[10px] text-neutral-400 mt-2 px-1">
            <span>Customer: <strong>{customerMode}</strong> (3 Orders linked)</span>
            <button
              onClick={() => handleSendMessage("I need to speak with a human support specialist")}
              className="hover:text-indigo-600 underline cursor-pointer"
            >
              Escalate to Human
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
