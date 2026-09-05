export interface Product {
  id: string;
  name: string;
  tagline: string;
  category: 'Apparel' | 'Footwear' | 'Accessories' | 'Tech & EDC';
  price: number;
  originalPrice?: number;
  rating: number;
  reviewsCount: number;
  image: string;
  inStock: boolean;
  stockCount: number;
  sizes?: string[];
  colors?: string[];
  description: string;
  highlights: string[];
  sizingAdvice: string;
  materialsCare: string;
  sku: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
}

export interface OrderTimelineStep {
  title: string;
  time: string;
  completed: boolean;
  current: boolean;
  location?: string;
}

export interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  date: string;
  status: 'Processing' | 'Shipped' | 'Out for Delivery' | 'Delivered' | 'Cancelled' | 'Returned';
  items: {
    productId: string;
    productName: string;
    quantity: number;
    price: number;
    image: string;
    size?: string;
  }[];
  total: number;
  carrier: string;
  trackingNumber: string;
  estimatedDelivery: string;
  shippingAddress: string;
  timeline: OrderTimelineStep[];
  returnEligibleUntil: string;
}

export interface ReturnTicket {
  ticketId: string;
  orderId: string;
  productName: string;
  type: 'refund' | 'exchange';
  exchangeSize?: string;
  reason: string;
  status: 'Approved' | 'Label Generated' | 'Received' | 'Completed';
  prepaidLabelUrl: string;
  createdAt: string;
}

export interface PromoCode {
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrder: number;
  description: string;
}

export interface ChatActionData {
  type: 'product_recommendation' | 'order_status' | 'promo_applied' | 'return_initiated' | 'cart_updated' | 'escalation_ticket';
  products?: Product[];
  order?: Order;
  promo?: { code: string; discountText: string };
  returnTicket?: ReturnTicket;
  ticketId?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'agent';
  text: string;
  timestamp: string;
  actionData?: ChatActionData;
  suggestedFollowUps?: string[];
}

export interface AgentSettings {
  tone: 'friendly' | 'concierge' | 'speedy';
  proactivePrompts: boolean;
  autoApplyDiscounts: boolean;
  freeShippingThreshold: number;
  returnWindowDays: number;
}
