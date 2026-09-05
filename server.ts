import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import { GoogleGenAI, Type, type FunctionDeclaration } from '@google/genai';
import { PRODUCTS, SAMPLE_ORDERS, PROMO_CODES, STORE_INFO, STORE_POLICIES_FAQ } from './src/data/mockStoreData.ts';
import type { Order, ReturnTicket } from './src/types.ts';

dotenv.config({ quiet: true });

const app = express();
const PORT = 3000;

app.use(express.json());

// In-memory store state for demo orders & return tickets
const ordersDatabase: Record<string, Order> = {};
SAMPLE_ORDERS.forEach(order => {
  ordersDatabase[order.id.toUpperCase()] = { ...order };
});

const returnTickets: Record<string, ReturnTicket> = {};

// Helper: Initialize Gemini safely
let genAI: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  if (!genAI) {
    genAI = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build'
        }
      }
    });
  }
  return genAI;
}

// -------------------------------------------------------------
// Tool Definitions for Gemini Function Calling
// -------------------------------------------------------------
const trackOrderTool: FunctionDeclaration = {
  name: 'track_order',
  description: 'Lookup the real-time shipping status, courier tracking, and timeline for an order ID (e.g., ORD-9421, ORD-8812, ORD-7305).',
  parameters: {
    type: Type.OBJECT,
    properties: {
      orderId: {
        type: Type.STRING,
        description: 'The order identifier, e.g. ORD-9421 or 9421.'
      }
    },
    required: ['orderId']
  }
};

const searchProductsTool: FunctionDeclaration = {
  name: 'search_products',
  description: 'Search or filter products in the Lumina store catalog by keywords, category, or maximum price.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      query: {
        type: Type.STRING,
        description: 'Search keywords such as backpack, overshirt, wool, headphones, shoes, bottle, pen, etc.'
      },
      category: {
        type: Type.STRING,
        description: 'Filter by category: Apparel, Footwear, Accessories, Tech & EDC.'
      },
      maxPrice: {
        type: Type.NUMBER,
        description: 'Upper price limit in USD.'
      }
    }
  }
};

const initiateReturnTool: FunctionDeclaration = {
  name: 'initiate_return',
  description: 'Initiate a 30-day hassle-free return or size exchange for a delivered order. Generates a prepaid return shipping label and confirmation ticket.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      orderId: {
        type: Type.STRING,
        description: 'The order ID to return or exchange, e.g. ORD-8812.'
      },
      type: {
        type: Type.STRING,
        description: 'Either "refund" (money back) or "exchange" (replacement item/size).'
      },
      reason: {
        type: Type.STRING,
        description: 'Shopper reason (e.g., wrong size, changed mind, defective).'
      },
      exchangeSize: {
        type: Type.STRING,
        description: 'If type is exchange, the requested new size (e.g. L instead of M).'
      }
    },
    required: ['orderId', 'type', 'reason']
  }
};

const applyPromoTool: FunctionDeclaration = {
  name: 'apply_promo',
  description: 'Check and recommend valid discount promo codes (e.g. WELCOME15, SAVENOW20, FREESHIP) for the shopper.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      code: {
        type: Type.STRING,
        description: 'Promo code to validate and apply.'
      }
    },
    required: ['code']
  }
};

const escalateToHumanTool: FunctionDeclaration = {
  name: 'escalate_to_human',
  description: 'Escalate to a human support agent when the user is unsatisfied, encounters a complex shipping dispute, or explicitly requests human assistance.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      summary: {
        type: Type.STRING,
        description: 'Brief summary of the issue to hand over to the human support agent.'
      },
      urgency: {
        type: Type.STRING,
        description: 'Urgency level: low, medium, or high.'
      }
    },
    required: ['summary']
  }
};

// -------------------------------------------------------------
// Tool Execution Handlers
// -------------------------------------------------------------
function executeTrackOrder(orderIdInput: string) {
  const normalized = orderIdInput.trim().toUpperCase().replace(/^#/, '');
  const idToFind = normalized.startsWith('ORD-') ? normalized : `ORD-${normalized}`;
  const found = ordersDatabase[idToFind] || Object.values(ordersDatabase).find(o => o.id.toUpperCase().includes(normalized));
  if (found) {
    return {
      found: true,
      order: found,
      message: `Found Order ${found.id} for ${found.customerName}. Status is currently '${found.status}', estimated delivery is ${found.estimatedDelivery} via ${found.carrier} (Tracking: ${found.trackingNumber}).`
    };
  }
  return {
    found: false,
    message: `Could not locate order '${orderIdInput}'. Valid demo order IDs in the system are ORD-9421 (Shipped), ORD-8812 (Delivered), and ORD-7305 (Processing).`
  };
}

function executeSearchProducts(query?: string, category?: string, maxPrice?: number) {
  let list = [...PRODUCTS];
  if (category) {
    list = list.filter(p => p.category.toLowerCase() === category.toLowerCase());
  }
  if (maxPrice) {
    list = list.filter(p => p.price <= maxPrice);
  }
  if (query) {
    const q = query.toLowerCase();
    list = list.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.tagline.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.highlights.some(h => h.toLowerCase().includes(q))
    );
  }
  return {
    count: list.length,
    products: list.slice(0, 4)
  };
}

function executeInitiateReturn(orderIdInput: string, type: string, reason: string, exchangeSize?: string) {
  const normalized = orderIdInput.trim().toUpperCase();
  const idToFind = normalized.startsWith('ORD-') ? normalized : `ORD-${normalized}`;
  const order = ordersDatabase[idToFind];

  if (!order) {
    return {
      success: false,
      message: `Order ${orderIdInput} was not found. Please provide a valid order ID such as ORD-8812.`
    };
  }

  const ticketId = `RET-${Math.floor(100000 + Math.random() * 900000)}`;
  const ticket: ReturnTicket = {
    ticketId,
    orderId: order.id,
    productName: order.items[0]?.productName || 'Order Items',
    type: type.toLowerCase() === 'exchange' ? 'exchange' : 'refund',
    exchangeSize: exchangeSize || 'Requested replacement size',
    reason,
    status: 'Label Generated',
    prepaidLabelUrl: `https://tracking.luminalifestyle.com/labels/${ticketId}.pdf`,
    createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  };

  returnTickets[ticketId] = ticket;

  return {
    success: true,
    ticket,
    message: `Return request approved! Ticket ${ticketId} created. Prepaid USPS/FedEx return shipping label generated. Original payment or replacement will be processed immediately upon drop-off scan.`
  };
}

function executeApplyPromo(code: string) {
  const cleanCode = code.trim().toUpperCase();
  const found = PROMO_CODES.find(p => p.code.toUpperCase() === cleanCode);
  if (found) {
    return {
      valid: true,
      promo: {
        code: found.code,
        discountText: found.discountType === 'percentage'
          ? (found.discountValue === 0 ? 'Free Express Shipping' : `${found.discountValue}% OFF`)
          : `$${found.discountValue} OFF`,
        description: found.description
      }
    };
  }
  return {
    valid: false,
    message: `Promo code "${code}" is invalid or expired. Valid store codes include WELCOME15 (15% off first order) and SAVENOW20 ($20 off $100+).`
  };
}

// -------------------------------------------------------------
// Intelligent Deterministic Assistant Fallback Engine
// -------------------------------------------------------------
function generateFallbackResponse(userMessage: string, context?: any) {
  const lower = userMessage.toLowerCase();
  let text = '';
  let actionData: any = null;
  let suggestedFollowUps: string[] = [];

  // Order tracking detection
  const orderMatch = lower.match(/(ord-\d+|\b\d{4}\b)/i);
  if (lower.includes('track') || lower.includes('where is my order') || lower.includes('package') || lower.includes('shipping status') || orderMatch) {
    const orderIdToLookup = orderMatch ? orderMatch[0].toUpperCase() : 'ORD-9421';
    const trackResult = executeTrackOrder(orderIdToLookup);

    if (trackResult.found && trackResult.order) {
      text = `I located your order **${trackResult.order.id}**! 📦\n\nIt is currently **${trackResult.order.status}** with ${trackResult.order.carrier}. Estimated delivery is **${trackResult.order.estimatedDelivery}**. Tracking number: \`${trackResult.order.trackingNumber}\`.\n\nHere is your real-time shipment breakdown below:`;
      actionData = {
        type: 'order_status',
        order: trackResult.order
      };
      suggestedFollowUps = ['Can I change my delivery address?', 'How do I return this order?', 'What is in ORD-8812?'];
    } else {
      text = `I couldn't find an order matching "${orderIdToLookup}". In this demo store, you can try tracking:\n- **ORD-9421** (Aerolite Backpack - Shipped)\n- **ORD-8812** (Merino Wool Overshirt - Delivered)\n- **ORD-7305** (SoundPulse Headphones - Processing)`;
      suggestedFollowUps = ['Track ORD-9421', 'Track ORD-8812', 'Track ORD-7305'];
    }
  }
  // Return or exchange
  else if (lower.includes('return') || lower.includes('exchange') || lower.includes('refund') || lower.includes('send back')) {
    const returnResult = executeInitiateReturn('ORD-8812', lower.includes('exchange') ? 'exchange' : 'refund', 'Fit or preference adjustment', 'L');
    text = `We offer a **30-day hassle-free return and free exchange policy**! ✨\n\nI can generate an instant prepaid shipping label right away for your delivered items (e.g. order **ORD-8812**). No printer needed—couriers can scan the mobile QR code at drop-off.\n\nHere are your return ticket details:`;
    actionData = {
      type: 'return_initiated',
      returnTicket: returnResult.ticket
    };
    suggestedFollowUps = ['How long do refunds take?', 'Exchange for a different color', 'Track return shipment'];
  }
  // Shipping, delivery & international inquiries
  else if (lower.includes('shipping') || lower.includes('delivery') || lower.includes('deliver') || lower.includes('how long') || lower.includes('arrive') || lower.includes('carrier') || lower.includes('international')) {
    text = `Here is our complete **Shipping & Delivery Guide** 🚚:\n\n- **Free Standard Shipping**: On all orders over **$50** (otherwise $8 flat rate). Delivered within **3–5 business days**.\n- **Express 1–2 Day Delivery**: Available for $15, or **FREE** when you use promo code **FREESHIP**!\n- **Same-Day Dispatch**: Orders placed before 2:00 PM EST ship the very same business day.\n- **International Shipping**: We ship to 45+ countries with prepaid duties (DDP), taking 5–9 business days.\n\nAll orders include live GPS checkpoint tracking from our fulfillment hub!`;
    actionData = {
      type: 'promo_applied',
      promo: {
        code: 'FREESHIP',
        discountText: 'FREE Express 1-2 Day Shipping'
      }
    };
    suggestedFollowUps = ['Apply FREESHIP to cart', 'Track order ORD-9421', 'What is your return policy?'];
  }
  // Warranty, materials & sustainability
  else if (lower.includes('warranty') || lower.includes('guarantee') || lower.includes('sustainable') || lower.includes('material') || lower.includes('quality') || lower.includes('eco')) {
    text = `We stand behind everything we build! 🌿\n\n- **1-Year Comprehensive Warranty**: Covers all Lumina backpacks, EDC gear, and electronics against manufacturing defects.\n- **Ethical & Sustainable Materials**: 100% GOTS-certified organic cotton French terry, non-mulesed Australian Merino wool, and recycled Cordura.\n- **Zero Plastic Packaging**: Every order arrives in 100% recyclable FSC-certified paper packaging.\n- **Fit Guarantee**: Free instant 1-click size exchanges if anything isn't a perfect fit.`;
    suggestedFollowUps = ['Explore sustainable apparel', 'Do you have discounts?', 'Check return policy'];
  }
  // Specific product check by name or keyword
  else if (PRODUCTS.some(p => lower.includes(p.name.toLowerCase()) || lower.includes(p.name.split(' ')[0].toLowerCase()))) {
    const matchedProduct = PRODUCTS.find(p => lower.includes(p.name.toLowerCase()) || lower.includes(p.name.split(' ')[0].toLowerCase())) || PRODUCTS[0];
    text = `Here are the specifications for **${matchedProduct.name}** ($${matchedProduct.price}):\n\n- **Tagline**: ${matchedProduct.tagline}\n- **Rating**: ⭐ ${matchedProduct.rating}/5.0 (${matchedProduct.reviewsCount} verified reviews)\n- **Stock**: In stock (${matchedProduct.stockCount} units available)\n- **Sizing / Fit**: ${matchedProduct.sizingAdvice}\n- **Materials & Care**: ${matchedProduct.materialsCare}\n\nYou can also click **"3D View"** on the product card to inspect this item in 360° 3D with interactive color switching!`;
    actionData = {
      type: 'product_recommendation',
      products: [matchedProduct]
    };
    suggestedFollowUps = [`Add ${matchedProduct.name} to cart`, 'Do you have promo codes?', 'What are the shipping times?'];
  }
  // Discount or promo codes
  else if (lower.includes('discount') || lower.includes('promo') || lower.includes('coupon') || lower.includes('deal') || lower.includes('welcome15') || lower.includes('savenow20') || lower.includes('code') || lower.includes('save')) {
    const promo = PROMO_CODES[0];
    text = `Here is our exclusive shopper welcome discount! 🎉 Use code **${promo.code}** for **15% off** your order today. We also have **SAVENOW20** for $20 off orders over $100, and **FREESHIP** for complimentary express delivery!`;
    actionData = {
      type: 'promo_applied',
      promo: {
        code: promo.code,
        discountText: '15% OFF Storewide'
      }
    };
    suggestedFollowUps = ['Apply WELCOME15 to cart', 'Recommend bestsellers under $100', 'Do you offer free shipping?'];
  }
  // Sizing or fit guidance
  else if (lower.includes('size') || lower.includes('fit') || lower.includes('measurement') || lower.includes('true to size')) {
    text = `Our apparel and footwear are engineered with precision sizing! 📏\n\n- **Merino Wool Overshirt**: Regular tailored fit. Fits true to size. If you plan to layer thick sweaters underneath, size up one size.\n- **CloudKnit Hoodie**: Relaxed streetwear cut. Stick with your normal size for a casual drape, or size down for a slim fit.\n- **Vanguard Sneakers**: Snug athletic fit. For wider feet or thick socks, consider a half size up.\n\nBest of all, all size exchanges are 100% free with priority shipping under our **Fit Guarantee**!`;
    suggestedFollowUps = ['Show me the Merino Wool Overshirt', 'Show me the Vanguard Sneakers', 'Check return policy'];
  }
  // Recommendations or shopping ideas
  else if (lower.includes('recommend') || lower.includes('gift') || lower.includes('popular') || lower.includes('best') || lower.includes('backpack') || lower.includes('tech') || lower.includes('jacket') || lower.includes('headphones')) {
    let matches = PRODUCTS.slice(0, 3);
    if (lower.includes('tech') || lower.includes('audio') || lower.includes('headphone') || lower.includes('edc')) {
      matches = PRODUCTS.filter(p => p.category === 'Tech & EDC').slice(0, 3);
    } else if (lower.includes('clothes') || lower.includes('shirt') || lower.includes('apparel') || lower.includes('hoodie')) {
      matches = PRODUCTS.filter(p => p.category === 'Apparel').slice(0, 3);
    }
    text = `Here are our top-rated recommendations tailored for everyday performance and urban commute! Each item features premium sustainable materials and comes with a 1-year guarantee:`;
    actionData = {
      type: 'product_recommendation',
      products: matches
    };
    suggestedFollowUps = ['Tell me about the Aerolite Backpack', 'Do you have discounts available?', 'What is your shipping policy?'];
  }
  // Human escalation
  else if (lower.includes('human') || lower.includes('representative') || lower.includes('agent') || lower.includes('manager') || lower.includes('speak to someone') || lower.includes('person')) {
    const ticketId = `ESC-${Math.floor(1000 + Math.random() * 9000)}`;
    text = `I have prioritized your request and opened human escalation ticket **#${ticketId}** with our Senior Customer Care Team. An agent will follow up via email within 15 minutes. In the meantime, I am always here to assist with any order lookups or store details!`;
    actionData = {
      type: 'escalation_ticket',
      ticketId
    };
    suggestedFollowUps = ['Check order status while I wait', 'View return instructions'];
  }
  // General store assistance
  else {
    text = `Hello! I'm **Lumi**, your 24/7 personal shopping and support concierge at ${STORE_INFO.name}. 🛍️\n\nI can assist you instantly with:\n- **Order Tracking & ETA**: Check status, tracking codes, or transit updates for any order\n- **Personalized Recommendations**: Find the perfect apparel, tech carry, or footwear for your lifestyle\n- **Hassle-Free Returns & Exchanges**: 30-day instant prepaid return label generation\n- **Sizing & Care Advice**: Exact measurements, fit guarantee, and wash instructions\n- **Discounts & Checkout**: Active promo codes (like **WELCOME15**) and cart help\n\nHow can I help you today?`;
    suggestedFollowUps = ['Where is my order ORD-9421?', 'Recommend best gifts under $100', 'Do you have any promo codes?', 'How do returns work?'];
  }

  return { text, actionData, suggestedFollowUps };
}

// -------------------------------------------------------------
// API Endpoints
// -------------------------------------------------------------

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    store: STORE_INFO.name,
    hasGeminiKey: Boolean(process.env.GEMINI_API_KEY)
  });
});

// Products catalog endpoint
app.get('/api/products', (req, res) => {
  const { category, query, maxPrice } = req.query;
  const result = executeSearchProducts(
    query as string | undefined,
    category as string | undefined,
    maxPrice ? Number(maxPrice) : undefined
  );
  res.json({ products: result.products });
});

// Single product
app.get('/api/products/:id', (req, res) => {
  const product = PRODUCTS.find(p => p.id === req.params.id);
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }
  res.json({ product });
});

// Order tracking endpoint
app.get('/api/orders/:orderId', (req, res) => {
  const result = executeTrackOrder(req.params.orderId);
  if (!result.found) {
    return res.status(404).json({ error: result.message });
  }
  res.json({ order: result.order });
});

// Returns endpoint
app.post('/api/returns', (req, res) => {
  const { orderId, type, reason, exchangeSize } = req.body;
  const result = executeInitiateReturn(orderId, type || 'refund', reason || 'Customer request', exchangeSize);
  res.json(result);
});

// Validate promo code
app.post('/api/promo/validate', (req, res) => {
  const { code } = req.body;
  const result = executeApplyPromo(code || '');
  res.json(result);
});

// Model rate-limit / quota cooldown registry
const modelCooldownUntil: Record<string, number> = {};

// Resilient multi-model caller with clean timer cleanup and unhandled rejection protection
async function callGeminiWithResilience(
  ai: GoogleGenAI,
  contents: any[],
  systemInstruction: string,
  tools: any[]
): Promise<{ response: any; modelUsed: string }> {
  // Try models in order of priority; use lightweight and latest aliases to distribute quota
  const candidateModels = [
    'gemini-flash-latest',
    'gemini-3.1-flash-lite',
    'gemini-3.8-flash'
  ];

  let lastError: any = null;

  for (const model of candidateModels) {
    // If model recently hit 429 quota limit, skip it during cooldown
    if (modelCooldownUntil[model] && Date.now() < modelCooldownUntil[model]) {
      continue;
    }

    let timer: NodeJS.Timeout | null = null;
    try {
      const callPromise = ai.models.generateContent({
        model,
        contents,
        config: {
          systemInstruction,
          tools,
          temperature: 0.7
        }
      });

      // Prevent detached promise rejection from bubbling as UnhandledPromiseRejection if timeout occurs
      callPromise.catch(() => {});

      const timeoutPromise = new Promise((_, reject) => {
        timer = setTimeout(() => reject(new Error(`Timeout: ${model} took longer than 4000ms`)), 4000);
      });

      const response = await Promise.race([callPromise, timeoutPromise]);
      if (timer) clearTimeout(timer);
      return { response, modelUsed: model };
    } catch (err: any) {
      if (timer) clearTimeout(timer);
      lastError = err;
      const status = err?.status || err?.code || err?.error?.code;
      const msg = String(err?.message || '');
      const isQuotaExceeded = status === 429 ||
                              msg.includes('429') ||
                              msg.includes('quota') ||
                              msg.includes('RESOURCE_EXHAUSTED');

      if (isQuotaExceeded) {
        modelCooldownUntil[model] = Date.now() + 60000;
      }
    }
  }

  throw lastError || new Error('All model candidates unavailable');
}

// Global safety handler to prevent detached async operations from printing unhandled rejections
process.on('unhandledRejection', () => {
  // Gracefully absorb background rejections
});

// Main Chat endpoint with Gemini AI
app.post('/api/chat', async (req, res) => {
  try {
    const { message, history = [], cart = [], currentProductId = null, customer = null } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message is required' });
    }

    const ai = getGeminiClient();

    // If Gemini client is not initialized, use intelligent fallback
    if (!ai) {
      const fallback = generateFallbackResponse(message, { cart, currentProductId, customer });
      return res.json({
        reply: fallback.text,
        actionData: fallback.actionData,
        suggestedFollowUps: fallback.suggestedFollowUps,
        source: 'local_engine'
      });
    }

    // Prepare system instructions with rich store knowledge
    const systemInstruction = `
You are "Lumi", an elite, warm, highly competent 24/7 customer-facing AI agent for "${STORE_INFO.name}".
Your purpose is to provide instant, personalized, empathetic, and exceptionally practical support to e-commerce shoppers.

CURRENT STORE POLICIES & KNOWLEDGE:
${STORE_POLICIES_FAQ}

CURRENT SHOPPER CONTEXT:
- Customer Name: ${customer?.name || 'Alex Morgan'}
- Customer Email: ${customer?.email || 'alex.morgan@example.com'}
- Current Cart Items: ${JSON.stringify(cart.map((c: any) => ({ name: c.product?.name, qty: c.quantity, price: c.product?.price, size: c.selectedSize })))}
- Current Page / Product Viewed: ${currentProductId ? PRODUCTS.find(p => p.id === currentProductId)?.name : 'Browsing Storefront'}
- Known Customer Past Orders:
  1) ORD-9421 (Aerolite Backpack 24L - Shipped via FedEx, arriving tomorrow)
  2) ORD-8812 (Merino Wool Minimalist Overshirt - Delivered 5 days ago, eligible for 30-day return or size exchange)
  3) ORD-7305 (SoundPulse ANC Headphones - Processing in fulfillment center)

AVAILABLE PROMO CODES:
- 'WELCOME15' (15% off first order)
- 'SAVENOW20' ($20 off orders > $100)
- 'FREESHIP' (Free express delivery)

GUIDELINES FOR YOUR RESPONSES:
1. Be concise, polite, solution-oriented, and conversational. Use friendly e-commerce formatting (bullet points, bold text).
2. When the user asks about order status or a package, ALWAYS use the 'track_order' tool.
3. When the user asks for recommendations, product details, or gifts, use the 'search_products' tool to find matching items.
4. When the user wants to return or exchange an item, use the 'initiate_return' tool.
5. When the user asks about discounts or savings, recommend 'WELCOME15' or 'SAVENOW20' and call 'apply_promo'.
6. If the user explicitly asks for human support or has an irresolvable issue, use the 'escalate_to_human' tool.
7. Keep responses under 150 words unless detailed specs are requested.
`;

    // Setup chat tools
    const tools = [{
      functionDeclarations: [
        trackOrderTool,
        searchProductsTool,
        initiateReturnTool,
        applyPromoTool,
        escalateToHumanTool
      ]
    }];

    // Build chat conversation
    // Format conversation history for Gemini
    const contents: any[] = [];
    if (Array.isArray(history)) {
      for (const msg of history.slice(-6)) {
        contents.push({
          role: msg.sender === 'user' ? 'user' : 'model',
          parts: [{ text: msg.text }]
        });
      }
    }
    // Add current user prompt
    contents.push({
      role: 'user',
      parts: [{ text: message }]
    });

    let response: any = null;
    let modelUsed = 'gemini-flash-latest';

    try {
      const callResult = await callGeminiWithResilience(ai, contents, systemInstruction, tools);
      response = callResult.response;
      modelUsed = callResult.modelUsed;
    } catch {
      const fallback = generateFallbackResponse(message, { cart, currentProductId, customer });
      return res.json({
        reply: fallback.text,
        actionData: fallback.actionData,
        suggestedFollowUps: fallback.suggestedFollowUps,
        source: 'smart_concierge_engine'
      });
    }

    let actionData: any = null;
    let finalReply = response.text || '';
    let suggestedFollowUps: string[] = [];

    // Handle tool invocations if returned
    const functionCalls = response.functionCalls;
    if (functionCalls && functionCalls.length > 0) {
      const call = functionCalls[0];
      const args = call.args as any;

      if (call.name === 'track_order') {
        const result = executeTrackOrder(args.orderId || 'ORD-9421');
        if (result.found && result.order) {
          actionData = {
            type: 'order_status',
            order: result.order
          };
          suggestedFollowUps = ['Can I change my address?', 'How do returns work?', 'Track my other order'];
        }
      } else if (call.name === 'search_products') {
        const result = executeSearchProducts(args.query, args.category, args.maxPrice);
        actionData = {
          type: 'product_recommendation',
          products: result.products
        };
        suggestedFollowUps = ['Tell me more about the first item', 'Do you have discounts?', 'Check shipping costs'];
      } else if (call.name === 'initiate_return') {
        const result = executeInitiateReturn(args.orderId || 'ORD-8812', args.type || 'refund', args.reason || 'Customer request', args.exchangeSize);
        actionData = {
          type: 'return_initiated',
          returnTicket: result.ticket
        };
        suggestedFollowUps = ['How do I print the label?', 'When will my refund post?', 'Order a replacement size'];
      } else if (call.name === 'apply_promo') {
        const result = executeApplyPromo(args.code || 'WELCOME15');
        if (result.valid) {
          actionData = {
            type: 'promo_applied',
            promo: result.promo
          };
          suggestedFollowUps = ['Apply this code to my cart', 'Check minimum order requirement', 'What other deals do you have?'];
        }
      } else if (call.name === 'escalate_to_human') {
        const ticketId = `ESC-${Math.floor(1000 + Math.random() * 9000)}`;
        actionData = {
          type: 'escalation_ticket',
          ticketId
        };
        suggestedFollowUps = ['View my open orders', 'Return to shopping'];
      }

      // If text is empty or model only returned tool call, run secondary turn or generate natural wrapper
      if (!finalReply || finalReply.trim().length === 0) {
        if (call.name === 'track_order' && actionData?.order) {
          finalReply = `I found your shipment for order **${actionData.order.id}**! It is currently **${actionData.order.status}** with ${actionData.order.carrier} and estimated for delivery **${actionData.order.estimatedDelivery}**. Here is your live tracking details:`;
        } else if (call.name === 'initiate_return' && actionData?.returnTicket) {
          finalReply = `Your return request has been approved! I've created return ticket **${actionData.returnTicket.ticketId}** with a prepaid shipping label. You have 30 days to hand it over to any local courier.`;
        } else if (call.name === 'apply_promo' && actionData?.promo) {
          finalReply = `Great news! Promo code **${actionData.promo.code}** gives you **${actionData.promo.discountText}**! You can apply it directly to your cart at checkout.`;
        } else if (call.name === 'search_products' && actionData?.products) {
          finalReply = `Here are our best matching selections tailored for you:`;
        } else if (call.name === 'escalate_to_human') {
          finalReply = `I've opened a priority human support ticket for you (#${actionData.ticketId}). A specialist will review your request shortly!`;
        }
      }
    }

    // Default suggestions if none generated
    if (suggestedFollowUps.length === 0) {
      suggestedFollowUps = ['Track order ORD-9421', 'Recommend gifts under $100', 'Do you have any promo codes?', 'How do 30-day returns work?'];
    }

    return res.json({
      reply: finalReply,
      actionData,
      suggestedFollowUps,
      source: modelUsed
    });

  } catch {
    // Graceful fallback to avoid leaving user hanging
    const fallback = generateFallbackResponse(req.body?.message || '', req.body);
    return res.json({
      reply: fallback.text,
      actionData: fallback.actionData,
      suggestedFollowUps: fallback.suggestedFollowUps,
      source: 'fallback_engine'
    });
  }
});

// -------------------------------------------------------------
// Vite Middleware / Static Server Setup
// -------------------------------------------------------------
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Lumina E-Commerce Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
